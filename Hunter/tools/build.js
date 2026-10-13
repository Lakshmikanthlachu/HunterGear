#!/usr/bin/env node
/**
 * Ridgeline — page generator (optional dev tool).
 * Writes index.html, 404.html, coming-soon.html and pages/*.html using shared
 * header/footer partials so every page stays identical in structure.
 * Run: node tools/build.js && npm run build:css
 */
const fs = require('fs');
const path = require('path');
const D = require('./data');
const { icon, bigIcon } = require('./icons');
const ROOT = path.resolve(__dirname, '..');
const { site } = D;

const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => '$' + n.toLocaleString('en-US');
const byId = Object.fromEntries(D.products.map((p) => [p.id, p]));
const catName = Object.fromEntries(D.categories.map((c) => [c.id, c.name]));
const catCount = (id) => D.products.filter((p) => p.cat === id).length;

/* ---- path helpers: every link/asset is relative to the page that uses it ---- */
let FROM = 'index.html';
const rel = (to) => path.posix.relative(path.posix.dirname(FROM), to) || to;
const A = (p) => rel('assets/' + p);
const L = (p) => rel(p);

/* ---------- partials ---------- */
function logo(tone = 'auto') {
  const ring = tone === 'light' ? 'text-white' : 'text-ink';
  const word = tone === 'light' ? 'text-white' : 'text-ink';
  const sub = tone === 'light' ? 'text-white/70' : 'text-muted';
  // ridge line inside a scope reticle; ring uses currentColor so it follows the theme
  const mark = `<svg class="h-11 w-11" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="19" stroke="currentColor" stroke-width="3"/><path d="M24 2v10M24 36v10M2 24h10M36 24h10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M12 33l7.5-12 4.5 6.5 5.5-10L36 33z" fill="#ff5f15" stroke="#ff5f15" stroke-width="2" stroke-linejoin="round"/></svg>`;
  return `<a href="${L('index.html')}" class="inline-flex items-center gap-3" aria-label="${e(site.name)} home">
          <span class="${ring}">${mark}</span>
          <span class="font-display leading-none"><span class="block text-[1.7rem] font-extrabold uppercase tracking-wide ${word}">Ridgeline</span><span class="block text-base font-semibold ${sub}">Outfitters</span></span>
        </a>`;
}

const themeBtn = `<button type="button" class="icon-btn" data-theme-toggle aria-pressed="false" aria-label="Switch to dark mode"><span class="dark:hidden">${icon('moon', 'h-5 w-5')}</span><span class="hidden dark:inline">${icon('sun', 'h-5 w-5')}</span></button>`;
const dirBtn = `<button type="button" class="icon-btn" data-dir-toggle aria-pressed="false" aria-label="Switch to right-to-left layout" title="Toggle RTL">${icon('dir', 'h-5 w-5')}</button>`;

function header(active) {
  const links = D.nav.map((n) => `<a class="nav-link" href="${L(n.to)}"${n.key === active ? ' aria-current="page"' : ''}>${e(n.label)}</a>`).join('\n          ');
  const mlinks = D.nav.map((n) => `<a class="mnav-link" href="${L(n.to)}"${n.key === active ? ' aria-current="page"' : ''}>${e(n.label)}<span class="rtl-flip text-accent">${icon('arrow', 'h-5 w-5')}</span></a>`).join('\n        ');
  return `<header class="sticky top-0 z-50 border-b border-line bg-page">
    <div class="container-x flex h-[72px] items-center justify-between gap-4">
      ${logo()}
      <nav class="hidden items-center gap-8 xl:flex" aria-label="Primary">
          ${links}
      </nav>
      <div class="flex items-center gap-2">
        ${themeBtn}
        ${dirBtn}
        <a class="btn btn-primary btn-sm hidden sm:inline-flex" href="${L('pages/contact.html')}">Enquire now</a>
        <button type="button" class="icon-btn xl:hidden" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span class="icon-open">${icon('menu', 'h-6 w-6')}</span><span class="icon-close hidden">${icon('x', 'h-6 w-6')}</span></button>
      </div>
    </div>
    <div id="mobile-menu" class="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-line bg-page shadow-xl xl:hidden">
      <nav class="container-x pb-5 pt-2" aria-label="Mobile">
        ${mlinks}
        <a class="btn btn-primary mt-5 w-full sm:hidden" href="${L('pages/contact.html')}">Enquire now</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  const shop = D.categories.map((c) => `<li><a class="hover:text-white hover:underline" href="${L('pages/products.html')}?cat=${c.id}">${e(c.name)}</a></li>`).join('\n              ');
  const hours = site.hours.map(([d, h]) => `<div class="flex justify-between gap-4"><dt>${e(d)}</dt><dd class="text-white">${e(h)}</dd></div>`).join('\n              ');
  const soc = [['facebook', 'Facebook', 'https://www.facebook.com/'], ['instagram', 'Instagram', 'https://www.instagram.com/'], ['youtube', 'YouTube', 'https://www.youtube.com/'], ['xsocial', 'X', 'https://x.com/']]
    .map(([i, n, u]) => `<a class="inline-flex h-11 w-11 items-center justify-center rounded border-2 border-white/25 text-white transition-colors hover:border-blaze-500 hover:text-blaze-400" href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${n}">${icon(i, 'h-5 w-5')}</a>`).join('\n            ');
  return `<footer class="bg-[rgb(var(--footer))] text-lichen-300">
    <div class="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
      <div class="lg:col-span-4">
        ${logo('light')}
        <p class="mt-5 max-w-sm">${e(site.tagline)}</p>
        <div class="mt-6 flex gap-2">
            ${soc}
        </div>
      </div>
      <nav class="lg:col-span-2" aria-label="Shop by category">
        <p class="font-display text-xl font-bold text-white">Shop</p>
        <ul class="mt-4 space-y-2">
              ${shop}
        </ul>
      </nav>
      <nav class="lg:col-span-2" aria-label="Footer">
        <p class="font-display text-xl font-bold text-white">Explore</p>
        <ul class="mt-4 space-y-2">
          ${D.nav.map((n) => `<li><a class="hover:text-white hover:underline" href="${L(n.to)}">${e(n.label)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <div class="lg:col-span-4">
        <p class="font-display text-xl font-bold text-white">Visit the store</p>
        <address class="mt-4 not-italic">${site.address.map(e).join('<br>')}<br><a class="hover:text-white hover:underline" href="tel:${site.phoneHref}">${e(site.phone)}</a><br><a class="break-all hover:text-white hover:underline" href="mailto:${site.email}">${e(site.email)}</a></address>
        <dl class="mt-5 space-y-1.5 text-[15px]">
              ${hours}
        </dl>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="container-x flex flex-col gap-2 py-5 text-[15px] sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; <span data-year>2026</span> ${e(site.name)}. All rights reserved.</p>
        <p>Hunt legally. Check your wildlife agency’s current regulations.</p>
      </div>
    </div>
  </footer>`;
}


/* Unsplash photos (hotlinked; Unsplash licence permits free commercial use). Swap any id to change an image. */
const PH = {
  'hero-home': ['1511497584788-876760111969', 'Smoky pine valley in the Cascades', 'Sergei A'],
  'hero-soon': ['1486707471592-8e7eb7e36f78', 'Fog in a forest', 'Inggrid Koe'],
  'hero-products': ['1490682143684-14369e18dce8', 'Mountains and trees at golden hour', 'Artem Sapegin'],
  'hero-safety': ['1736117704460-549180eb1585', 'Topographic map for planning a hunt', 'Unsplash'],
  rifle: ['1525779350160-30931cbc2aac', 'Hunting rifle, selective focus', 'Sebastian Pociecha'],
  'hero-contact': ['1665849863678-fc03a642a9aa', 'Trees and mountains', 'Shai Pal'],
  'hero-404': ['1545854480-c9eb0affde3a', 'Winter pinewood forest', 'Tapio Haaja'],
  archery: ['1641531105535-1ead3c1784ab', 'Aiming a bow at an archery target', 'Norbert Braun'],
  deer: ['1496794795115-3247c050b08e', 'Deer on a grass field', 'Aaron Burden'],
  waterfowl: ['1560450750-cea15ad3857a', 'Marsh at sunrise, Horicon Marsh', 'Dave Hoefler'],
  winter: ['1592135841592-b635e8350ed8', 'Frosted pines', 'David Jusko'],
  binoculars: ['1453563391321-df71955e9289', 'Binoculars', 'Ran Berkovich'],
  boot: ['1575987116913-e96e7d490b8a', 'Brown leather boots', 'Clay Banks'],
  jacket: ['1772521237495-b30619e37300', 'Camouflage jacket', 'Michael Kyule'],
  bow: ['1724118262304-6026d00fb30b', 'Shooting a compound bow', 'Clayton Chase'],
  pack: ['1622260614153-03223fb72052', 'Hunting backpack', 'Ali Kazal'],
  rangefinder: ['1599664966621-52d649d501e6', 'Laser rangefinder', 'Brandon Williams'],
  vest: ['1777891733988-540ac2abbd40', 'Orange safety vest', 'Nicole Almendrada'],
  headlamp: ['1517457773273-412ec74a18cd', 'Headlamp', 'HEAD Accessories'],
  arrows: ['1788765322986-d74e3209c269', 'Arrows with white fletching', 'Marija Zaric'],
  pacboot: ['1725829966109-89dff97ad2c5', 'Boots in snow', 'mandylin'],
  knife: ['1588597575483-f4e43e191c94', 'Knife with wooden handle', 'Igor bispo'],
  tent: ['1599758376048-8c340c1489cb', 'White dome tent on a grass field', 'Sergey Chuprin'],
  daypack: ['1509762774605-f07235a08f1f', 'Hiking daypack', 'Josiah Weiss'],
  trailcam: ['1624222924285-c8e0951b1d18', 'Trail camera on a tree', 'Gavin Allanwood'],
  hatchet: ['1649433185234-ef76d2755541', 'Axe in a stump', 'Tony Litvyak'],
  lantern: ['1555488205-d5e67846cf40', 'Lit lantern', 'Vladimir Fedotov'],
  beanie: ['1648483092137-6e63796c8b06', 'Wool beanie', 'Old Youth'],
  blind: ['1790953004144-67c1cef3fce4', 'Hunting blind in the field', 'Unsplash'],
  stand: ['1780345149494-5376b8aa1d16', 'Hunting blind overlooking a field', 'Unsplash'],
  post: ['1669482913085-7768a9edd381', 'Winter hunting post', 'Unsplash'],
  bottle: ['1544003484-3cd181d17917', 'Insulated bottle', 'Karl Köhler']
};
const CATIMG = { optics: 'binoculars', apparel: 'jacket', boots: 'boot', packs: 'pack', archery: 'bow', knives: 'knife', camping: 'tent', accessories: 'headlamp' };
const U = (k, w, h, q = 75) => `https://images.unsplash.com/photo-${PH[k][0]}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=${q}`;

function hero({ img, local, crumbs, eyebrow, title, text, extra = '' }) {
  const trail = crumbs.map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${e(c[0])}</li>` : `<li><a href="${L(c[1])}">${e(c[0])}</a></li>`)).join('');
  return `<section class="hero hero-inner" aria-labelledby="page-title">
      <img class="hero-img" src="${local ? A(local) : U(img, 2000, 750)}" srcset="${local ? `${A(local.replace('.jpg', '-1000.jpg'))} 1000w, ${A(local)} 2000w` : `${U(img, 1000, 375, 70)} 1000w, ${U(img, 2000, 750)} 2000w`}" sizes="100vw" alt="" width="2400" height="900" fetchpriority="high" decoding="async">
      <div class="hero-scrim"></div><div class="hero-scrim-x"></div>
      <div class="container-x relative py-12 md:py-16">
        <nav aria-label="Breadcrumb"><ol class="crumbs">${trail}</ol></nav>
        <p class="eyebrow">${e(eyebrow)}</p>
        <h1 id="page-title" class="max-w-4xl">${title}</h1>
        <p class="lead mt-5">${e(text)}</p>${extra}
      </div>
    </section>`;
}

function productCard(p, { lazy = true } = {}) {
  const badge = p.badge ? `<span class="badge badge-${p.badge} absolute start-3 top-3">${{ new: 'New', sale: 'Sale', pick: 'Staff pick' }[p.badge]}</span>` : '';
  const enquire = `${L('pages/contact.html')}?type=product&amp;product=${encodeURIComponent(p.name)}`;
  return `<article class="card group flex h-full flex-col overflow-hidden shadow-card" data-product data-cat="${p.cat}" data-cat-label="${e(catName[p.cat])}" data-price="${p.price}" data-name="${e(p.name)}" data-rank="${p.rank}" data-keywords="${e(p.kw)}">
            <div class="tile-bg relative aspect-[4/3]">
              <img src="${U(p.art, 800, 600)}" width="800" height="600" alt="${e(p.name)}"${lazy ? ' loading="lazy"' : ''} decoding="async" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]">
              ${badge}
            </div>
            <div class="flex flex-1 flex-col p-5">
              <p class="text-[15px] text-muted">${e(catName[p.cat])}</p>
              <h3 class="mt-1 line-clamp-2 text-[1.7rem]">${e(p.name)}</h3>
              <p class="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">${e(p.desc)}</p>
              <div class="mt-auto flex items-center justify-between gap-3 pt-5">
                <p class="price-tag"><span><span class="sr-only">Price </span>${money(p.price)}</span>${p.was ? `<s><span class="sr-only">Was </span>${money(p.was)}</s>` : ''}</p>
                <a class="btn btn-outline btn-sm" href="${enquire}" aria-label="Enquire about ${e(p.name)}">Enquire</a>
              </div>
            </div>
          </article>`;
}

const themeInit = `<script>(function(){try{var d=document.documentElement,t=localStorage.getItem('rl-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.classList.toggle('dark',t==='dark');var r=localStorage.getItem('rl-dir')||'ltr';d.setAttribute('dir',r);d.setAttribute('lang',r==='rtl'?'ar':'en')}catch(e){}})();</script>`;

function page({ file, title, desc, body, active, ld = [], noindex = false, shell = true, ogImage = 'img/og-cover.png' }) {
  FROM = file;
  const url = `${site.url}/${file === 'index.html' ? '' : file}`;
  const out = body();
  const ldTags = ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ');
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="${e(desc)}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow">'}
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0b1710">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${e(site.name)}">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.url}/assets/${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${A('img/favicon.svg')}" type="image/svg+xml">
  <link rel="icon" href="${A('img/favicon.ico')}" sizes="any">
  <link rel="apple-touch-icon" href="${A('img/apple-touch-icon.png')}">
  <link rel="manifest" href="${rel('site.webmanifest')}">
  <link rel="preload" href="${A('fonts/big-shoulders-display-latin-800-normal.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${A('fonts/literata-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>
  ${themeInit}
  <link rel="stylesheet" href="${A('css/style.css')}">
  ${ldTags}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${shell ? header(active) : ''}
  ${out}
  ${shell ? footer() : ''}
  <script src="${A('js/main.js')}" defer></script>
</body>
</html>
`;
}

const write = (rel, s) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); console.log('wrote', rel); };
const crumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: `${site.url}/${it[1]}` })) });
const storeLd = { '@context': 'https://schema.org', '@type': 'SportingGoodsStore', name: site.name, description: site.tagline, url: site.url, telephone: site.phone, email: site.email,
  address: { '@type': 'PostalAddress', streetAddress: site.address[0], addressLocality: site.address[1] },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:00', closes: '15:00' }] };

/* shared snippets */
const sectionHead = (h, p, extra = '') => `<div class="max-w-3xl">
          <h2>${h}</h2>
          ${p ? `<p class="lead mt-4">${p}</p>` : ''}${extra}
        </div>`;
const newsletter = (id) => `<section class="bg-blaze-500 text-pine-950" aria-labelledby="${id}-title">
      <div class="container-x grid items-center gap-8 py-14 lg:grid-cols-12 lg:py-16">
        <div class="lg:col-span-6">
          <h2 id="${id}-title" class="text-pine-950">Hear when a season opens or stock lands</h2>
          <p class="mt-3 max-w-prose text-lg">One short email when something you care about changes. No weekly noise, and you can leave any time.</p>
        </div>
        <form class="lg:col-span-6" data-form novalidate data-success="You’re on the list. Watch for our next season alert.">
          <label class="label !text-pine-950" for="${id}-email">Email address</label>
          <div class="flex flex-col gap-3 sm:flex-row">
            <input class="input flex-1 !border-pine-950 !bg-white !text-pine-950 placeholder:!text-pine-700 placeholder:!opacity-100" id="${id}-email" name="email" type="email" required autocomplete="email" data-label="your email address" placeholder="you@example.com">
            <button class="btn btn-dark shrink-0" type="submit">Sign me up</button>
          </div>
          <p data-form-status role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>`;

/* ---------- HOME ---------- */
const home = () => `<main id="main">
    <section class="hero hero-home min-h-[640px] lg:min-h-[760px]" aria-labelledby="hero-title">
      <img class="hero-img" src="${U('hero-home', 2400, 1350)}" srcset="${U('hero-home', 1200, 800, 70)} 1200w, ${U('hero-home', 2400, 1350)} 2400w" sizes="100vw" alt="" width="2400" height="1350" fetchpriority="high">
      <div class="hero-scrim"></div><div class="hero-scrim-x"></div>
      <div class="container-x relative py-14 lg:py-20">
        <div class="grid items-end gap-10 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <p class="eyebrow">Outfitting hunters since 1994</p>
            <h1 id="hero-title">Gear that holds up when the season opens</h1>
            <p class="lead mt-6">Boots, optics, bows and layers worn and tested by people who hunt the same ground you do. Come in, or ask us what works.</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a class="btn btn-primary" href="${L('pages/products.html')}">Shop all gear</a>
              <a class="btn btn-light" href="${L('pages/safety-regulations.html')}">Read the safety guide</a>
            </div>
          </div>
          <aside class="lg:col-span-5" aria-labelledby="board-title">
            <div class="rounded-md border-2 border-white/25 bg-pine-950/80 p-5 backdrop-blur-sm sm:p-6">
              <p id="board-title" class="font-display text-2xl font-bold text-white">Opening soon</p>
              <p class="mt-1 text-[15px] text-white/70">Sample dates. Check your wildlife agency before you hunt.</p>
              <ul class="mt-4 divide-y divide-white/15 border-t border-white/15">
                ${D.seasonBoard.map((s) => `<li class="flex items-center justify-between gap-4 py-3"><span class="font-display text-xl font-semibold text-white">${e(s.name)}</span><span class="font-display text-xl font-bold text-blaze-400">${e(s.date)}</span></li>`).join('\n                ')}
              </ul>
              <a class="link-arrow mt-4 !text-blaze-400" href="${L('pages/safety-regulations.html')}#season-dates">See all season dates<span class="rtl-flip">${icon('arrow', 'h-5 w-5')}</span></a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="seasons-title">
      <div class="container-x">
        ${sectionHead('<span id="seasons-title">Gear for the season you’re hunting</span>', 'Start with what’s about to open. Each kit lists the pieces our staff reach for first.')}
        <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          ${D.seasons.map((s, n) => `<article class="season-card season-v${n % 2} reveal ${s.span}" data-reveal style="--d:${n * 90}ms">
            <img class="season-img" src="${U(s.id, 1200, 900)}" alt="" width="1200" height="900" loading="lazy">
            <div class="season-shade"></div>
            <span class="season-num" aria-hidden="true">0${n + 1}</span>
            <ul class="season-tags" aria-label="Good for">${s.tags.map((t) => `<li>${e(t)}</li>`).join('')}</ul>
            <div class="season-body">
              <h3 class="text-3xl font-extrabold uppercase sm:text-4xl">${e(s.title)}</h3>
              <p class="mt-2 max-w-md text-white/85">${e(s.line)}</p>
              <ul class="season-picks">
                ${s.picks.map((id) => `<li>${e(byId[id].name)}</li>`).join('\n                ')}
              </ul>
              <a class="season-cta" href="${L('pages/products.html')}?cat=${s.cat}">${e(s.cta)}<span class="rtl-flip">${icon('arrow', 'h-5 w-5')}</span></a>
            </div>
          </article>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section border-y border-line bg-surface" aria-labelledby="cats-title">
      <div class="container-x">
        ${sectionHead('<span id="cats-title">Shop by category</span>', '')}
        <p class="mt-4 text-muted sm:hidden">Scroll to flip through the aisles.</p>
        <ul class="stack mt-10" data-stack>
          ${D.categories.map((c, n) => `<li class="stack-card" style="--i:${n}">
            <a class="stack-link" href="${L('pages/products.html')}?cat=${c.id}">
              <span class="stack-photo"><img src="${U(CATIMG[c.id], 900, 700)}" alt="" width="900" height="700" loading="lazy"></span>
              <span class="stack-info">
                <span class="stack-idx" aria-hidden="true">${String(n + 1).padStart(2, '0')} / ${String(D.categories.length).padStart(2, '0')}</span>
                <span class="text-accent">${bigIcon(c.id, 'h-12 w-12')}</span>
                <span class="font-display text-4xl font-extrabold uppercase leading-none text-ink sm:text-5xl">${e(c.name)}</span>
                <span class="max-w-sm text-lg leading-snug text-muted">${e(c.blurb)}</span>
                <span class="mt-2 inline-flex items-center gap-2 font-display text-xl font-bold text-accent">${catCount(c.id)} ${catCount(c.id) === 1 ? 'item' : 'items'}<span class="rtl-flip stack-arrow">${icon('arrow', 'h-5 w-5')}</span></span>
              </span>
            </a>
          </li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="featured-title">
      <div class="container-x">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          ${sectionHead('<span id="featured-title">Field favourites</span>', 'The pieces customers come back for, season after season.')}
          <a class="link-arrow shrink-0" href="${L('pages/products.html')}">View all ${D.products.length} products<span class="rtl-flip">${icon('arrow', 'h-5 w-5')}</span></a>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          ${D.products.slice(0, 8).map((p) => productCard(p)).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section-tight border-y border-line" aria-labelledby="why-title">
      <div class="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-5">
          <h2 id="why-title">Why hunters shop here</h2>
          <p class="lead mt-4">We’re a small shop with a short list of rules: test it, fit it, explain it, and take it back if it’s wrong.</p>
        </div>
        <ul class="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
          ${D.features.map((f) => `<li class="flex gap-4"><span class="mt-1 text-accent">${icon(f.icon, 'h-8 w-8')}</span><div><h3 class="text-2xl">${e(f.title)}</h3><p class="mt-1.5 text-muted">${e(f.text)}</p></div></li>`).join('\n          ')}
        </ul>
      </div>
      <div class="mt-12 border-t-2 border-dashed border-line pt-8">
        <p class="container-x font-display text-xl font-bold text-ink">Brands on our shelves</p>
        <div class="marquee mt-5" dir="ltr" role="group" aria-label="Brands we stock">
          <div class="marquee-track">
            ${[0, 1].map((k) => `<ul class="flex shrink-0 items-center" ${k ? 'aria-hidden="true"' : ''}>
              ${D.brands.map((b) => `<li class="flex items-center"><span class="px-8 font-display text-4xl font-extrabold uppercase text-muted sm:text-5xl">${e(b)}</span><span class="h-3 w-3 rotate-45 bg-blaze-500" aria-hidden="true"></span></li>`).join('\n              ')}
            </ul>`).join('\n            ')}
          </div>
        </div>
      </div>
    </section>

    <section class="bg-pine-900 text-lichen-100" aria-labelledby="safe-title">
      <div class="container-x grid items-center gap-10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
        <div class="lg:col-span-5">
          <div class="mx-auto max-w-sm rounded-md border-2 border-blaze-500/60 bg-lichen-200 p-6">
            <img src="${U('vest', 800, 600)}" width="800" height="600" alt="Blaze orange safety vest with reflective bands" loading="lazy">
          </div>
        </div>
        <div class="lg:col-span-7">
          <h2 id="safe-title" class="text-white">Hunt legal. Hunt visible. Tell someone where you’re going.</h2>
          <ul class="mt-6 max-w-prose space-y-3 text-lg">
            <li class="flex gap-3">${icon('check', 'mt-1.5 h-5 w-5 shrink-0 text-blaze-400')}<span>Carry your licence and the right tag for every animal you plan to take.</span></li>
            <li class="flex gap-3">${icon('check', 'mt-1.5 h-5 w-5 shrink-0 text-blaze-400')}<span>Wear blaze orange wherever it’s required, and where it isn’t, wear it anyway.</span></li>
            <li class="flex gap-3">${icon('check', 'mt-1.5 h-5 w-5 shrink-0 text-blaze-400')}<span>Share your location and return time before you leave the truck.</span></li>
          </ul>
          <div class="mt-8 flex flex-wrap gap-3">
            <a class="btn btn-primary" href="${L('pages/safety-regulations.html')}">Read safety and regulations</a>
            <a class="btn btn-light" href="${L('pages/products.html')}?cat=apparel">Shop blaze orange</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section border-y border-line bg-sunken" aria-labelledby="voices-title">
      <div class="container-x">
        <div class="max-w-3xl"><p class="eyebrow">Straight from the field</p><h2 id="voices-title">What hunters tell us</h2></div>
        <ul class="mt-10 grid gap-6 lg:grid-cols-3">
          ${D.testimonials.map((t, n) => `<li class="quote-card reveal ${n === 1 ? 'is-dark' : ''}" data-reveal style="--d:${n * 120}ms">
            <span class="quote-mark" aria-hidden="true">“</span>
            <div class="flex gap-1 text-blaze-500" role="img" aria-label="5 out of 5 stars">${icon('star', 'h-5 w-5').repeat(5)}</div>
            <blockquote class="mt-4 flex-1 text-xl leading-relaxed">${e(t.q)}</blockquote>
            <figcaption class="quote-who"><span class="quote-av" aria-hidden="true">${e(t.n[0])}</span><span><strong class="block font-display text-2xl leading-none">${e(t.n)}</strong><span class="text-[15px] opacity-75">${e(t.r)}</span></span></figcaption>
          </li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    ${newsletter('home-news')}
  </main>`;

/* ---------- PRODUCTS ---------- */
const productsPage = () => `<main id="main">
    ${hero({ img: 'hero-products', crumbs: [['Home', 'index.html'], ['Shop gear', 'pages/products.html']], eyebrow: 'Eight departments, one counter', title: 'Shop gear', text: 'Filter by department, search by name and see what’s in stock. Ask us anything before you buy.' })}

    <section class="section-tight" aria-labelledby="catalog-title">
      <div class="container-x">
        <h2 id="catalog-title" class="sr-only">Product catalogue</h2>
        <div role="group" aria-label="Filter by category" class="flex flex-wrap gap-2">
          <button type="button" class="chip" data-filter="all" aria-pressed="true">All <small>${D.products.length}</small></button>
          ${D.categories.map((c) => `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="false">${e(c.name)} <small>${catCount(c.id)}</small></button>`).join('\n          ')}
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-[1fr_12rem_13rem]">
          <div class="field relative">
            <label class="label" for="product-search">Search products</label>
            <span class="pointer-events-none absolute bottom-3 start-3.5 text-muted">${icon('search', 'h-5 w-5')}</span>
            <input class="input !ps-11" id="product-search" type="search" placeholder="Try “boots” or “bow”" autocomplete="off">
          </div>
          <div class="field">
            <label class="label" for="product-price">Price</label>
            <select class="input" data-select id="product-price"><option value="any">Any price</option><option value="u50">Under $50</option><option value="50-150">$50 to $150</option><option value="150-300">$150 to $300</option><option value="o300">Over $300</option></select>
          </div>
          <div class="field">
            <label class="label" for="product-sort">Sort by</label>
            <select class="input" data-select id="product-sort"><option value="featured">Featured</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option><option value="name">Name, A to Z</option></select>
          </div>
        </div>
        <p id="result-count" class="mt-8 font-display text-2xl font-bold" aria-live="polite">${D.products.length} items</p>
        <div data-product-grid class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${D.products.map((p, i) => productCard(p, { lazy: i > 5 })).join('\n          ')}
        </div>
        <div id="empty-state" class="card mt-4 hidden p-8 text-center sm:p-12">
          <h2 class="text-3xl">Nothing matches those filters</h2>
          <p class="mx-auto mt-3 max-w-prose text-muted">Try a shorter search, a wider price range or a different department. Or ask us. We may have it in the back.</p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" class="btn btn-primary" data-reset-filters>Clear filters</button>
            <a class="btn btn-outline" href="${L('pages/contact.html')}?type=product">Ask a gear specialist</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-tight border-t border-line bg-surface" aria-labelledby="ask-title">
      <div class="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div class="max-w-2xl">
          <h2 id="ask-title" class="!text-4xl">Not sure what size or spec you need?</h2>
          <p class="mt-3 text-lg text-muted">Tell us the game, the terrain and your budget. A staff member who hunts will reply within one business day.</p>
        </div>
        <a class="btn btn-primary shrink-0" href="${L('pages/contact.html')}?type=fitting">Ask for advice</a>
      </div>
    </section>
  </main>`;

/* ---------- SAFETY ---------- */
const steps = [
  ['Take hunter education', 'Most agencies require a certified course before your first licence. Many offer online classes with a short field day.'],
  ['Buy your licence and tags', 'Buy online or in store. Tags are species-specific, so confirm you hold one for each animal you plan to take.'],
  ['Check your unit’s rules', 'Season dates, legal methods and bag limits change by unit. Read the current regulations booklet.'],
  ['Carry proof in the field', 'Keep your licence, tags and ID with you. Many places accept digital copies, but carry a printout anyway.']
];
const rules = [
  ['Treat every firearm as loaded', 'Even one you just checked. Open the action and look, every time you pick it up.'],
  ['Point the muzzle in a safe direction', 'Keep it away from people, yourself and anything you don’t intend to shoot, including when you climb or cross a fence.'],
  ['Keep your finger off the trigger', 'Rest it along the frame until the sights are on target and you’ve decided to shoot.'],
  ['Be sure of your target and what’s beyond it', 'Identify the animal fully. Know what lies behind it before you release the shot or the arrow.']
];
const safetyPage = () => `<main id="main">
    ${hero({ img: 'hero-safety', local: 'img/safety-hero.jpg', crumbs: [['Home', 'index.html'], ['Safety & regulations', 'pages/safety-regulations.html']], eyebrow: 'Know the rules before opening day', title: 'Safety &amp; regulations', text: 'Plain-language guidance on licensing, safe handling, season dates and gear care. It is a starting point, not legal advice.' })}

    <div class="sticky top-[72px] z-30 border-b border-line bg-page">
      <nav class="container-x subnav flex gap-3 overflow-x-auto py-4" aria-label="On this page">
        <a class="chip chip-nav shrink-0" href="#licensing">Licensing</a><a class="chip chip-nav shrink-0" href="#safe-handling">Safe handling</a><a class="chip chip-nav shrink-0" href="#season-dates">Season dates</a><a class="chip chip-nav shrink-0" href="#gear-care">Gear care</a><a class="chip chip-nav shrink-0" href="#guides">Free guides</a><a class="chip chip-nav shrink-0" href="#faq">FAQ</a>
      </nav>
    </div>

    <section class="container-x pt-10" aria-label="Field photos">
      <div class="photo-trio">
        ${[['blind', 'Scout your stand before the season', 'Scout'], ['rifle', 'Handle every firearm with respect', 'Handle'], ['post', 'Dress and plan for the weather', 'Prepare']].map((x, n) => `<figure class="photo-tile reveal" data-reveal data-tilt style="--d:${n * 140}ms"><img src="${U(x[0], 800, 1000)}" alt="${e(PH[x[0]][1])}" width="800" height="1000" loading="lazy"><span class="pt-corner pt-tl"></span><span class="pt-corner pt-br"></span><span class="pt-step" aria-hidden="true">0${n + 1}</span><figcaption><small>${e(x[2])}</small>${e(x[1])}</figcaption></figure>`).join('\n        ')}
      </div>
    </section>

    <section class="container-x pt-10" aria-label="Important notice">
      <div class="flex gap-4 rounded-md border-2 border-blaze-500 bg-blaze-500/10 p-5 sm:p-6">
        <span class="mt-0.5 text-accent">${icon('alert', 'h-7 w-7 shrink-0')}</span>
        <p class="max-w-prose"><strong>Always confirm with your wildlife agency.</strong> Regulations differ by state, province, unit and year. The dates and notes on this page are samples for demonstration.</p>
      </div>
    </section>

    <section id="licensing" class="section" aria-labelledby="lic-title">
      <div class="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-4">
          <h2 id="lic-title">Licensing and permits</h2>
          <p class="lead mt-4">Four steps to be legal before you leave the house.</p>
        </div>
        <ol class="space-y-0 lg:col-span-8">
          ${steps.map((s, i) => `<li class="flex gap-5 border-b border-line py-6 first:pt-0 last:border-b-0"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine-900 font-display text-2xl font-extrabold text-lichen-50 dark:bg-blaze-500 dark:text-pine-950" aria-hidden="true">${i + 1}</span><div><h3>${e(s[0])}</h3><p class="mt-2 max-w-prose text-muted">${e(s[1])}</p></div></li>`).join('\n          ')}
        </ol>
      </div>
    </section>

    <section id="safe-handling" class="section border-y border-line bg-surface" aria-labelledby="safe-title">
      <div class="container-x">
        ${sectionHead('<span id="safe-title">Safe handling in the field</span>', 'These four rules apply to every firearm, every time. Memorise them and repeat them to anyone you hunt with.')}
        <ol class="mt-10 grid gap-5 sm:grid-cols-2">
          ${rules.map((r, i) => `<li class="card flex h-full gap-4 p-6"><span class="font-display text-5xl font-extrabold leading-none text-blaze-500" aria-hidden="true">${i + 1}</span><div><h3 class="text-2xl">${e(r[0])}</h3><p class="mt-2 text-muted">${e(r[1])}</p></div></li>`).join('\n          ')}
        </ol>
        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <div class="card card-lift reveal h-full overflow-hidden" data-reveal>
            <div class="img-zoom h-52"><img src="${U('vest', 900, 500)}" alt="Orange safety vest" width="900" height="500" loading="lazy"></div>
            <div class="p-6"><h3 class="flex items-center gap-3 text-2xl"><span class="text-accent">${icon('vest', 'h-7 w-7')}</span>Wear blaze orange</h3>
            <p class="mt-3 text-muted">Many areas require blaze orange during firearm seasons. Where it’s optional, wear it anyway: hunters in orange are easy to spot through brush. Check the exact requirement for your unit.</p>
            <a class="link-arrow mt-4" href="${L('pages/products.html')}?cat=apparel">Shop blaze orange<span class="rtl-flip">${icon('arrow', 'h-5 w-5')}</span></a></div>
          </div>
          <div class="card card-lift reveal h-full overflow-hidden" data-reveal style="--d:120ms">
            <div class="img-zoom h-52"><img src="${U('archery', 900, 500)}" alt="Aiming a bow at an archery target" width="900" height="500" loading="lazy"></div>
            <div class="p-6"><h3 class="flex items-center gap-3 text-2xl"><span class="text-accent">${icon('shield', 'h-7 w-7')}</span>Tree stand and bow safety</h3>
            <p class="mt-3 text-muted">Wear a full-body harness from the ground up, use a haul line for your gear and keep three points of contact on the ladder. Carry broadheads in a quiver or case, never loose.</p>
            <a class="link-arrow mt-4" href="${L('pages/contact.html')}?type=guide&amp;product=${encodeURIComponent('Tree stand safety card')}">Get the safety card<span class="rtl-flip">${icon('arrow', 'h-5 w-5')}</span></a></div>
          </div>
        </div>
      </div>
    </section>

    <section id="season-dates" class="section" aria-labelledby="dates-title">
      <div class="container-x">
        ${sectionHead('<span id="dates-title">Season dates</span>', 'Sample seasons to show how this table works. Replace them with your region’s official dates.')}
        <div class="mt-8 md:overflow-hidden md:rounded-md md:border md:border-line md:bg-surface">
          <table class="ledger">
            <thead><tr><th scope="col">Species</th><th scope="col">Method</th><th scope="col">Opens</th><th scope="col">Closes</th><th scope="col">Notes</th></tr></thead>
            <tbody>
              ${D.seasonTable.map((r) => `<tr><td data-label="Species" class="font-semibold">${e(r[0])}</td><td data-label="Method">${e(r[1])}</td><td data-label="Opens">${e(r[2])}</td><td data-label="Closes">${e(r[3])}</td><td data-label="Notes" class="text-muted">${e(r[4])}</td></tr>`).join('\n              ')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="gear-care" class="section border-y border-line bg-surface" aria-labelledby="care-title">
      <div class="container-x">
        ${sectionHead('<span id="care-title">Gear care that pays off</span>', 'Ten minutes after each hunt keeps your gear working for years.')}
        <ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          ${D.careTips.map((t) => `<li class="card h-full p-6"><h3 class="text-2xl">${e(t[0])}</h3><p class="mt-2 text-muted">${e(t[1])}</p></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section id="guides" class="section" aria-labelledby="guides-title">
      <div class="container-x">
        ${sectionHead('<span id="guides-title">Free printed guides</span>', 'Pick up a copy in store, or ask us to send one.')}
        <ul class="mt-8 grid gap-5 md:grid-cols-3">
          ${[['Licence checklist', 'Every document and tag to carry on opening day.'], ['Tree stand safety card', 'A pocket-sized pre-climb checklist.'], ['Gear care calendar', 'What to service, and when, all year.']].map((g) => `<li class="card card-lift reveal flex h-full flex-col p-7 sm:p-8" data-reveal><span class="text-accent">${icon('book', 'h-8 w-8')}</span><h3 class="mt-4 text-2xl">${e(g[0])}</h3><p class="mt-2 text-muted">${e(g[1])}</p><a class="btn btn-outline btn-guide mt-8 self-start" href="${L('pages/contact.html')}?type=guide&amp;product=${encodeURIComponent(g[0])}">Request this guide</a></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section id="faq" class="section border-t border-line" aria-labelledby="faq-title">
      <div class="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-4"><h2 id="faq-title">Common questions</h2><p class="lead mt-4">Still stuck? <a class="font-semibold text-accent underline" href="${L('pages/contact.html')}?type=safety">Ask us</a>.</p></div>
        <div class="border-t border-line lg:col-span-8">
          ${D.faqs.map((f) => `<details class="acc"><summary>${e(f[0])}<span class="chev text-accent">${icon('chev', 'h-6 w-6')}</span></summary><div class="acc-body"><p>${e(f[1])}</p></div></details>`).join('\n          ')}
        </div>
      </div>
    </section>
  </main>`;

/* ---------- CONTACT ---------- */
const contactPage = () => `<main id="main">
    ${hero({ img: 'hero-contact', crumbs: [['Home', 'index.html'], ['Contact', 'pages/contact.html']], eyebrow: 'A person replies, usually within a day', title: 'Contact us', text: 'Ask about a product, book a bow tune-up or request a safety guide. Tell us what you need and we’ll get back to you.' })}

    <section class="section" aria-label="Enquiry form and store details">
      <div class="container-x grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div class="flex">
          <form id="contact-form" class="card flex w-full flex-col p-6 shadow-card sm:p-8" data-form novalidate action="#" method="post" data-success="Enquiry sent. We reply within one business day.">
            <h2 class="!text-4xl">Send an enquiry</h2>
            <p class="mt-2 text-muted">Fields marked * are required.</p>
            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              <div class="field"><label class="label" for="name">Full name *</label><input class="input" id="name" name="name" type="text" required autocomplete="name" data-label="your name"></div>
              <div class="field"><label class="label" for="email">Email *</label><input class="input" id="email" name="email" type="email" required autocomplete="email" data-label="your email address"></div>
              <div class="field"><label class="label" for="phone">Phone</label><input class="input" id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" data-phone maxlength="20" pattern="[0-9+()\\-.\\s]{7,20}" placeholder="(555) 010-0148"></div>
              <div class="field"><label class="label" for="type">Enquiry type *</label>
                <select class="input" data-select id="type" name="type" required data-label="an enquiry type"><option value="">Choose one</option><option value="product">Product enquiry</option><option value="fitting">Fitting or size advice</option><option value="order">Order or stock check</option><option value="safety">Licensing or safety question</option><option value="guide">Free printed guide</option><option value="other">Something else</option></select></div>
              <div class="field sm:col-span-2"><label class="label" for="product">Product or topic of interest</label><div class="combo" data-combo><input class="input combo-input" id="product" name="product" type="text" role="combobox" aria-expanded="false" aria-controls="product-list" aria-autocomplete="list" autocomplete="off" placeholder="e.g. Switchback boot"><button type="button" class="combo-toggle" tabindex="-1" aria-label="Show suggestions"><span class="rtl-none">${icon('chevron', 'h-5 w-5')}</span></button><ul class="menu" id="product-list" role="listbox" hidden>${D.products.map((p) => `<li role="option" data-value="${e(p.name)}"><span class="menu-name">${e(p.name)}</span><span class="menu-cat">${e(catName[p.cat])}</span></li>`).join('')}</ul></div></div>
              <div class="field"><label class="label" for="date">Preferred call or visit date</label><input class="input" id="date" name="date" type="date"></div>
              <div class="field"><label class="label" for="time">Preferred time</label><input class="input" id="time" name="time" type="time"></div>
              <div class="field sm:col-span-2"><label class="label" for="message">Message *</label><textarea class="input" id="message" name="message" rows="5" required data-label="a message" data-min="10" placeholder="Tell us the game you hunt, the terrain and your budget."></textarea></div>
              <div class="hidden" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
              <label class="flex items-start gap-3 sm:col-span-2"><input class="mt-1.5 h-5 w-5 shrink-0 accent-[#ff5f15]" id="consent" name="consent" type="checkbox" required data-label="consent"><span class="text-[15px] text-muted">I agree to be contacted about this enquiry. We never share your details.</span></label>
            </div>
            <div class="mt-auto pt-6"><button class="btn btn-primary" type="submit">Send enquiry</button></div>
            <p data-form-status role="status" aria-live="polite"></p>
          </form>
        </div>

        <aside class="flex flex-col gap-6" aria-label="Store details">
          <div class="card p-6">
            <h2 class="!text-3xl">Visit the store</h2>
            <ul class="mt-5 space-y-4">
              <li class="flex gap-3"><span class="mt-1 text-accent">${icon('pin', 'h-6 w-6')}</span><address class="not-italic">${site.address.map(e).join('<br>')}</address></li>
              <li class="flex gap-3"><span class="mt-1 text-accent">${icon('phone', 'h-6 w-6')}</span><a class="hover:underline" href="tel:${site.phoneHref}">${e(site.phone)}</a></li>
              <li class="flex gap-3"><span class="mt-1 text-accent">${icon('mail', 'h-6 w-6')}</span><a class="break-all hover:underline" href="mailto:${site.email}">${e(site.email)}</a></li>
            </ul>
          </div>
          <div class="card p-6">
            <h2 class="flex items-center gap-3 !text-3xl"><span class="text-accent">${icon('clock', 'h-7 w-7')}</span>Opening hours</h2>
            <dl class="mt-4 divide-y divide-line">
              ${site.hours.map(([d, h]) => `<div class="flex justify-between gap-4 py-2.5"><dt>${e(d)}</dt><dd class="font-semibold">${e(h)}</dd></div>`).join('\n              ')}
            </dl>
          </div>
          <figure class="map-fig flex min-h-[20rem] flex-1 flex-col overflow-hidden rounded-md border border-line">
            <!-- Real map: OpenStreetMap embed (free, no API key). Edit lat/lng in tools/data.js (site.map) or paste a Google Maps embed URL here. -->
            <div class="relative min-h-[16rem] flex-1"><iframe title="Map showing the Ridgeline Outfitters store location" src="https://www.openstreetmap.org/export/embed.html?bbox=${site.map.lng - 0.02}%2C${site.map.lat - 0.012}%2C${site.map.lng + 0.02}%2C${site.map.lat + 0.012}&amp;layer=mapnik&amp;marker=${site.map.lat}%2C${site.map.lng}" class="absolute inset-0 h-full w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
            <figcaption class="flex items-center justify-between gap-3 bg-surface px-5 py-3 text-[15px]"><a class="text-muted underline decoration-transparent hover:decoration-current" href="https://www.openstreetmap.org/?mlat=${site.map.lat}&amp;mlon=${site.map.lng}#map=14/${site.map.lat}/${site.map.lng}" target="_blank" rel="noopener noreferrer">View larger map</a><a class="link-arrow !text-lg" href="https://www.google.com/maps/dir/?api=1&amp;destination=${site.map.lat},${site.map.lng}" target="_blank" rel="noopener noreferrer">Get directions<span class="rtl-flip">${icon('arrow', 'h-4 w-4')}</span></a></figcaption>
          </figure>
        </aside>
      </div>
    </section>
  </main>`;

/* ---------- 404 ---------- */
const notFound = () => `<main id="main">
    ${hero({ img: 'hero-404', crumbs: [['Home', 'index.html'], ['Page not found', '404.html']], eyebrow: 'Error 404', title: 'This trail ends here', text: 'The page moved, or the link has a typo. Search the shop or pick a route back below.' })}
    <section class="section" aria-label="Where to go next">
      <div class="container-x grid gap-10 lg:grid-cols-12">
        <form class="lg:col-span-5" action="${L('pages/products.html')}" method="get" role="search">
          <label class="label" for="nf-search">Search the shop</label>
          <div class="flex gap-3"><input class="input flex-1" id="nf-search" name="q" type="search" placeholder="Boots, bow, binoculars" autocomplete="off"><button class="btn btn-primary shrink-0" type="submit">Search</button></div>
        </form>
        <ul class="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          ${[['Shop gear', 'Browse eight departments.', 'pages/products.html'], ['Safety & regulations', 'Licences, rules and season dates.', 'pages/safety-regulations.html'], ['Contact us', 'Ask a gear specialist.', 'pages/contact.html']].map((c) => `<li><a class="card group flex h-full flex-col p-5 transition-colors hover:border-accent" href="${L(c[2])}"><span class="font-display text-2xl font-bold">${e(c[0])}</span><span class="mt-1 text-[15px] text-muted">${e(c[1])}</span><span class="mt-auto pt-4 text-accent rtl-flip">${icon('arrow', 'h-5 w-5')}</span></a></li>`).join('\n          ')}
        </ul>
      </div>
    </section>
  </main>`;

/* ---------- COMING SOON ---------- */
const comingSoon = () => `<main id="main" class="relative isolate flex min-h-screen flex-col overflow-hidden bg-pine-950 text-white">
    <img class="hero-img" src="${U('hero-soon', 2400, 1350)}" alt="" width="2400" height="1350" fetchpriority="high">
    <div class="hero-scrim"></div><div class="hero-scrim-x"></div>
    <div class="container-x flex items-center justify-between gap-4 py-5">
      ${logo('light')}
      <div class="flex gap-2"><span class="text-white">${themeBtn.replace('class="icon-btn"', 'class="icon-btn !border-white/30 !text-white"')}</span>${dirBtn.replace('class="icon-btn"', 'class="icon-btn !border-white/30 !text-white"')}</div>
    </div>
    <div class="container-x flex flex-1 items-center py-12">
      <div class="max-w-3xl">
        <p class="eyebrow">New site opens soon</p>
        <h1 style="font-size:clamp(3rem,8.6vw,7rem)">We’re restocking the shelves</h1>
        <p class="lead mt-6 !text-white/85">The new Ridgeline Outfitters site is almost ready. The store on Timberline Road stays open every day.</p>
        <div data-countdown="2027-03-01T09:00:00" class="mt-8 grid max-w-md grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label="Time until launch">
          ${[['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']].map(([k, l]) => `<div class="rounded-md border-2 border-white/25 bg-pine-950/70 px-1 py-3 text-center backdrop-blur-sm sm:px-3"><span data-cd="${k}" class="block font-display text-4xl font-extrabold sm:text-5xl leading-none text-blaze-400">00</span><span class="mt-1 block text-[15px] text-white/75">${l}</span></div>`).join('\n          ')}
        </div>
        <form class="mt-8 max-w-xl" data-form novalidate data-success="You’re on the list. We’ll email you when the site opens.">
          <label class="label !text-white" for="soon-email">Get an email when we launch</label>
          <div class="flex flex-col gap-3 sm:flex-row"><input class="input flex-1" id="soon-email" name="email" type="email" required autocomplete="email" data-label="your email address" placeholder="you@example.com"><button class="btn btn-primary shrink-0" type="submit">Notify me</button></div>
          <p data-form-status role="status" aria-live="polite"></p>
        </form>
        <p class="mt-8 text-[15px] text-white/75">Questions? Call <a class="underline" href="tel:${site.phoneHref}">${e(site.phone)}</a> or email <a class="break-all underline" href="mailto:${site.email}">${e(site.email)}</a>.</p>
      </div>
    </div>
  </main>`;

/* ---------- write all ---------- */
write('index.html', page({ file: 'index.html', active: 'home', title: 'Ridgeline Outfitters | Hunting Gear & Outdoor Sports Store',
  desc: 'Hunting gear and outdoor sports outfitters. Shop boots, optics, archery, packs and camping gear, fitted and tested by hunters. Visit the store or enquire online.', ld: [storeLd], body: home }));
write('pages/products.html', page({ file: 'pages/products.html', active: 'shop', title: 'Shop Hunting Gear | Ridgeline Outfitters',
  desc: 'Browse hunting boots, optics, archery, packs, camo apparel, knives and camping gear. Filter by department, search and enquire online.',
  ld: [crumbLd([['Home', 'index.html'], ['Shop gear', 'pages/products.html']]), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: D.products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: p.name, description: p.desc, image: U(p.art, 800, 600), category: catName[p.cat], offers: { '@type': 'Offer', priceCurrency: 'USD', price: String(p.price), availability: 'https://schema.org/InStock' } } })) }], body: productsPage }));
write('pages/safety-regulations.html', page({ file: 'pages/safety-regulations.html', active: 'safety', title: 'Hunting Safety & Regulations | Ridgeline Outfitters',
  desc: 'Plain-language guidance on hunting licences, safe firearm and tree stand handling, blaze orange, sample season dates and gear care.',
  ld: [crumbLd([['Home', 'index.html'], ['Safety & regulations', 'pages/safety-regulations.html']]), { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: D.faqs.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }], body: safetyPage }));
write('pages/contact.html', page({ file: 'pages/contact.html', active: 'contact', title: 'Contact & Store Hours | Ridgeline Outfitters',
  desc: 'Send an enquiry, find the store, check opening hours or request a free safety guide from Ridgeline Outfitters.',
  ld: [crumbLd([['Home', 'index.html'], ['Contact', 'pages/contact.html']]), storeLd], body: contactPage }));
write('404.html', page({ file: '404.html', active: '', title: 'Page not found | Ridgeline Outfitters', desc: 'The page you were looking for could not be found.', noindex: true, body: notFound }));
write('coming-soon.html', page({ file: 'coming-soon.html', active: '', shell: false, noindex: true, title: 'Coming soon | Ridgeline Outfitters',
  desc: 'The new Ridgeline Outfitters website opens soon. The store remains open daily.', body: comingSoon }));

/* static support files */
const urls = ['index.html', 'pages/products.html', 'pages/safety-regulations.html', 'pages/contact.html'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.url}/${u === 'index.html' ? '' : u}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write('site.webmanifest', JSON.stringify({ name: site.name, short_name: site.short, start_url: './index.html', display: 'standalone', background_color: '#0b1710', theme_color: '#0b1710',
  icons: [{ src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2) + '\n');
