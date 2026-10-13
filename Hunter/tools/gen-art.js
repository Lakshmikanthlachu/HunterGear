#!/usr/bin/env node
/**
 * Ridgeline — SVG art generator
 *   - logo mark + favicon
 *   - product illustrations (assets/img/products/*.svg)
 * Landscape scenes (heroes, seasonal tiles, map) live in tools/gen-scenes.js.
 * Run: node tools/gen-art.js   (not needed to use the template)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = (p) => path.join(ROOT, 'assets', 'img', p);
const write = (rel, s) => { fs.mkdirSync(path.dirname(OUT(rel)), { recursive: true }); fs.writeFileSync(OUT(rel), s); };

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- logo: a ridge line inside a rifle-scope reticle ---------- */
const ridgeMark = (ring) => `<circle cx="24" cy="24" r="19" fill="none" stroke="${ring}" stroke-width="3"/><path d="M24 2v10M24 36v10M2 24h10M36 24h10" stroke="${ring}" stroke-width="3" stroke-linecap="round"/><path d="M12 33l7.5-12 4.5 6.5 5.5-10L36 33z" fill="#ff5f15" stroke="#ff5f15" stroke-width="2" stroke-linejoin="round"/>`;
write('logo-mark.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${ridgeMark('#0b1710')}</svg>`);
write('logo-mark-light.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${ridgeMark('#eaeee4')}</svg>`);
write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#12261b"/><g transform="translate(4 4) scale(.83)">${ridgeMark('#eaeee4')}</g></svg>`);

/* ---------- product illustrations ---------- */
const C = { pine: '#1e4a33', pineD: '#12261b', moss: '#5f7f4f', bark: '#6b4a2f', barkD: '#4a3320', kraft: '#c79a5b', blaze: '#ff5f15', steel: '#8d979c', steelD: '#5d676c', char: '#232b27', white: '#f5f7f1', olive: '#6b7554' };
const shadow = '<ellipse cx="300" cy="396" rx="175" ry="14" fill="#12261b" opacity=".16"/>';
const lensGrad = (id) => `<radialGradient id="${id}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#8fd0d6"/><stop offset=".5" stop-color="#2d5560"/><stop offset="1" stop-color="#0e242a"/></radialGradient>`;
const wrap = (inner, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450"><defs>${defs}</defs>${shadow}${inner}</svg>`;
function camoBlobs(seed, x, y, w, h, n = 34) {
  const r = rng(seed), cols = ['#3d5a35', '#6b4a2f', '#2a3a2a', '#8a9a6a', '#4f6b3f'];
  let s = '';
  for (let i = 0; i < n; i++) {
    const cx = x + r() * w, cy = y + r() * h, rx = 14 + r() * 30, ry = 8 + r() * 18, rot = r() * 180;
    s += `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" transform="rotate(${rot.toFixed(0)} ${cx.toFixed(0)} ${cy.toFixed(0)})" fill="${cols[Math.floor(r() * cols.length)]}"/>`;
  }
  return s;
}
const P = {};
P.binoculars = () => wrap(`
<rect x="146" y="100" width="98" height="70" rx="18" fill="${C.char}"/><rect x="356" y="100" width="98" height="70" rx="18" fill="${C.char}"/>
<rect x="268" y="150" width="64" height="120" rx="14" fill="${C.steelD}"/><rect x="278" y="150" width="44" height="120" rx="10" fill="${C.char}"/>
<g stroke="#8d979c" stroke-width="2" opacity=".7">${[170, 182, 194, 206, 218, 230, 242, 254].map((y) => `<path d="M284 ${y}h32"/>`).join('')}</g>
<circle cx="195" cy="255" r="106" fill="${C.char}"/><circle cx="405" cy="255" r="106" fill="${C.char}"/>
<circle cx="195" cy="255" r="88" fill="${C.pine}"/><circle cx="405" cy="255" r="88" fill="${C.pine}"/>
<circle cx="195" cy="255" r="74" fill="#0e1613"/><circle cx="405" cy="255" r="74" fill="#0e1613"/>
<circle cx="195" cy="255" r="64" fill="url(#g1)"/><circle cx="405" cy="255" r="64" fill="url(#g1)"/>
<circle cx="195" cy="255" r="95" fill="none" stroke="${C.blaze}" stroke-width="3"/><circle cx="405" cy="255" r="95" fill="none" stroke="${C.blaze}" stroke-width="3"/>
<ellipse cx="172" cy="228" rx="22" ry="12" transform="rotate(-35 172 228)" fill="#fff" opacity=".45"/><ellipse cx="382" cy="228" rx="22" ry="12" transform="rotate(-35 382 228)" fill="#fff" opacity=".45"/>`, lensGrad('g1'));
P.rangefinder = () => wrap(`
<rect x="110" y="140" width="380" height="190" rx="50" fill="${C.pine}"/>
<path d="M146 162h300" stroke="${C.moss}" stroke-width="7" stroke-linecap="round" opacity=".7"/>
<rect x="250" y="122" width="100" height="28" rx="14" fill="${C.blaze}"/>
<circle cx="190" cy="238" r="52" fill="${C.char}"/><circle cx="190" cy="238" r="38" fill="url(#g2)"/>
<circle cx="410" cy="238" r="66" fill="${C.char}"/><circle cx="410" cy="238" r="52" fill="url(#g2)"/>
<rect x="262" y="206" width="76" height="52" rx="9" fill="#0b1710"/>
<text x="300" y="244" text-anchor="middle" font-family="Courier New,monospace" font-weight="700" font-size="30" fill="${C.blaze}">312</text>
<ellipse cx="392" cy="218" rx="18" ry="9" transform="rotate(-35 392 218)" fill="#fff" opacity=".45"/>
<rect x="160" y="304" width="280" height="8" rx="4" fill="${C.pineD}" opacity=".5"/>`, lensGrad('g2'));
P.trailcam = () => wrap(`
<rect x="168" y="120" width="16" height="190" rx="6" fill="${C.char}"/><rect x="416" y="120" width="16" height="190" rx="6" fill="${C.char}"/>
<rect x="188" y="66" width="224" height="306" rx="28" fill="#4d5a3a"/>
<rect x="202" y="80" width="196" height="278" rx="20" fill="#5a6b45"/>
${camoBlobs(4, 204, 82, 192, 274, 20).replace(/ellipse/g, 'ellipse').replace(/fill="#(3d5a35|6b4a2f|2a3a2a|8a9a6a|4f6b3f)"/g, 'fill="#$1" opacity=".55"')}
<rect x="220" y="96" width="160" height="40" rx="10" fill="#1b231e"/>
${[0, 1, 2, 3, 4].map((i) => `<circle cx="${240 + i * 30}" cy="116" r="9" fill="#6e2c20"/><circle cx="${237 + i * 30}" cy="113" r="3" fill="#ff9a7a"/>`).join('')}
<circle cx="300" cy="216" r="56" fill="${C.char}"/><circle cx="300" cy="216" r="42" fill="url(#g3)"/>
<ellipse cx="286" cy="200" rx="14" ry="8" transform="rotate(-35 286 200)" fill="#fff" opacity=".45"/>
<circle cx="300" cy="306" r="22" fill="#1b231e"/><circle cx="300" cy="306" r="13" fill="#d7dfd1" opacity=".85"/>
<circle cx="360" cy="306" r="6" fill="${C.blaze}"/>
<rect x="226" y="338" width="148" height="10" rx="5" fill="#3a4630"/>`, lensGrad('g3'));
P.jacket = () => wrap(`
<clipPath id="jc"><path id="jp" d="M236 92 L364 92 L444 116 L512 318 L458 338 L410 196 L410 352 L190 352 L190 196 L142 338 L88 318 L156 116 Z"/></clipPath>
<path d="M236 92 L364 92 L444 116 L512 318 L458 338 L410 196 L410 352 L190 352 L190 196 L142 338 L88 318 L156 116 Z" fill="${C.moss}"/>
<g clip-path="url(#jc)">${camoBlobs(9, 80, 80, 450, 280, 60)}</g>
<path d="M88 318 L142 338 L132 364 L78 342 Z" fill="${C.pineD}"/><path d="M512 318 L458 338 L468 364 L522 342 Z" fill="${C.pineD}"/>
<rect x="190" y="336" width="220" height="20" rx="4" fill="${C.pineD}"/>
<path d="M236 92 Q300 134 364 92 L374 76 Q300 52 226 76 Z" fill="${C.pineD}"/>
<path d="M300 116V352" stroke="#d3dccd" stroke-width="3.5" stroke-dasharray="3 3"/>
<rect x="212" y="258" width="76" height="58" rx="7" fill="none" stroke="${C.char}" stroke-width="3"/><rect x="312" y="258" width="76" height="58" rx="7" fill="none" stroke="${C.char}" stroke-width="3"/>
<rect x="212" y="258" width="76" height="14" rx="4" fill="${C.char}" opacity=".35"/><rect x="312" y="258" width="76" height="14" rx="4" fill="${C.char}" opacity=".35"/>
<path d="M170 128 L180 190 M430 128 L420 190" stroke="${C.char}" stroke-width="3" opacity=".4"/>
<rect x="326" y="150" width="30" height="18" rx="3" fill="${C.blaze}"/>`);
P.vest = () => wrap(`
<clipPath id="vc"><path d="M222 92 L270 92 L300 150 L330 92 L378 92 L408 150 L426 352 L174 352 L192 150 Z"/></clipPath>
<path d="M222 92 L270 92 L300 150 L330 92 L378 92 L408 150 L426 352 L174 352 L192 150 Z" fill="${C.blaze}"/>
<g clip-path="url(#vc)"><rect x="170" y="238" width="260" height="24" fill="#eef2ea"/><rect x="170" y="292" width="260" height="14" fill="#eef2ea"/>
<path d="M214 92 L252 352 M386 92 L348 352" stroke="#eef2ea" stroke-width="14" opacity=".0"/></g>
<path d="M258 92 L300 168 L342 92 L358 92 L300 190 L242 92 Z" fill="#c9420a"/>
<path d="M300 190 V352" stroke="#7a2d06" stroke-width="3.5" stroke-dasharray="3 3"/>
<rect x="206" y="312" width="74" height="32" rx="5" fill="none" stroke="#9a3606" stroke-width="3"/><rect x="320" y="312" width="74" height="32" rx="5" fill="none" stroke="#9a3606" stroke-width="3"/>
<path d="M192 150 L200 196 M408 150 L400 196" stroke="#9a3606" stroke-width="3" opacity=".6"/>`);
P.beanie = () => wrap(`
<path d="M168 276 C168 112 432 112 432 276 Z" fill="${C.pine}"/>
<g stroke="${C.pineD}" stroke-width="3" opacity=".35" fill="none">${[-60, -30, 0, 30, 60].map((d) => `<path d="M${300 + d} 150 C${300 + d * 1.5} 200 ${300 + d * 1.7} 240 ${300 + d * 1.8} 270"/>`).join('')}</g>
<rect x="156" y="248" width="288" height="90" rx="22" fill="#2a6045"/>
<g stroke="${C.pineD}" stroke-width="3" opacity=".4">${Array.from({ length: 19 }, (_, i) => `<path d="M${176 + i * 14.5} 256V330"/>`).join('')}</g>
<rect x="262" y="266" width="76" height="54" rx="8" fill="${C.blaze}"/>
<path d="M276 306L289 288L297 298L308 282L324 306" fill="none" stroke="#0b1710" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);
function boot(upper, dark, rubber) {
  const body = 'M205 66 L336 66 L342 226 C390 238 468 248 488 296 L490 348 L196 348 L190 296 C196 240 202 160 205 66 Z';
  return wrap(`
<clipPath id="bc"><path d="${body}"/></clipPath>
<path d="${body}" fill="${upper}"/>
<g clip-path="url(#bc)">${rubber ? `<rect x="180" y="268" width="330" height="90" fill="${C.char}"/><path d="M180 268 H510" stroke="${C.blaze}" stroke-width="6"/>` : ''}
<path d="M392 250 C440 258 482 276 490 318 L490 348 L392 348 Z" fill="${dark}" opacity="${rubber ? 0 : 1}"/>
<path d="M190 292 L196 348 L242 348 L240 288 Z" fill="${dark}" opacity="${rubber ? 0 : 1}"/></g>
<rect x="205" y="66" width="131" height="28" rx="12" fill="${dark}"/>
<path d="M184 340 H498 V372 Q498 380 488 380 H194 Q184 380 184 372 Z" fill="${C.char}"/>
${Array.from({ length: 11 }, (_, i) => `<rect x="${196 + i * 27}" y="378" width="15" height="10" rx="3" fill="${C.char}"/>`).join('')}
${[0, 1, 2, 3, 4].map((k) => { const y = 112 + k * 24; return `<path d="M300 ${y} L342 ${y + 15} M342 ${y} L300 ${y + 15}" stroke="${C.kraft}" stroke-width="4.5" stroke-linecap="round"/><circle cx="344" cy="${y + 8}" r="4.5" fill="${C.steel}"/>`; }).join('')}
<path d="M208 70 V38 Q208 26 220 26 H232 V70" fill="none" stroke="${C.blaze}" stroke-width="9" stroke-linejoin="round"/>
<path d="M205 340 C260 330 300 330 340 336" stroke="#fff" stroke-width="3" opacity=".25" fill="none"/>`);
}
P.boot = () => boot('#7a5535', '#4a3320', false);
P.pacboot = () => boot(C.olive, '#4a5238', true);
function pack(body, lid, pocket, scale, tube) {
  return wrap(`<g transform="translate(300 225) scale(${scale}) translate(-300 -225)">
<rect x="164" y="248" width="56" height="116" rx="24" fill="${lid}"/><rect x="380" y="248" width="56" height="116" rx="24" fill="${lid}"/>
<rect x="192" y="72" width="216" height="304" rx="64" fill="${body}"/>
<path d="M192 152 C192 66 408 66 408 152 L408 190 H192 Z" fill="${lid}"/>
<path d="M268 76 q32 -26 64 0" fill="none" stroke="${C.char}" stroke-width="11" stroke-linecap="round"/>
<rect x="220" y="218" width="160" height="124" rx="28" fill="${pocket}"/>
<path d="M236 244 H364" stroke="${C.steel}" stroke-width="4" stroke-dasharray="5 4"/>
<rect x="224" y="150" width="18" height="76" rx="4" fill="${C.kraft}"/><rect x="358" y="150" width="18" height="76" rx="4" fill="${C.kraft}"/>
<rect x="220" y="182" width="26" height="14" rx="3" fill="${C.blaze}"/><rect x="354" y="182" width="26" height="14" rx="3" fill="${C.blaze}"/>
<rect x="164" y="284" width="56" height="10" rx="3" fill="${C.kraft}"/><rect x="380" y="284" width="56" height="10" rx="3" fill="${C.kraft}"/>
${tube ? `<path d="M340 80 C400 40 470 70 462 140" fill="none" stroke="${C.char}" stroke-width="7" stroke-linecap="round"/><rect x="452" y="136" width="20" height="16" rx="5" fill="${C.blaze}"/>` : ''}</g>`);
}
P.pack = () => pack(C.pine, '#183b29', C.moss, 1, false);
P.daypack = () => pack('#d44b0b', C.char, '#ff7a3b', 0.88, true);
P.bow = () => wrap(`
<path d="M300 120 C340 100 392 90 430 66" fill="none" stroke="${C.char}" stroke-width="15" stroke-linecap="round"/>
<path d="M300 330 C340 350 392 360 430 384" fill="none" stroke="${C.char}" stroke-width="15" stroke-linecap="round"/>
<path d="M300 112 C314 160 314 290 300 338" fill="none" stroke="${C.pine}" stroke-width="20" stroke-linecap="round"/>
<path d="M298 200 C306 218 306 250 298 268" fill="none" stroke="${C.kraft}" stroke-width="24" stroke-linecap="round"/>
<path d="M432 62 L338 225 L432 388" fill="none" stroke="${C.steelD}" stroke-width="2.5" opacity=".7"/>
<path d="M432 62 L214 225 L432 388" fill="none" stroke="#1d1d1d" stroke-width="3"/>
<circle cx="434" cy="60" r="28" fill="${C.steel}" stroke="${C.char}" stroke-width="6"/><circle cx="434" cy="60" r="8" fill="${C.char}"/>
<circle cx="434" cy="390" r="28" fill="${C.steel}" stroke="${C.char}" stroke-width="6"/><circle cx="434" cy="390" r="8" fill="${C.char}"/>
<path d="M214 225 H472" stroke="${C.bark}" stroke-width="5" stroke-linecap="round"/>
<path d="M472 213 L506 225 L472 237 Z" fill="${C.steel}"/>
<path d="M226 225 l18 -12 h26 l-14 12 l14 12 h-26 z" fill="${C.blaze}"/>
<circle cx="326" cy="196" r="5" fill="${C.blaze}"/><circle cx="326" cy="214" r="5" fill="${C.kraft}"/><rect x="316" y="160" width="12" height="10" fill="${C.char}"/>`);
P.arrows = () => {
  let s = '';
  for (let k = -2.5; k <= 2.5; k += 1) {
    const y = 225 + k * 17, dx = (k * 7) | 0;
    s += `<g><path d="M${86 + dx} ${y}H${486 + dx}" stroke="${k % 2 ? C.char : C.bark}" stroke-width="5" stroke-linecap="round"/>
<path d="M${100 + dx} ${y}l16 -12h34l-18 12l18 12h-34z" fill="${k % 2 ? C.blaze : '#f5f7f1'}"/><circle cx="${88 + dx}" cy="${y}" r="5" fill="${C.char}"/>
<path d="M${486 + dx} ${y - 9}L${526 + dx} ${y}L${486 + dx} ${y + 9}Z" fill="${C.steel}"/></g>`;
  }
  s += `<rect x="300" y="165" width="20" height="120" rx="5" fill="${C.kraft}"/>`;
  return wrap(`<g transform="rotate(-30 300 225)">${s}</g>`);
};
P.knife = () => wrap(`
<g transform="rotate(-14 310 220)">
<defs><linearGradient id="bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e9eb"/><stop offset=".5" stop-color="#a2adb2"/><stop offset="1" stop-color="#6f7b80"/></linearGradient></defs>
<path d="M262 186 H452 C496 188 524 212 536 236 C480 252 380 246 262 242 Z" fill="url(#bl)"/>
<path d="M276 204 H470" stroke="#fff" stroke-width="3" opacity=".6"/>
<path d="M262 242 C380 246 480 252 536 236" stroke="#5d676c" stroke-width="2.5" fill="none"/>
<path d="M92 204 Q92 182 122 182 H262 V246 H122 Q92 246 92 224 Z" fill="${C.barkD}"/>
<g stroke="${C.kraft}" stroke-width="2.5" opacity=".55">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${112 + i * 24} 184 Q${122 + i * 24} 214 ${108 + i * 24} 244"/>`).join('')}</g>
<rect x="254" y="172" width="16" height="84" rx="4" fill="${C.steel}"/>
<circle cx="150" cy="214" r="7" fill="${C.steel}"/><circle cx="214" cy="214" r="7" fill="${C.steel}"/>
<circle cx="108" cy="214" r="7" fill="#e8e8e0"/>
<path d="M110 214 q-34 4 -40 36" stroke="${C.blaze}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`);
P.hatchet = () => wrap(`
<g transform="rotate(34 300 225)">
<rect x="282" y="76" width="36" height="316" rx="15" fill="${C.bark}"/>
<rect x="282" y="270" width="36" height="116" rx="15" fill="${C.char}"/><g stroke="#4a5a4f" stroke-width="3">${[290, 306, 322, 338, 354, 370].map((y) => `<path d="M284 ${y}h32"/>`).join('')}</g>
<rect x="282" y="378" width="36" height="16" rx="8" fill="${C.blaze}"/>
<path d="M300 70 C236 46 192 70 184 140 C192 196 238 214 300 190 Z" fill="${C.steel}"/>
<path d="M300 70 C236 46 192 70 184 140" stroke="#e8eef0" stroke-width="3" fill="none" opacity=".7"/>
<path d="M184 140 C192 196 238 214 300 190" stroke="${C.steelD}" stroke-width="3" fill="none"/>
<path d="M300 78 H372 V184 H300 Z" fill="${C.steelD}"/><path d="M300 78 H372" stroke="#c9d3d6" stroke-width="3"/>
<circle cx="258" cy="130" r="9" fill="${C.char}" opacity=".5"/></g>`);
P.tent = () => wrap(`
<path d="M70 372 L40 392 M530 372 L560 392" stroke="${C.char}" stroke-width="2"/>
<path d="M90 352 C90 160 210 82 300 82 C390 82 510 160 510 352 Z" fill="${C.moss}"/>
<path d="M170 352 C170 200 238 104 300 82 C362 104 430 200 430 352 Z" fill="#729562"/>
<path d="M238 352 C238 272 268 214 300 192 C332 214 362 272 362 352 Z" fill="#17211b"/>
<path d="M300 192 V352" stroke="${C.steel}" stroke-width="3" stroke-dasharray="4 4"/>
<path d="M130 352 C140 200 230 104 300 82 M470 352 C460 200 370 104 300 82" fill="none" stroke="${C.pineD}" stroke-width="5" opacity=".7"/>
<path d="M90 330 H510 V352 H90 Z" fill="${C.pineD}"/><path d="M90 337 H510" stroke="${C.blaze}" stroke-width="4"/>
<path d="M150 196 L68 378 M450 196 L532 378" stroke="${C.char}" stroke-width="2.5"/>
<path d="M60 380 l10 -10 l10 10 z M520 380 l10 -10 l10 10 z" fill="${C.blaze}"/>`);
P.lantern = () => wrap(`
<defs><radialGradient id="glow" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#fff8d2"/><stop offset=".65" stop-color="#f6d56a"/><stop offset="1" stop-color="#e7a93a"/></radialGradient></defs>
<path d="M236 122 C236 52 364 52 364 122" fill="none" stroke="${C.char}" stroke-width="13" stroke-linecap="round"/>
<rect x="200" y="112" width="200" height="40" rx="16" fill="${C.char}"/>
<rect x="218" y="150" width="164" height="170" rx="18" fill="url(#glow)"/>
<rect x="288" y="172" width="24" height="120" rx="12" fill="#fffdf0"/>
<path d="M218 150V320M382 150V320" stroke="${C.char}" stroke-width="9"/>
<ellipse cx="248" cy="200" rx="10" ry="40" fill="#fff" opacity=".4"/>
<rect x="200" y="312" width="200" height="50" rx="16" fill="${C.char}"/>
<circle cx="300" cy="337" r="11" fill="${C.blaze}"/>
<rect x="222" y="326" width="40" height="8" rx="4" fill="${C.pine}"/>`);
P.headlamp = () => wrap(`
<path d="M24 258 C130 200 470 200 576 258" fill="none" stroke="${C.char}" stroke-width="34"/>
<path d="M24 258 C130 200 470 200 576 258" fill="none" stroke="${C.blaze}" stroke-width="7"/>
<rect x="212" y="158" width="176" height="128" rx="34" fill="${C.pine}"/>
<rect x="262" y="164" width="76" height="14" rx="7" fill="${C.blaze}"/>
<circle cx="300" cy="232" r="52" fill="${C.char}"/><circle cx="300" cy="232" r="40" fill="url(#hg)"/>
<circle cx="300" cy="232" r="64" fill="none" stroke="#f6d56a" stroke-width="3" opacity=".5"/>
<ellipse cx="284" cy="214" rx="14" ry="8" transform="rotate(-35 284 214)" fill="#fff" opacity=".7"/>
<rect x="232" y="270" width="136" height="8" rx="4" fill="${C.pineD}" opacity=".5"/>`, `<radialGradient id="hg" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fffbe6"/><stop offset=".6" stop-color="#f6d56a"/><stop offset="1" stop-color="#c98a24"/></radialGradient>`);
P.bottle = () => wrap(`
<path d="M262 74 V52 Q262 40 274 40 H326 Q338 40 338 52 V74" fill="none" stroke="${C.char}" stroke-width="12" stroke-linecap="round"/>
<rect x="228" y="70" width="144" height="56" rx="20" fill="${C.char}"/>
<rect x="238" y="118" width="124" height="260" rx="40" fill="${C.pine}"/>
<rect x="238" y="214" width="124" height="68" fill="${C.blaze}"/>
<path d="M258 262 L276 238 L288 252 L304 228 L326 262" fill="none" stroke="#0b1710" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="252" y="130" width="14" height="230" rx="7" fill="#fff" opacity=".2"/>
<rect x="238" y="360" width="124" height="18" rx="9" fill="${C.char}"/>`);

for (const [k, fn] of Object.entries(P)) write(`products/${k}.svg`, fn());

console.log('art generated');
