/*!
 * Ridgeline Outfitters — main.js (vanilla, no dependencies)
 * Theme + direction toggles, mobile menu, product filter, form validation, countdown.
 * The theme/direction are applied by a tiny inline script in <head> to avoid a flash;
 * this file only wires up the buttons.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- theme + direction ---------- */
  function syncToggles() {
    var dark = root.classList.contains('dark');
    var rtl = root.getAttribute('dir') === 'rtl';
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
    $$('[data-dir-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(rtl));
      b.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-theme-toggle]');
    if (t) {
      var dark = !root.classList.contains('dark');
      root.classList.toggle('dark', dark);
      store.set('rl-theme', dark ? 'dark' : 'light');
      syncToggles();
      return;
    }
    var d = e.target.closest('[data-dir-toggle]');
    if (d) {
      var next = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      root.setAttribute('dir', next);
      root.setAttribute('lang', next === 'rtl' ? 'ar' : 'en');
      store.set('rl-dir', next);
      syncToggles();
    }
  });
  syncToggles();

  /* ---------- mobile menu (overlays content, never pushes it) ---------- */
  var menuBtn = $('[data-menu-toggle]');
  var menu = $('#mobile-menu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    var o = $('.icon-open', menuBtn), c = $('.icon-close', menuBtn);
    if (o && c) { o.classList.toggle('hidden', open); c.classList.toggle('hidden', !open); }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menu.classList.contains('hidden')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) { setMenu(false); menuBtn.focus(); }
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.matchMedia('(min-width: 1280px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- product filter / search / sort ---------- */
  var grid = $('[data-product-grid]');
  if (grid) {
    var cards = $$('[data-product]', grid);
    var chips = $$('[data-filter]');
    var search = $('#product-search');
    var sort = $('#product-sort');
    var price = $('#product-price');
    var count = $('#result-count');
    var empty = $('#empty-state');
    var state = { cat: 'all', q: '', price: 'any', sort: 'featured' };
    var params = new URLSearchParams(location.search);
    if (params.get('cat') && chips.some(function (c) { return c.dataset.filter === params.get('cat'); })) state.cat = params.get('cat');
    if (params.get('q')) { state.q = params.get('q'); if (search) search.value = state.q; }

    var inRange = function (p, r) {
      if (r === 'u50') return p < 50;
      if (r === '50-150') return p >= 50 && p <= 150;
      if (r === '150-300') return p > 150 && p <= 300;
      if (r === 'o300') return p > 300;
      return true;
    };
    var cmp = {
      featured: function (a, b) { return +a.dataset.rank - +b.dataset.rank; },
      'price-asc': function (a, b) { return +a.dataset.price - +b.dataset.price; },
      'price-desc': function (a, b) { return +b.dataset.price - +a.dataset.price; },
      name: function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); }
    };
    var render = function () {
      var q = state.q.trim().toLowerCase(), shown = 0;
      cards.slice().sort(cmp[state.sort]).forEach(function (c) { grid.appendChild(c); });
      cards.forEach(function (c) {
        var ok = (state.cat === 'all' || c.dataset.cat === state.cat) &&
          inRange(+c.dataset.price, state.price) &&
          (!q || (c.dataset.name + ' ' + c.dataset.catLabel + ' ' + c.dataset.keywords).toLowerCase().indexOf(q) > -1);
        c.classList.toggle('hidden', !ok);
        if (ok) shown++;
      });
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === state.cat)); });
      if (count) count.textContent = shown + (shown === 1 ? ' item' : ' items');
      if (empty) empty.classList.toggle('hidden', shown !== 0);
      grid.classList.toggle('hidden', shown === 0);
      var u = new URL(location.href);
      state.cat === 'all' ? u.searchParams.delete('cat') : u.searchParams.set('cat', state.cat);
      history.replaceState(null, '', u);
    };
    chips.forEach(function (b) { b.addEventListener('click', function () { state.cat = b.dataset.filter; render(); }); });
    if (search) search.addEventListener('input', function () { state.q = search.value; render(); });
    if (sort) sort.addEventListener('change', function () { state.sort = sort.value; render(); });
    if (price) price.addEventListener('change', function () { state.price = price.value; render(); });
    $$('[data-reset-filters]').forEach(function (b) {
      b.addEventListener('click', function () {
        state = { cat: 'all', q: '', price: 'any', sort: 'featured' };
        if (search) search.value = ''; if (sort) sort.value = 'featured'; if (price) price.value = 'any';
        render();
      });
    });
    render();
  }

  /* ---------- forms: client-side validation (wire `action` to your backend) ---------- */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function fieldError(input, msg) {
    var id = input.id + '-error', el = document.getElementById(id);
    if (!el) {
      el = document.createElement('p'); el.id = id; el.className = 'error-msg'; el.setAttribute('role', 'alert');
      (input.type === 'checkbox' ? input.closest('label') : input).insertAdjacentElement('afterend', el);
    }
    el.textContent = msg || ''; el.classList.toggle('hidden', !msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', id); else input.removeAttribute('aria-describedby');
    return !msg;
  }
  function check(input) {
    var v = input.value.trim(), name = input.dataset.label || 'this field';
    if (input.required && input.type === 'checkbox') return fieldError(input, input.checked ? '' : 'Tick the box to continue.');
    if (input.required && !v) return fieldError(input, 'Enter ' + name + '.');
    if (input.type === 'email' && v && !emailRe.test(v)) return fieldError(input, 'Enter an email like name@example.com so we can reply.');
    if (input.type === 'tel' && v && !/^[0-9+()\-.\s]{7,}$/.test(v)) return fieldError(input, 'Enter a phone number with at least 7 digits.');
    if (input.dataset.min && v.length < +input.dataset.min) return fieldError(input, 'Add a little more detail (at least ' + input.dataset.min + ' characters).');
    return fieldError(input, '');
  }
  $$('form[data-form]').forEach(function (form) {
    var status = $('[data-form-status]', form);
    $$('input, select, textarea', form).forEach(function (i) {
      if (i.type === 'hidden' || i.name === 'website') return;
      i.addEventListener('blur', function () { if (i.value || i.getAttribute('aria-invalid') === 'true') check(i); });
      i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') check(i); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      $$('input, select, textarea', form).forEach(function (i) {
        if (i.type === 'hidden' || i.name === 'website') return;
        if (!check(i) && !first) first = i;
      });
      if (first) { first.focus(); if (status) { status.textContent = 'Fix the highlighted fields and send again.'; status.className = 'mt-4 font-semibold text-red-700 dark:text-red-300'; } return; }
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value) return; /* honeypot */
      /* DEMO: replace with fetch(form.action, {method:'POST', body:new FormData(form)}) */
      form.reset();
      if (status) {
        status.textContent = form.dataset.success || 'Sent. We reply within one business day.';
        status.className = 'mt-4 rounded border-2 border-pine-600 bg-pine-600/10 px-4 py-3 font-semibold text-ink';
        status.setAttribute('tabindex', '-1'); status.focus();
      }
    });
  });

  /* contact form pre-fill from ?product= & ?type= */
  var cf = $('#contact-form');
  if (cf) {
    var p = new URLSearchParams(location.search);
    if (p.get('product') && $('#product', cf)) $('#product', cf).value = p.get('product');
    if (p.get('type') && $('#type', cf)) $('#type', cf).value = p.get('type');
  }

  /* ---------- countdown (coming-soon page) ---------- */
  var cd = $('[data-countdown]');
  if (cd) {
    var target = new Date(cd.dataset.countdown).getTime();
    var parts = { d: $('[data-cd="d"]', cd), h: $('[data-cd="h"]', cd), m: $('[data-cd="m"]', cd), s: $('[data-cd="s"]', cd) };
    var tick = function () {
      var t = Math.max(0, target - Date.now()), pad = function (n) { return String(n).padStart(2, '0'); };
      parts.d.textContent = pad(Math.floor(t / 864e5));
      parts.h.textContent = pad(Math.floor(t % 864e5 / 36e5));
      parts.m.textContent = pad(Math.floor(t % 36e5 / 6e4));
      parts.s.textContent = pad(Math.floor(t % 6e4 / 1e3));
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- phone: digits and + ( ) - . space only ---------- */
  $$('[data-phone], input[type="tel"]').forEach(function (el) {
    var clean = function () { var v = el.value.replace(/[^0-9+()\-.\s]/g, ''); if (v !== el.value) el.value = v; };
    el.addEventListener('beforeinput', function (ev) { if (ev.data && /[^0-9+()\-.\s]/.test(ev.data)) ev.preventDefault(); });
    el.addEventListener('input', clean);
    el.addEventListener('paste', function () { setTimeout(clean, 0); });
  });

  /* ---------- custom dropdowns (native <select> stays in the DOM as the source of truth) ---------- */
  var chevron = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var openMenu = null;
  var closeAll = function () { if (openMenu) { openMenu.close(); openMenu = null; } };
  document.addEventListener('click', function (ev) { if (openMenu && !openMenu.root.contains(ev.target)) closeAll(); });
  $$('select[data-select]').forEach(function (sel) {
    var root = document.createElement('div'); root.className = 'combo dd';
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'input dd-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    if (sel.id) { btn.id = sel.id + '-btn'; var lab = document.querySelector('label[for="' + sel.id + '"]'); if (lab) lab.setAttribute('for', btn.id); }
    var txt = document.createElement('span'); txt.className = 'dd-text';
    var ch = document.createElement('span'); ch.className = 'combo-toggle'; ch.innerHTML = chevron; ch.setAttribute('aria-hidden', 'true');
    btn.appendChild(txt); btn.appendChild(ch);
    var list = document.createElement('ul'); list.className = 'menu'; list.setAttribute('role', 'listbox'); list.hidden = true;
    Array.prototype.forEach.call(sel.options, function (o) {
      var li = document.createElement('li'); li.setAttribute('role', 'option'); li.dataset.value = o.value;
      li.innerHTML = '<span class="menu-name"></span><svg class="menu-tick" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
      li.firstChild.textContent = o.textContent; list.appendChild(li);
    });
    sel.parentNode.insertBefore(root, sel); root.appendChild(btn); root.appendChild(list); root.appendChild(sel);
    sel.classList.add('dd-native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    var items = $$('li', list), idx = 0;
    var sync = function () {
      idx = Math.max(0, sel.selectedIndex); txt.textContent = sel.options[idx].textContent;
      txt.classList.toggle('is-placeholder', sel.value === '' );
      items.forEach(function (li, i) { li.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
    };
    var api = { root: root, close: function () { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); root.classList.remove('is-open'); } };
    var pick = function (i) {
      sel.selectedIndex = i; sync(); api.close(); openMenu = null; btn.focus();
      sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true }));
    };
    var show = function () { closeAll(); list.hidden = false; btn.setAttribute('aria-expanded', 'true'); root.classList.add('is-open'); openMenu = api; var a = items[idx]; if (a) a.scrollIntoView({ block: 'nearest' }); };
    var focusItem = function (i) { idx = (i + items.length) % items.length; items.forEach(function (li, k) { li.classList.toggle('is-active', k === idx); }); items[idx].scrollIntoView({ block: 'nearest' }); };
    btn.addEventListener('click', function () { list.hidden ? show() : api.close(); });
    btn.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); if (list.hidden) show(); focusItem(idx + (ev.key === 'ArrowDown' ? 1 : -1)); }
      else if ((ev.key === 'Enter' || ev.key === ' ') && !list.hidden) { ev.preventDefault(); pick(idx); }
      else if (ev.key === 'Escape') { api.close(); openMenu = null; }
    });
    items.forEach(function (li, i) { li.addEventListener('click', function () { pick(i); }); });
    sel.addEventListener('change', sync); sync();
  });

  /* ---------- combobox for the product field (free text + suggestions) ---------- */
  $$('[data-combo]').forEach(function (root) {
    var input = $('.combo-input', root), list = $('.menu', root), toggle = $('.combo-toggle', root);
    var items = $$('li', list), active = -1;
    var api = { root: root, close: function () { list.hidden = true; input.setAttribute('aria-expanded', 'false'); root.classList.remove('is-open'); active = -1; } };
    var render = function () {
      var q = input.value.trim().toLowerCase(), n = 0;
      items.forEach(function (li) { var ok = !q || li.dataset.value.toLowerCase().indexOf(q) > -1; li.hidden = !ok; li.classList.remove('is-active'); if (ok) n++; });
      return n;
    };
    var show = function () { closeAll(); if (!render()) return; list.hidden = false; input.setAttribute('aria-expanded', 'true'); root.classList.add('is-open'); openMenu = api; };
    var visible = function () { return items.filter(function (li) { return !li.hidden; }); };
    var setActive = function (i) { var v = visible(); if (!v.length) return; active = (i + v.length) % v.length; items.forEach(function (li) { li.classList.remove('is-active'); }); v[active].classList.add('is-active'); v[active].scrollIntoView({ block: 'nearest' }); };
    input.addEventListener('focus', show);
    input.addEventListener('input', show);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); if (list.hidden) show(); setActive(active + 1); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(active - 1); }
      else if (ev.key === 'Enter' && !list.hidden && active > -1) { ev.preventDefault(); input.value = visible()[active].dataset.value; api.close(); openMenu = null; }
      else if (ev.key === 'Escape') { api.close(); openMenu = null; }
    });
    toggle.addEventListener('click', function () { if (list.hidden) { input.focus(); items.forEach(function (li) { li.hidden = false; }); list.hidden = false; input.setAttribute('aria-expanded', 'true'); root.classList.add('is-open'); openMenu = api; } else { api.close(); openMenu = null; } });
    items.forEach(function (li) { li.addEventListener('mousedown', function (ev) { ev.preventDefault(); input.value = li.dataset.value; api.close(); openMenu = null; input.dispatchEvent(new Event('input', { bubbles: true })); }); });
  });

  /* ---------- scroll reveal ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rev = $$('[data-reveal]');
  $$('main section:not(.hero) h2, main .lead, main .card:not([data-reveal]), main .tile, main [data-product], main details').forEach(function (el) { if (!el.hasAttribute('data-reveal') && !el.closest('[data-stack]')) { el.setAttribute('data-reveal', ''); rev.push(el); } });
  if (!('IntersectionObserver' in window) || reduce) { rev.forEach(function (el) { el.classList.add('in'); }); }
  else {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rev.forEach(function (el) { io.observe(el); });
  }

  /* ---------- stacked category layers: earlier cards scale back as the next one covers them ---------- */
  var stack = $('[data-stack]');
  if (stack && !reduce) {
    var sc = $$('.stack-card', stack), ticking = false;
    var upd = function () {
      ticking = false;
      sc.forEach(function (c, i) {
        var nx = sc[i + 1]; if (!nx) return;
        var r = nx.getBoundingClientRect(), top = parseFloat(getComputedStyle(nx).top) || 0;
        var h = c.offsetHeight, p = Math.min(1, Math.max(0, (h - (r.top - top)) / h));
        c.style.setProperty('--p', p.toFixed(3));
      });
    };
    var onS = function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } };
    addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); upd();
  }

  /* ---------- testimonials tabs (auto-rotate, pause on hover/focus) ---------- */
  var voices = $('[data-voices]');
  if (voices) {
    var vt = $$('[data-voice-tab]', voices), vp = $$('[data-voice-panel]', voices), bar = $('.voices-bar', voices), cur = 0, timer = null, paused = false;
    voices.classList.add('js-voices');
    var go = function (n) {
      cur = (n + vt.length) % vt.length;
      vt.forEach(function (t, i) { t.setAttribute('aria-selected', i === cur ? 'true' : 'false'); });
      vp.forEach(function (p, i) { p.classList.toggle('is-on', i === cur); });
      if (bar) { bar.classList.remove('run'); void bar.offsetWidth; if (!paused && !reduce) bar.classList.add('run'); }
      clearTimeout(timer); if (!reduce && !paused) timer = setTimeout(function () { go(cur + 1); }, 7000);
    };
    vt.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
    voices.addEventListener('mouseenter', function () { paused = true; clearTimeout(timer); if (bar) bar.classList.remove('run'); });
    voices.addEventListener('mouseleave', function () { paused = false; go(cur); });
    go(0);
  }

  /* ---------- subtle 3D tilt on photo tiles ---------- */
  if (!reduce) $$('[data-tilt]').forEach(function (t) {
    t.addEventListener('pointermove', function (ev) { if (ev.pointerType !== 'mouse') return; var r = t.getBoundingClientRect(); t.style.setProperty('--ry', ((ev.clientX - r.left) / r.width - .5) * 8 + 'deg'); t.style.setProperty('--rx', (.5 - (ev.clientY - r.top) / r.height) * 8 + 'deg'); });
    t.addEventListener('pointerleave', function () { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
  });

  /* ---------- on-page nav: highlight the section in view ---------- */
  var sub = $$('.chip-nav');
  if (sub.length && 'IntersectionObserver' in window) {
    var map = {}; sub.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) map[t.id] = a; });
    var so = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { sub.forEach(function (a) { a.classList.remove('is-current'); a.removeAttribute('aria-current'); }); var a = map[en.target.id]; if (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); var nv = a.parentNode; if (nv.scrollWidth > nv.clientWidth) nv.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' }); } } }); }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { so.observe(document.getElementById(id)); });
  }
})();
