// Inline SVG icon set (24x24 stroke icons, 48x48 for category icons).
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const paths = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
  dir: '<path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4c1.8.8 3 2.8 3 5.6"/>',
  ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  rotate: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z" fill="currentColor"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1" fill="currentColor"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor"/>',
  xsocial: '<path d="M5 4l14 16M19 4L5 20"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.4" fill="currentColor"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  bow: '<path d="M7 3c13 4 13 14 0 18"/><path d="M7 3v18M7 12h14M17 8l4 4-4 4"/>',
  antler: '<path d="M12 21v-9M12 12c-2.5-1-4.5-3.5-4.5-8M12 12c2.5-1 4.5-3.5 4.5-8M7.5 8L4 7M8.5 5L5 3M16.5 8L20 7M15.5 5L19 3"/>',
  duck: '<path d="M3 20c2.5 0 2.5-1.5 4.5-1.5S10 20 12 20s2.5-1.5 4.5-1.5S19 20 21 20"/><path d="M6 14c0-4 3-6.5 6.5-6 .5-2.5 2-4 4-4s3 1.5 3 3l-2 1c0 4-2 7-6 7-3 0-5.5-.5-5.5-1z"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
  vest: '<path d="M8 4l4 6 4-6 3 3 1.5 13h-17L5 7z"/><path d="M12 10v10M5.5 15h13"/>',
  list2: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6M9 11h6"/>'
};
const big = {
  optics: '<circle cx="14" cy="31" r="9"/><circle cx="34" cy="31" r="9"/><path d="M23 29h2M9 23l3-12h6v9M39 23l-3-12h-6v9"/>',
  apparel: '<path d="M17 7l-10 6 3 10 5-2v21h18V21l5 2 3-10-10-6c-1 4-4 6-7 6s-6-2-7-6z"/><path d="M24 13v28"/>',
  boots: '<path d="M15 6h14v18c0 3 3 4 9 6 4 1 5 3 5 6v3H8V6z"/><path d="M8 39h35M19 12l6 3M19 18l6 3"/>',
  packs: '<rect x="12" y="10" width="24" height="33" rx="9"/><path d="M18 10V7a6 6 0 0 1 12 0v3M17 27h14v9H17zM17 27"/>',
  archery: '<path d="M10 5c20 6 20 32 0 38"/><path d="M10 5v38M10 24h33M37 18l6 6-6 6"/>',
  knives: '<path d="M5 43l5-5M9 39l9-9 3 3-9 9z"/><path d="M20 29L39 8c3 0 5 2 5 4-3 7-8 12-16 16z"/>',
  camping: '<path d="M4 41L24 8l20 33z"/><path d="M24 8v33M17 41l7-14 7 14"/>',
  accessories: '<path d="M19 6h10v6l4 5v26H15V17l4-5z"/><path d="M15 25h18M15 35h18"/>'
};
function icon(name, cls = 'h-5 w-5') {
  const p = paths[name];
  if (!p) throw new Error('unknown icon ' + name);
  return `<svg class="${cls}" viewBox="0 0 24 24" ${S} aria-hidden="true" focusable="false">${p}</svg>`;
}
function bigIcon(name, cls = 'h-12 w-12') {
  return `<svg class="${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${big[name]}</svg>`;
}
module.exports = { icon, bigIcon };
