#!/usr/bin/env node
/**
 * Ridgeline — scene generator
 * Paints atmospheric landscape scenes (layered ridges, pines, mist, sun/moon, water)
 * as SVG into tools/.scenes/, plus a flat map. tools/raster.py renders them to HD JPGs
 * in assets/img/heroes, assets/img/seasons and assets/img/map-placeholder.jpg.
 * These are stand-ins: overwrite the JPGs (same file names) with your own photography.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '.scenes');
fs.mkdirSync(OUT, { recursive: true });

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function noise1(seed) {
  const r = rng(seed), t = Array.from({ length: 512 }, () => r()), sm = (u) => u * u * (3 - 2 * u);
  return (x) => { const i = Math.floor(x), f = sm(x - i), a = t[((i % 512) + 512) % 512], b = t[(((i + 1) % 512) + 512) % 512]; return a + (b - a) * f; };
}
function ridge(seed, w, base, amp, scale, rough = 0.5) {
  const n = noise1(seed), pts = [];
  for (let x = 0; x <= w; x += 8) {
    let y = 0, a = 1, f = 1 / scale, tot = 0;
    for (let o = 0; o < 4; o++) { y += a * n(x * f + o * 13.7); tot += a; a *= rough; f *= 2.1; }
    pts.push([x, base - (y / tot - 0.5) * 2 * amp]);
  }
  return pts;
}
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (c1, c2, t) => '#' + hex(c1).map((v, i) => Math.round(lerp(v, hex(c2)[i], t)).toString(16).padStart(2, '0')).join('');
const f1 = (n) => Math.round(n * 10) / 10;

function pine(x, yb, h, snow) {
  let d = '';
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const top = yb - h + (i * h * 0.19), bot = top + h * 0.34, hw = h * 0.1 * (1 + i * 0.5);
    d += `M${f1(x)} ${f1(top)}L${f1(x + hw)} ${f1(bot)}L${f1(x + hw * 0.35)} ${f1(bot - h * 0.03)}L${f1(x - hw * 0.35)} ${f1(bot - h * 0.03)}L${f1(x - hw)} ${f1(bot)}Z`;
  }
  d += `M${f1(x - h * 0.02)} ${f1(yb - h * 0.12)}h${f1(h * 0.04)}v${f1(h * 0.14)}h${f1(-h * 0.04)}Z`;
  return d;
}

function scene(o) {
  const { w, h, seed, sky, sun, moon, stars, layers, haze, mist = 0.5, trees = [], frame = false, snow = false,
    water = null, reeds = false, birds = 0, fog = 0, treeColor, shade = '#050a08', vignette = 0.45 } = o;
  const r = rng(seed);
  const waterY = water ? h * water.y : h;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`;
  s += `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".55" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${sun ? sun.glow : '#fff'}" stop-opacity=".9"/><stop offset=".35" stop-color="${sun ? sun.glow : '#fff'}" stop-opacity=".35"/><stop offset="1" stop-color="${sun ? sun.glow : '#fff'}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${vignette}"/></radialGradient>
<linearGradient id="foot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade}" stop-opacity="0"/><stop offset="1" stop-color="${shade}" stop-opacity=".85"/></linearGradient>
<filter id="blur2"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="blur10"><feGaussianBlur stdDeviation="14"/></filter><filter id="blur40"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
<clipPath id="land"><rect width="${w}" height="${f1(waterY)}"/></clipPath><clipPath id="wat"><rect y="${f1(waterY)}" width="${w}" height="${f1(h - waterY)}"/></clipPath>
</defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  if (stars) for (let i = 0; i < 260; i++) s += `<circle cx="${f1(r() * w)}" cy="${f1(r() * h * 0.55)}" r="${f1(0.5 + r() * 1.6)}" fill="#fff" opacity="${f1(0.25 + r() * 0.65)}"/>`;
  if (sun) {
    s += `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r * 6}" fill="url(#glow)"/><circle cx="${sun.x}" cy="${sun.y}" r="${sun.r}" fill="${sun.color}"/>`;
  }
  if (moon) {
    s += `<circle cx="${moon.x}" cy="${moon.y}" r="${moon.r * 5}" fill="url(#glow)" opacity=".55"/><circle cx="${moon.x}" cy="${moon.y}" r="${moon.r}" fill="#f4f1e2"/><circle cx="${moon.x - moon.r * 0.3}" cy="${moon.y - moon.r * 0.15}" r="${moon.r * 0.22}" fill="#d9d5bf" opacity=".6"/><circle cx="${moon.x + moon.r * 0.35}" cy="${moon.y + moon.r * 0.3}" r="${moon.r * 0.16}" fill="#d9d5bf" opacity=".5"/>`;
  }
  // soft clouds
  for (let i = 0; i < 4; i++) s += `<ellipse cx="${f1(r() * w)}" cy="${f1(h * (0.12 + r() * 0.3))}" rx="${f1(w * (0.1 + r() * 0.12))}" ry="${f1(h * (0.012 + r() * 0.02))}" fill="${haze}" opacity="${f1(0.1 + r() * 0.16)}" filter="url(#blur10)"/>`;
  if (birds) for (let i = 0; i < birds; i++) {
    const bx = w * (0.15 + r() * 0.6), by = h * (0.12 + r() * 0.28), sz = 10 + r() * 18;
    s += `<path d="M${f1(bx - sz)} ${f1(by)}Q${f1(bx - sz / 2)} ${f1(by - sz / 2)} ${f1(bx)} ${f1(by + sz * 0.1)}Q${f1(bx + sz / 2)} ${f1(by - sz / 2)} ${f1(bx + sz)} ${f1(by)}" fill="none" stroke="#0b1710" stroke-width="${f1(1.6 + sz / 12)}" stroke-linecap="round" opacity=".75"/>`;
  }
  const rl = layers.map((L, i) => ({ ...L, pts: ridge(seed * 10 + i, w, h * L.base, h * L.amp, L.scale, L.rough || 0.5) }));
  const land = [];
  rl.forEach((L, i) => {
    const poly = `M0 ${h}L${L.pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')}L${w} ${h}Z`;
    land.push(poly);
    s += `<g clip-path="url(#land)"><path d="${poly}" fill="${L.color}"/>`;
    if (snow && i < rl.length - 1) {
      s += `<path d="M0 ${h}L${L.pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')}L${w} ${h}Z" fill="#fff" opacity=".0"/><path d="M${L.pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')}" fill="none" stroke="#fff" stroke-width="${f1(3 + i * 2)}" opacity="${f1(0.35 + i * 0.08)}"/>`;
    }
    // trees
    if (trees.includes(i)) {
      const th = h * (L.tree || 0.06), gap = L.gap || th * 0.38;
      let d = '';
      for (let x = -10; x < w + 20; x += gap * (0.6 + r() * 0.8)) {
        const idx = Math.min(L.pts.length - 1, Math.max(0, Math.round(x / 8)));
        d += pine(x, L.pts[idx][1] + th * 0.12, th * (0.75 + r() * 0.5));
      }
      s += `<path d="${d}" fill="${L.treeColor || treeColor}"/>`;
      if (snow) s += `<path d="${d}" fill="#fff" opacity=".28" transform="translate(${f1(th * 0.03)} ${f1(-th * 0.015)})"/>`;
    }
    s += `</g>`;
    const next = rl[i + 1];
    if (next) {
      const yc = Math.min(...next.pts.map((p) => p[1]));
      const bandH = h * 0.2;
      s += `<g clip-path="url(#land)"><rect x="0" y="${f1(yc - bandH * 0.4)}" width="${w}" height="${f1(bandH)}" fill="url(#mist${i})"/></g>`;
      s = s.replace('</defs>', `<linearGradient id="mist${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haze}" stop-opacity="0"/><stop offset=".55" stop-color="${haze}" stop-opacity="${f1(mist * (1 - i / (rl.length + 1)))}"/><stop offset="1" stop-color="${haze}" stop-opacity="0"/></linearGradient></defs>`);
    }
  });
  if (frame) {
    const fl = (side) => {
      let d = '';
      for (let k = 0; k < 7; k++) {
        const x = side === 'l' ? w * (0.0 + r() * 0.13) : w * (0.87 + r() * 0.13);
        d += pine(x, h * (1.02 + r() * 0.04), h * (0.42 + r() * 0.32));
      }
      return d;
    };
    s += `<g clip-path="url(#land)"><path d="${fl('l')}" fill="${shade}"/><path d="${fl('r')}" fill="${shade}"/></g>`;
  }
  if (water) {
    s += `<rect y="${f1(waterY)}" width="${w}" height="${f1(h - waterY)}" fill="${water.color}"/>`;
    s += `<g clip-path="url(#wat)" opacity="${water.reflect}" filter="url(#blur2)"><g transform="translate(0 ${f1(waterY * 2)}) scale(1 -1)">`;
    s += `<rect width="${w}" height="${f1(waterY)}" fill="url(#sky)"/>`;
    if (sun) s += `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r * 6}" fill="url(#glow)"/>`;
    land.forEach((p, i) => { s += `<path d="${p}" fill="${rl[i].color}"/>`; });
    s += `</g></g>`;
    for (let i = 0; i < 140; i++) {
      const y = waterY + 8 + Math.pow(r(), 1.5) * (h - waterY - 8), ww = 20 + r() * 220;
      s += `<rect x="${f1(r() * w - ww / 2)}" y="${f1(y)}" width="${f1(ww)}" height="${f1(1 + (y - waterY) / (h - waterY) * 3)}" rx="2" fill="#fff" opacity="${f1(0.05 + r() * 0.12)}"/>`;
    }
    s += `<rect y="${f1(waterY)}" width="${w}" height="${f1(h - waterY)}" fill="url(#foot)" opacity=".7"/>`;
  }
  if (reeds) {
    let d = '', heads = '';
    for (let i = 0; i < 70; i++) {
      const left = r() < 0.5, x = left ? r() * w * 0.32 : w * (0.66 + r() * 0.34), hh = h * (0.22 + r() * 0.34), lean = (left ? 1 : -1) * (r() * 50 - 8);
      d += `M${f1(x)} ${h + 10}Q${f1(x + lean * 0.3)} ${f1(h - hh * 0.5)} ${f1(x + lean)} ${f1(h - hh)}`;
      if (r() < 0.55) heads += `<ellipse cx="${f1(x + lean)}" cy="${f1(h - hh + 22)}" rx="7" ry="26" fill="#2a1d14" transform="rotate(${f1(lean / 4)} ${f1(x + lean)} ${f1(h - hh)})"/>`;
    }
    s += `<path d="${d}" fill="none" stroke="${shade}" stroke-width="4" stroke-linecap="round"/>${heads}`;
  }
  s += `<rect y="${f1(h * 0.62)}" width="${w}" height="${f1(h * 0.38)}" fill="url(#foot)" opacity="${water ? 0.0 : 0.9}"/>`;
  if (fog) s += `<rect y="${f1(h * 0.25)}" width="${w}" height="${f1(h * 0.6)}" fill="${haze}" opacity="${fog}" filter="url(#blur40)"/>`;
  s += `<rect width="${w}" height="${h}" fill="url(#vig)"/>`;
  s += `<rect width="${w}" height="${h}" filter="url(#grain)" opacity=".16" style="mix-blend-mode:overlay"/>`;
  return s + '</svg>';
}

const W = 2400;
const ridgeSet = (cols, bases, amps, scales, extra = {}) => cols.map((c, i) => ({ color: c, base: bases[i], amp: amps[i], scale: scales[i], ...(extra[i] || {}) }));
const scenes = {
  'heroes/hero-home': { w: W, h: 1350, seed: 11, sky: ['#0d2b36', '#2f6a6b', '#f2a665'], sun: { x: 1560, y: 450, r: 70, color: '#ffe3b0', glow: '#ffb067' }, haze: '#f6c08a', mist: 0.55, treeColor: '#0a1a15', frame: true, birds: 5,
    layers: ridgeSet(['#78a3a1', '#5a8a89', '#437572', '#2d5852', '#1b3a32', '#0d211c'], [0.55, 0.62, 0.7, 0.78, 0.86, 0.95], [0.05, 0.06, 0.07, 0.07, 0.06, 0.05], [420, 340, 280, 230, 190, 150],
      { 3: { tree: 0.07 }, 4: { tree: 0.11 }, 5: { tree: 0.17 } }), trees: [3, 4, 5] },
  'heroes/hero-products': { w: W, h: 900, seed: 23, sky: ['#3a2a3f', '#c26e4c', '#ffd08a'], sun: { x: 1750, y: 420, r: 60, color: '#fff0c4', glow: '#ffbb66' }, haze: '#ffd9a0', mist: 0.5, treeColor: '#2a160e', frame: true, birds: 4,
    layers: ridgeSet(['#d9a273', '#b87e56', '#8f5d3e', '#64402b', '#3f291d', '#22140e'], [0.55, 0.63, 0.71, 0.79, 0.88, 0.97], [0.06, 0.07, 0.07, 0.07, 0.06, 0.05], [380, 320, 260, 210, 170, 140],
      { 3: { tree: 0.09 }, 4: { tree: 0.13 }, 5: { tree: 0.2 } }), trees: [3, 4, 5] },
  'heroes/hero-safety': { w: W, h: 900, seed: 37, sky: ['#2b1230', '#c2452e', '#ff9a3d'], sun: { x: 1560, y: 480, r: 100, color: '#fff1c8', glow: '#ff7a2c' }, haze: '#ff9a5a', mist: 0.5, treeColor: '#12080f', frame: true,
    layers: ridgeSet(['#9a3f3a', '#76303a', '#542435', '#3a1a2c', '#240f20', '#12080f'], [0.58, 0.65, 0.72, 0.8, 0.88, 0.97], [0.05, 0.06, 0.07, 0.07, 0.06, 0.05], [400, 330, 270, 220, 180, 140],
      { 3: { tree: 0.09 }, 4: { tree: 0.14 }, 5: { tree: 0.21 } }), trees: [3, 4, 5] },
  'heroes/hero-contact': { w: W, h: 900, seed: 53, sky: ['#10223d', '#3c6190', '#eaaa8c'], sun: { x: 1700, y: 400, r: 46, color: '#ffe9cf', glow: '#ffb48a' }, haze: '#c9b5b0', mist: 0.45, treeColor: '#0b1624', frame: false,
    water: { y: 0.68, color: '#1b3250', reflect: 0.55 },
    layers: ridgeSet(['#6784ab', '#4d688e', '#374f73', '#25384f', '#16222f'], [0.42, 0.5, 0.57, 0.63, 0.68], [0.05, 0.06, 0.05, 0.04, 0.03], [420, 330, 260, 200, 160],
      { 3: { tree: 0.07 }, 4: { tree: 0.12 } }), trees: [3, 4] },
  'heroes/hero-404': { w: W, h: 900, seed: 71, sky: ['#2a3a3a', '#58736f', '#a9c0b7'], moon: { x: 1750, y: 230, r: 44 }, haze: '#c5d4cc', mist: 0.8, fog: 0.35, treeColor: '#0e1a16', frame: true,
    layers: ridgeSet(['#8fa8a0', '#6f8c85', '#4f6f68', '#365650', '#223a35', '#0f1d19'], [0.5, 0.58, 0.66, 0.75, 0.86, 0.97], [0.05, 0.06, 0.07, 0.07, 0.06, 0.05], [380, 320, 260, 210, 170, 140],
      { 2: { tree: 0.06 }, 3: { tree: 0.09 }, 4: { tree: 0.14 }, 5: { tree: 0.22 } }), trees: [2, 3, 4, 5] },
  'heroes/hero-soon': { w: W, h: 1350, seed: 97, sky: ['#040a14', '#0d2733', '#2b5a5a'], moon: { x: 1640, y: 330, r: 62 }, stars: true, haze: '#4f8a8a', mist: 0.4, treeColor: '#050d0c', frame: true,
    water: { y: 0.76, color: '#0a1c22', reflect: 0.5 }, sun: null,
    layers: ridgeSet(['#285458', '#1c4247', '#13323a', '#0c2229', '#07161b'], [0.5, 0.58, 0.66, 0.73, 0.76], [0.06, 0.07, 0.06, 0.05, 0.03], [420, 330, 260, 200, 160],
      { 2: { tree: 0.07 }, 3: { tree: 0.11 }, 4: { tree: 0.14 } }), trees: [2, 3, 4] },
  'seasons/archery': { w: 1200, h: 900, seed: 3, sky: ['#183a2e', '#5c9a72', '#f7d9a0'], sun: { x: 900, y: 210, r: 44, color: '#fff3d0', glow: '#ffdc8a' }, haze: '#e8e0b4', mist: 0.6, treeColor: '#08150f', frame: true,
    layers: ridgeSet(['#7bab88', '#5a8d6a', '#3f6d52', '#264b3a', '#122a20'], [0.52, 0.6, 0.69, 0.78, 0.9], [0.05, 0.06, 0.06, 0.05, 0.04], [260, 210, 170, 140, 110],
      { 2: { tree: 0.09 }, 3: { tree: 0.14 }, 4: { tree: 0.22 } }), trees: [2, 3, 4] },
  'seasons/deer': { w: 1200, h: 900, seed: 8, sky: ['#3a2a2a', '#b86a43', '#f3b872'], sun: { x: 900, y: 220, r: 50, color: '#ffeccb', glow: '#ffb35a' }, haze: '#ffcf93', mist: 0.55, treeColor: '#25130b', frame: false,
    layers: ridgeSet(['#d4a070', '#b17c52', '#8b5a38', '#5f3a25', '#37221a'], [0.55, 0.64, 0.73, 0.83, 0.93], [0.05, 0.06, 0.06, 0.05, 0.04], [300, 240, 190, 150, 120],
      { 3: { tree: 0.08 }, 4: { tree: 0.14 } }), trees: [3, 4] },
  'seasons/waterfowl': { w: 1200, h: 900, seed: 15, sky: ['#16324a', '#4f8fa6', '#f6c79a'], sun: { x: 840, y: 400, r: 40, color: '#fff0d6', glow: '#ffbf8a' }, haze: '#e8c9b0', mist: 0.45, treeColor: '#0a1b21', reeds: true, birds: 7,
    water: { y: 0.64, color: '#2b5f78', reflect: 0.6 },
    layers: ridgeSet(['#6f9aa8', '#51808f', '#38626f', '#244652'], [0.43, 0.5, 0.57, 0.63], [0.05, 0.05, 0.04, 0.03], [260, 210, 170, 140], { 3: { tree: 0.07 } }), trees: [3] },
  'seasons/winter': { w: 1200, h: 900, seed: 29, sky: ['#5d7186', '#a9bccb', '#eef3f6'], haze: '#f4f8fb', mist: 0.7, treeColor: '#2a3f45', snow: true, frame: false,
    layers: ridgeSet(['#d7e3ec', '#bccddb', '#9cb3c4', '#6f8aa0', '#3d5566'], [0.5, 0.6, 0.7, 0.8, 0.92], [0.06, 0.06, 0.06, 0.05, 0.04], [280, 230, 190, 150, 120],
      { 2: { tree: 0.09 }, 3: { tree: 0.15 }, 4: { tree: 0.24 } }), trees: [2, 3, 4], vignette: 0.3, shade: '#1c2a33' }
};

const manifest = [];
for (const [name, cfg] of Object.entries(scenes)) {
  const file = name.replace('/', '__') + '.svg';
  fs.writeFileSync(path.join(OUT, file), scene(cfg));
  manifest.push({ svg: file, out: name + '.jpg', w: cfg.w, h: cfg.h, q: 84 });
}

/* flat, line-free map placeholder */
function mapSvg() {
  const w = 1200, h = 900, r = rng(5);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#dfe6d3"/><g transform="rotate(-9 600 450)">`;
  const cols = [0, 150, 300, 480, 640, 790, 960, 1130, 1300], rows = [-120, 20, 170, 330, 470, 610, 760, 940, 1100];
  for (let i = 0; i < cols.length - 1; i++) for (let j = 0; j < rows.length - 1; j++) {
    const park = r() < 0.16, x = cols[i] - 120 + 12, y = rows[j] + 12, bw = cols[i + 1] - cols[i] - 24, bh = rows[j + 1] - rows[j] - 24;
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="${park ? '#c4dbb0' : (r() < 0.5 ? '#eef1e5' : '#e8ecdd')}"/>`;
    if (!park && r() < 0.5) s += `<rect x="${x + 14}" y="${y + 14}" width="${bw * 0.4}" height="${bh * 0.35}" rx="4" fill="#d9dfcc"/>`;
  }
  s += `<path d="M-100 700 C200 620 330 760 600 640 S1000 520 1400 600" fill="none" stroke="#a9ccd8" stroke-width="64" stroke-linecap="round"/><path d="M-100 700 C200 620 330 760 600 640 S1000 520 1400 600" fill="none" stroke="#bcd9e3" stroke-width="40" stroke-linecap="round"/>`;
  s += `</g><path d="M-40 560 C260 520 440 470 640 430 S1000 330 1260 300" fill="none" stroke="#e9a85a" stroke-width="30" stroke-linecap="round"/><path d="M-40 560 C260 520 440 470 640 430 S1000 330 1260 300" fill="none" stroke="#fff6e2" stroke-width="22" stroke-linecap="round"/>`;
  s += `<text x="190" y="528" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#7a5a2c" transform="rotate(-7 190 528)">Timberline Road</text>`;
  s += `<ellipse cx="640" cy="470" rx="34" ry="10" fill="#12261b" opacity=".25"/><path d="M640 466C610 424 596 404 596 378a44 44 0 0 1 88 0c0 26-14 46-44 88z" fill="#ff5f15"/><circle cx="640" cy="378" r="17" fill="#fff"/></svg>`;
  return s;
}
fs.writeFileSync(path.join(OUT, 'map.svg'), mapSvg());
manifest.push({ svg: 'map.svg', out: 'map-placeholder.jpg', w: 1200, h: 900, q: 88 });
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('scenes written:', manifest.length);
