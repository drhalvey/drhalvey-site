/* drhalvey.com.au "Clinic leaflet" behaviour (01/10/2026). No dependencies.
   Components: menu, contents list, print, journey video, accordions, fasting bands calculator,
   mini medicine planner (reads the medicine list and rules from medicine-timing.html, so there is
   one source of truth), dated week-by-week plan, "before surgery" prep block. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY = 86400000;
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseIso(s) { var p = (s || '').split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
  function clock(d) { var h = d.getHours(); return (h % 12 || 12) + ':' + pad(d.getMinutes()) + ' ' + (h < 12 ? 'am' : 'pm'); }
  function dayName(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONS[d.getMonth()]; }
  function shortDate(d) { return d.getDate() + ' ' + MONS[d.getMonth()]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var uid = 0; function nid(p) { uid += 1; return p + '-' + uid; }

  /* shared operation date (meds planner and week plan use the same one) */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var opDate = iso(today);
  var opListeners = [];
  function setOpDate(v) { if (!parseIso(v)) return; opDate = v; opListeners.forEach(function (f) { f(v); }); }

  /* menu */
  var menu = $('.lf-menu'), nav = $('.lf-nav');
  if (menu && nav) menu.addEventListener('click', function () {
    var open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* contents list from the page's own section headings */
  var toc = $('.lf-toc[data-auto]'), main = $('.lf-main');
  if (toc && main) {
    var hs = $$('h2', main).filter(function (h) { return !h.closest('.lf-acc'); });
    hs.forEach(function (h, i) {
      if (!h.id) h.id = 'section-' + (i + 1);
      var a = document.createElement('a'); a.href = '#' + h.id; a.textContent = h.textContent.replace(/\s+/g, ' ').trim(); toc.appendChild(a);
    });
    if (hs.length < 2) { var g = toc.closest('.lf-grid'); var as = toc.closest('.lf-aside'); if (as && hs.length === 0) { as.parentNode.removeChild(as); if (g) g.classList.add('lf-nototc'); } }
  }
  /* on phones the contents list starts folded so the page itself comes first */
  $$('.lf-aside .lf-toch').forEach(function (h) {
    h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.setAttribute('aria-expanded', 'false');
    function t() { var a = h.closest('.lf-aside'); var o = a.classList.toggle('open'); h.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    h.addEventListener('click', t); h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
  });
  $$('.lf-print').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  /* journey video: starts by itself, muted, unless the reader prefers less motion */
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('.lf-video video').forEach(function (v) {
    v.muted = true;
    if (still) { v.removeAttribute('autoplay'); v.pause(); return; }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });

  /* accordions */
  function wireAcc(root) {
    $$('.lf-acc>button', root).forEach(function (b) {
      if (b._wired) return; b._wired = true;
      b.addEventListener('click', function () {
        var body = b.nextElementSibling, open = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', open ? 'false' : 'true'); body.hidden = open;
        $('.pm', b).textContent = open ? '+' : '−';
      });
    });
  }
  function acc(title, sub, body, open) {
    var id = nid('acc');
    return '<div class="lf-acc"><button type="button" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="' + id + '">' +
      '<span><span class="t">' + title + '</span><span class="s">' + sub + '</span></span><span class="pm" aria-hidden="true">' + (open ? '−' : '+') + '</span></button>' +
      '<div class="lf-accb" id="' + id + '"' + (open ? '' : ' hidden') + '>' + body + '</div></div>';
  }

  /* drawings for the fasting bands. Clear fluids show newspaper print through the glass. */
  var ST = 'stroke="#4e1d24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var NEWS = '<path d="M16 14h12M16 18h12M16 22h12M16 26h12M16 30h10M16 34h8" stroke="#8a7a6a" stroke-width="1.2" fill="none"/>';
  var G = 'M13 8h18l-2 30H15z';
  function svg(inner) { return '<svg width="48" height="48" viewBox="0 0 44 44" aria-hidden="true" focusable="false">' + inner + '</svg>'; }
  function clearGlass(tint, op, extra) {
    return svg('<path d="' + G + '" fill="#fff" stroke="none"/>' + NEWS + '<path d="M14.4 16h15.2l-1.5 21H15.9z" fill="' + tint + '" fill-opacity="' + op + '" stroke="none"/><path d="' + G + '" fill="none" ' + ST + '/>' + (extra || ''));
  }
  var ICON = {
    toast: svg('<path d="M10 20c-3-1-4-4-3-7 1-4 6-6 15-6s14 2 15 6c1 3 0 6-3 7v15H10z" fill="#f0d9b8" ' + ST + '/><path d="M15 24h14M15 29h10" fill="none" ' + ST + '/>'),
    milk: svg('<path d="' + G + '" fill="#fff" ' + ST + '/><path d="M14.4 15h15.2l-1.6 22H16z" fill="#f4efe9" stroke="none"/><path d="' + G + '" fill="none" ' + ST + '/>'),
    latte: svg('<path d="M9 16h22v10a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" fill="#d8b49a" ' + ST + '/><path d="M31 19h3a4 4 0 0 1 0 8h-3M6 38h30" fill="none" ' + ST + '/>'),
    water: clearGlass('#cfe3ea', 0.35),
    black: svg('<path d="M9 16h22v10a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" fill="#43332f" ' + ST + '/><path d="M31 19h3a4 4 0 0 1 0 8h-3M6 38h30" fill="none" ' + ST + '/>'),
    apple: clearGlass('#f2cf63', 0.42),
    cordial: clearGlass('#ee9a6a', 0.35, '<path d="M25 3l-3 26" fill="none" ' + ST + '/>')
  };
  var LABEL = { toast: 'Food', milk: 'Milk', latte: 'Milky tea or coffee', water: 'Water', black: 'Black tea or coffee', apple: 'Clear apple juice', cordial: 'Clear cordial' };
  var ORDER = ['toast', 'milk', 'latte', 'water', 'black', 'apple', 'cordial'];
  function icons(ok) {
    return '<div class="lf-icons">' + ORDER.map(function (k) {
      var yes = ok.indexOf(k) > -1;
      return '<div class="lf-ic ' + (yes ? 'ok' : 'no') + '"><span class="b" aria-hidden="true">' + (yes ? '✓' : '✕') + '</span>' + ICON[k] +
        '<span>' + LABEL[k] + '<span class="lf-sr">' + (yes ? ': yes' : ': no') + '</span></span></div>';
    }).join('') + '</div>';
  }

  /* fasting bands calculator */
  function fastingHTML(pre) {
    var d = nid('fd'), t = nid('ft'); pre = pre || {};
    var sel = pre.time === undefined ? '07:00' : pre.time;   /* null means: make the patient choose */
    var opts = sel ? '' : '<option value="" selected>Choose your arrival time</option>';
    for (var m = 5 * 60; m <= 20 * 60 + 45; m += 15) { var hh = Math.floor(m / 60), mm = m % 60, v = pad(hh) + ':' + pad(mm); opts += '<option value="' + v + '"' + (v === sel ? ' selected' : '') + '>' + (hh % 12 || 12) + ':' + pad(mm) + (hh < 12 ? ' am' : ' pm') + '</option>'; }
    return '<div class="lf-two"><div class="lf-field"><label for="' + d + '">Date you arrive at hospital</label><input type="date" id="' + d + '" data-f="date"></div>' +
      '<div class="lf-field"><label for="' + t + '">Time you arrive</label><select id="' + t + '" data-f="time">' + opts + '</select></div></div>' +
      '<p class="lf-small" style="margin:8px 0 0">Use the arrival time on your hospital letter, not the time of the operation.</p>' +
      '<div class="lf-bands" aria-live="polite" data-f="out"></div>' +
      '<p class="lf-small" style="margin:14px 0 0">A clear fluid is one you can see through. This is a general guide using the standard 6-hour and 2-hour rules; your hospital\'s times come first.</p>';
  }
  function wireFasting(root, pre) {
    var di = $('[data-f="date"]', root), ti = $('[data-f="time"]', root), out = $('[data-f="out"]', root);
    var tm = new Date(today.getTime() + DAY); di.value = (pre && parseIso(pre.date)) ? pre.date : iso(tm);
    function draw() {
      var d = parseIso(di.value); if (!d || !ti.value) { out.innerHTML = ''; return; }
      var tp = ti.value.split(':'); var arrive = new Date(d.getFullYear(), d.getMonth(), d.getDate(), +tp[0], +tp[1]);
      var food = new Date(arrive.getTime() - 6 * 3600000), fluid = new Date(arrive.getTime() - 2 * 3600000);
      function band(cls, when, day, head, sub, ok) {
        return '<div class="lf-band ' + cls + '"><div><div class="when">' + when + '</div><div class="day">' + day + '</div></div>' +
          '<div><div class="head">' + head + '</div><div class="sub">' + sub + '</div>' + icons(ok) + '</div></div>';
      }
      out.innerHTML =
        band('', 'Until ' + clock(food), dayName(food), 'Eat and drink as normal', 'A light meal is fine up to this time.', ORDER) +
        band('amber', clock(food) + ' to ' + clock(fluid), dayName(food), 'Clear fluids only', 'Stop all food and anything with milk. Small amounts of clear fluids are fine.', ['water', 'black', 'apple', 'cordial']) +
        band('red', 'From ' + clock(fluid), dayName(fluid), 'Nothing to eat or drink', 'Unless your hospital allows a few sips of water to take your medicines.', []);
    }
    di.addEventListener('change', draw); di.addEventListener('input', draw); ti.addEventListener('change', draw); draw();
  }

  /* mini medicine planner: parses MEDS and RULES from medicine-timing.html */
  var medData = null, medWaiters = [];
  function loadMeds(cb) {
    if (medData) return cb(medData);
    medWaiters.push(cb); if (medWaiters.length > 1) return;
    var base = (document.documentElement.getAttribute('data-root') || '');
    fetch(base + 'medicine-timing.html').then(function (r) { return r.text(); }).then(function (src) {
      var rules = {}, meds = [];
      var ri = src.indexOf('var RULES={'), rj = src.indexOf('\n};', ri);
      var rb = src.slice(ri, rj) + '\n', re = /\n\s*([A-Z_0-9]+)\s*:\s*\{(.*?)\}\s*,?/g, m;
      while ((m = re.exec(rb))) {
        var ins = /instr:"((?:[^"\\]|\\.)*)"/.exec(m[2]), dd = /dateDays:(\d+)/.exec(m[2]);
        rules[m[1]] = { i: ins ? ins[1].replace(/<[^>]+>/g, '').replace(/\\'/g, "'") : '', d: dd ? +dd[1] : null };
      }
      rules.DOAC = { i: 'The stop date for this blood thinner depends on your kidney function. Use the full medicine planner, which asks one question and then gives you the date.', d: null, full: 1 };
      rules.INSULIN = { i: 'Insulin doses change before surgery depending on the type of insulin. Use the full medicine planner, which asks which insulin you use.', d: null, full: 1 };
      var mi = src.indexOf('var MEDS=['), mj = src.indexOf('];', mi), mre = /M\("([^"]+)",\[([^\]]*)\],"([A-Z_0-9]+)"/g;
      var mb = src.slice(mi, mj);
      while ((m = mre.exec(mb))) meds.push([m[1], m[2].split(',').map(function (x) { return x.trim().replace(/^"|"$/g, ''); }).filter(Boolean), m[3]]);
      medData = { rules: rules, meds: meds };
    }).catch(function () { medData = { rules: {}, meds: [], failed: true }; })
      .then(function () { medWaiters.forEach(function (f) { f(medData); }); medWaiters = []; });
  }
  function medsHTML() {
    var q = nid('mq'), d = nid('md');
    return '<p style="margin:0 0 14px">Keep taking your regular medicines unless you have been told otherwise. Type a medicine to see what to do with it.</p>' +
      '<div class="lf-two"><div class="lf-field"><label for="' + q + '">Medicine name</label><input type="search" id="' + q + '" data-m="q" autocomplete="off" placeholder="For example: Xarelto, Jardiance, Coversyl"></div>' +
      '<div class="lf-field"><label for="' + d + '">Date of your operation</label><input type="date" id="' + d + '" data-m="date"></div></div>' +
      '<div style="margin-top:14px" aria-live="polite" data-m="out"><p class="lf-small">Start typing a medicine name or brand.</p></div>' +
      '<p class="lf-small" style="margin:10px 0 0">A general guide. Always follow the times your hospital gives you. <a href="medicine-timing.html">Full medicine planner and printable list</a></p>';
  }
  function wireMeds(root, pre) {
    var qi = $('[data-m="q"]', root), di = $('[data-m="date"]', root), out = $('[data-m="out"]', root);
    di.value = (pre && parseIso(pre.date)) ? pre.date : opDate; if (pre && pre.q) qi.value = pre.q; opListeners.push(function (v) { if (di.value !== v) di.value = v; draw(); });
    function draw() {
      var ql = qi.value.trim().toLowerCase();
      if (ql.length < 2) { out.innerHTML = '<p class="lf-small">Start typing a medicine name or brand.</p>'; return; }
      loadMeds(function (md) {
        if (md.failed) { out.innerHTML = '<p class="lf-small">The medicine list could not load. Use the <a href="medicine-timing.html">full medicine planner</a>.</p>'; return; }
        var op = parseIso(di.value) || today, hits = [];
        for (var i = 0; i < md.meds.length && hits.length < 6; i++) {
          var x = md.meds[i]; if ((x[0] + ' ' + x[1].join(' ')).toLowerCase().indexOf(ql) < 0) continue;
          var r = md.rules[x[2]] || { i: 'Please check with the rooms before surgery.', d: null };
          var ld = r.d ? new Date(op.getTime() - r.d * DAY) : null;
          hits.push('<div class="lf-hit ' + (ld ? 'stop' : (r.full ? 'ask' : '')) + '"><div class="n">' + esc(x[0].charAt(0).toUpperCase() + x[0].slice(1)) + '</div>' +
            '<div class="br">' + esc(x[1].length ? x[1].join(', ') : 'Generic name') + '</div><p>' + esc(r.i) + '</p>' + (ld ? '<p class="ld">Last dose: ' + dayName(ld) + '</p>' : '') + '</div>');
        }
        out.innerHTML = hits.length ? hits.join('') : '<p class="lf-small">Not found here. Check the <a href="medicine-timing.html">full medicine planner</a>, or ask the rooms.</p>';
      });
    }
    qi.addEventListener('input', draw); di.addEventListener('change', function () { setOpDate(di.value); });
    if (pre && pre.q) draw();
  }

  var GLP1 = '<p style="margin:0 0 12px">If you take Ozempic, Wegovy, Mounjaro, Trulicity or a similar medicine, you need special fasting rules.</p>' +
    '<table class="lf-stack"><tbody><tr><td style="width:34%;font-weight:600;color:#241a18">24 to 6 hours before admission</td><td>Clear fluids only.</td></tr>' +
    '<tr><td style="font-weight:600;color:#241a18">6 to 2 hours before</td><td>Water only, up to 200 ml an hour.</td></tr>' +
    '<tr><td style="font-weight:600;color:#241a18">2 hours before</td><td>Nothing by mouth.</td></tr></tbody></table>' +
    '<p class="lf-small" style="margin:0">If you did not follow these rules, tell the hospital: your surgery may be delayed. <a href="glp1-before-surgery.html">Full GLP-1 guide</a></p>';

  /* before-surgery prep block: three tools that open in place */
  $$('.lf-prep').forEach(function (el) {
    var parts = (el.getAttribute('data-parts') || 'fasting meds glp1').split(/\s+/);
    var html = '';
    if (parts.indexOf('fasting') > -1) html += acc('Your fasting times', 'When to stop eating and drinking, worked out from your arrival time', '<div data-tool="fasting">' + fastingHTML() + '</div>', true);
    if (parts.indexOf('meds') > -1) html += acc('Your medicines', 'What to do with each medicine, and the date of your last dose', '<div data-tool="meds">' + medsHTML() + '</div>', false);
    if (parts.indexOf('glp1') > -1) html += acc('GLP-1 medicines', 'Ozempic, Wegovy, Mounjaro and similar', GLP1, false);
    el.innerHTML = html; wireAcc(el);
  });
  $$('.lf-fasting').forEach(function (el) { el.innerHTML = '<div data-tool="fasting">' + fastingHTML() + '</div>'; });
  $$('.lf-medsmini').forEach(function (el) { el.innerHTML = '<div data-tool="meds">' + medsHTML() + '</div>'; });
  $$('[data-tool="fasting"]').forEach(function (el) { wireFasting(el); });
  $$('[data-tool="meds"]').forEach(function (el) { wireMeds(el); });
  /* the site search opens these tools inside its answer card, filled in from the patient's question */
  window.DRH_TOOLS = {
    fasting: function (el, pre) { el.innerHTML = '<div data-tool="fasting">' + fastingHTML(pre) + '</div>'; wireFasting(el.firstChild, pre); },
    meds: function (el, pre) { el.innerHTML = '<div data-tool="meds">' + medsHTML() + '</div>'; wireMeds(el.firstChild, pre); },
    glp1: function (el) { el.innerHTML = GLP1; },
    findMeds: function (cb) { loadMeds(cb); }
  };
  wireAcc(document);

  /* dated week-by-week plan: <table class="lf-wk" data-from="0,14,28,42"> */
  $$('table.lf-wk').forEach(function (tb) {
    var from = (tb.getAttribute('data-from') || '').split(',').map(Number);
    var rows = $$('tbody tr', tb);
    var bar = document.createElement('div'); bar.className = 'lf-planbar';
    var id = nid('op');
    bar.innerHTML = '<div class="lf-field"><label for="' + id + '">Date of your operation</label><input type="date" id="' + id + '" style="width:auto"></div><p class="now" aria-live="polite"></p>';
    tb.parentNode.insertBefore(bar, tb);
    var inp = $('input', bar), now = $('.now', bar);
    rows.forEach(function (r) { var c = r.cells[0]; if (!$('small', c)) { var s = document.createElement('small'); c.appendChild(s); } });
    function draw() {
      var op = parseIso(inp.value) || today; var since = Math.floor((today.getTime() - op.getTime()) / DAY);
      rows.forEach(function (r, i) {
        var a = from[i], b = i + 1 < from.length ? from[i + 1] - 1 : null; if (isNaN(a)) return;
        var s = $('small', r.cells[0]);
        s.textContent = b === null ? 'From ' + shortDate(new Date(op.getTime() + a * DAY)) : shortDate(new Date(op.getTime() + a * DAY)) + ' to ' + shortDate(new Date(op.getTime() + b * DAY));
        r.classList.toggle('cur', since >= a && (b === null || since <= b));
      });
      now.textContent = since < 0 ? 'Your operation is in ' + (-since) + (since === -1 ? ' day.' : ' days.') : since === 0 ? 'Today is the day of your operation.' : 'You are on day ' + since + ' after your operation. Your current stage is highlighted.';
    }
    inp.value = opDate; opListeners.push(function (v) { if (inp.value !== v) inp.value = v; draw(); });
    inp.addEventListener('change', function () { setOpDate(inp.value); draw(); });
    draw();
  });
})();
