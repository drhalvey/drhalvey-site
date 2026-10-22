/* Orthopaedic Anaesthesia: Surgery First. Index search and filters, section controls, and the local layer gate.
   The local layer (ortho/data/local.enc.json) is AES-GCM ciphertext; the key is derived in the browser from a
   passphrase with PBKDF2-SHA256 and nothing is ever sent anywhere. */
(function () {
  'use strict';
  var base = (function () {
    var s = document.querySelector('script[src$="ortho.js"]');
    return s ? s.getAttribute('src').replace(/ortho\.js$/, '') : './';
  })();

  /* ---------- section controls ---------- */
  function setAll(open) {
    document.querySelectorAll('details.ob-section').forEach(function (d) { d.open = open; });
  }
  document.querySelectorAll('[data-expand]').forEach(function (b) { b.addEventListener('click', function () { setAll(true); }); });
  document.querySelectorAll('[data-collapse]').forEach(function (b) { b.addEventListener('click', function () { setAll(false); }); });
  window.addEventListener('beforeprint', function () { setAll(true); });
  if (location.hash && document.body.classList.contains('ob-card-page')) { setAll(true); }

  /* ---------- index: search and filters ---------- */
  var A = window.ORTHO_ATLAS;
  if (A && document.getElementById('ob-results')) {
    var q = document.getElementById('ob-q'), results = document.getElementById('ob-results'),
        count = document.getElementById('ob-count'), form = document.getElementById('ob-filters'), atlas = document.getElementById('ob-atlas');

    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function painBadge(n) { return '<span class="ob-pain ob-pain-' + n + '" title="Pain score ' + n + ' of 5"><span class="ob-pain-num">' + n + '</span><span class="ob-pain-lab">' + esc(A.labels.pain[n]) + '</span></span>'; }
    function meta(c) {
      return '<b>' + esc(A.labels.family[c.family] || c.family) + '</b> &middot; catheter ' + esc(c.catheter) +
        ' &middot; ' + esc(A.labels.position[c.position] || c.position) +
        (c.tourniquet !== 'no' ? ' &middot; tourniquet ' + esc(c.tourniquet) : '') +
        (c.cement !== 'no' ? ' &middot; cement ' + esc(c.cement) : '') +
        ' &middot; ' + esc(c.duration) + ' &middot; LOS ' + esc(c.los);
    }
    function renderAtlas() {
      var groups = {}, order = [];
      A.cards.forEach(function (c) {
        if (!groups[c.group]) { groups[c.group] = {}; order.push(c.group); }
        if (!groups[c.group][c.region]) { groups[c.group][c.region] = []; }
        groups[c.group][c.region].push(c);
      });
      var h = '';
      order.forEach(function (g) {
        h += '<div class="ob-group"><h3>' + esc(g) + '</h3>';
        Object.keys(groups[g]).forEach(function (r) {
          if (r !== g) { h += '<h4>' + esc(r) + '</h4>'; }
          h += '<ol class="ob-atlas-list">' + groups[g][r].map(function (c) {
            return '<li><span class="ob-num">' + c.n + '</span><a href="c/' + esc(c.id) + '.html">' + esc(c.title) + '</a>' +
              '<span class="ob-tag"><span class="ob-dot ob-dot-' + c.pain + '"></span>pain ' + c.pain + ' &middot; ' + esc(A.labels.family[c.family] || c.family) + ' &middot; catheter ' + esc(c.catheter) + '</span></li>';
          }).join('') + '</ol>';
        });
        h += '</div>';
      });
      atlas.innerHTML = h;
    }
    function activeFilters() {
      var f = {};
      form.querySelectorAll('input[type=checkbox]:checked').forEach(function (i) { (f[i.name] = f[i.name] || []).push(i.value); });
      return f;
    }
    function tokens(s) { return s.toLowerCase().replace(/[^a-z0-9\- ]+/g, ' ').split(/\s+/).filter(Boolean); }
    function score(c, toks) {
      if (!toks.length) { return 1; }
      var s = 0;
      for (var i = 0; i < toks.length; i++) {
        var t = toks[i], hit = 0;
        if (c.title.toLowerCase().indexOf(t) >= 0) { hit = 3; }
        else if (c.aka.join(' ').toLowerCase().indexOf(t) >= 0) { hit = 2; }
        else if (c.text.indexOf(t) >= 0) { hit = 1; }
        if (!hit) { return 0; }
        s += hit;
      }
      return s;
    }
    function run() {
      var toks = tokens(q.value), f = activeFilters(), anyFilter = Object.keys(f).length > 0;
      if (!toks.length && !anyFilter) { results.innerHTML = ''; count.textContent = ''; atlas.hidden = false; return; }
      var hits = A.cards.map(function (c) {
        for (var k in f) { if (f[k].indexOf(String(c[k])) < 0) { return null; } }
        var s = score(c, toks);
        return s ? { c: c, s: s } : null;
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s || a.c.n - b.c.n; });
      var chap = [];
      if (toks.length && !anyFilter) {
        (A.chapters_a.map(function (ch) { ch.part = 'a'; return ch; }).concat(A.chapters_b.map(function (ch) { ch.part = 'b'; return ch; }))).forEach(function (ch) {
          var txt = (ch.title + ' ' + ch.summary).toLowerCase();
          if (toks.every(function (t) { return txt.indexOf(t) >= 0; })) { chap.push(ch); }
        });
      }
      count.textContent = hits.length + (hits.length === 1 ? ' procedure' : ' procedures') + (chap.length ? ', ' + chap.length + ' chapter' + (chap.length === 1 ? '' : 's') : '');
      results.innerHTML = hits.map(function (h) {
        var c = h.c;
        return '<li class="ob-result">' + painBadge(c.pain) + '<div><a class="ob-result-title" href="c/' + esc(c.id) + '.html">' + c.n + '. ' + esc(c.title) + '</a>' +
          '<p class="ob-result-meta">' + meta(c) + '</p><p class="ob-result-meta">' + esc(c.trap) + '</p></div></li>';
      }).join('') + chap.map(function (ch) {
        return '<li class="ob-result"><span class="ob-pain" style="background:var(--ob-sunk);color:var(--ob-muted)"><span class="ob-pain-num" style="font-size:1rem">' + ch.part.toUpperCase() + '</span></span><div><a class="ob-result-title" href="' + ch.part + '/' + esc(ch.id) + '.html">' + esc(ch.title) + '</a><p class="ob-result-meta">' + esc(ch.summary) + '</p></div></li>';
      }).join('');
      atlas.hidden = hits.length > 0 || chap.length > 0;
    }
    renderAtlas();
    q.addEventListener('input', run);
    form.addEventListener('change', run);
    form.addEventListener('reset', function () { setTimeout(run, 0); });
    if (location.hash === '#part-a' || location.hash === '#part-b') { /* plain anchor, nothing to do */ }
  }

  /* ---------- local layer ---------- */
  var unlockBtn = document.getElementById('ob-unlock');
  var localBox = document.getElementById('ob-local');
  var enc = null, payload = null;
  var KEY_STORE = 'ob-local-key';

  function b64ToBytes(s) { var bin = atob(s), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) { out[i] = bin.charCodeAt(i); } return out; }
  function bytesToB64(b) { var s = ''; for (var i = 0; i < b.length; i++) { s += String.fromCharCode(b[i]); } return btoa(s); }
  function esc2(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function para(s) { return String(s || '').split(/\n{2,}/).map(function (p) { return '<p>' + esc2(p).replace(/\n/g, '<br>') + '</p>'; }).join(''); }

  function deriveKey(phrase, salt, iter) {
    var te = new TextEncoder();
    return crypto.subtle.importKey('raw', te.encode(phrase.trim()), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
    });
  }
  function decryptWith(key) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(enc.iv) }, key, b64ToBytes(enc.ct)).then(function (buf) {
      payload = JSON.parse(new TextDecoder().decode(buf));
      return payload;
    });
  }
  function renderLocal() {
    if (unlockBtn) { unlockBtn.classList.add('is-open'); unlockBtn.textContent = 'My practice: unlocked'; }
    if (!localBox) { return; }
    var id = localBox.getAttribute('data-card'), d = payload.cards[id];
    var h = '<h2>My practice</h2>';
    if (!d) {
      h += '<p class="ob-local-empty">No local notes recorded for this operation.</p>';
    } else {
      if (d.mbs && d.mbs.length) {
        h += '<h3>MBS anaesthesia items</h3><table><thead><tr><th>Item</th><th>Description</th><th>Units</th><th>Note</th></tr></thead><tbody>' +
          d.mbs.map(function (m) {
            return '<tr' + (m.pick ? ' class="ob-pick"' : '') + '><td>' + esc2(m.item) + (m.pick ? ' &#10003;' : '') + '</td><td>' + esc2(m.label) + '</td><td>' + esc2(m.units) + '</td><td>' + esc2(m.note) + '</td></tr>';
          }).join('') + '</tbody></table>';
      }
      if (d.regimen) { h += '<h3>Standard regimen</h3>' + para(d.regimen); }
      if (d.surgeons && d.surgeons.length) {
        h += '<h3>Surgeons</h3>' + d.surgeons.map(function (s) { return '<p><strong>' + esc2(s.name) + '.</strong> ' + esc2(s.notes) + '</p>'; }).join('');
      }
      if (d.notes) { h += '<h3>Notes</h3>' + para(d.notes); }
    }
    localBox.innerHTML = h;
    localBox.hidden = false;
  }
  function gate() {
    var wrap = document.createElement('div');
    wrap.className = 'ob-gate';
    wrap.innerHTML = '<form><h2>My practice</h2><p class="ob-muted">The local layer holds your regimens, item numbers and surgeon notes. It is decrypted in this browser and nothing is sent anywhere.</p>' +
      '<label for="ob-pass">Passphrase</label><input id="ob-pass" type="password" autocomplete="current-password"><p class="ob-err" id="ob-err"></p>' +
      '<div class="ob-gate-row"><button type="button" class="ob-expand" id="ob-cancel">Cancel</button><button type="submit" class="ob-expand">Unlock</button></div></form>';
    document.body.appendChild(wrap);
    var input = wrap.querySelector('#ob-pass'), err = wrap.querySelector('#ob-err');
    input.focus();
    wrap.querySelector('#ob-cancel').addEventListener('click', function () { wrap.remove(); });
    wrap.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = 'Deriving key';
      deriveKey(input.value, b64ToBytes(enc.salt), enc.iter).then(function (key) {
        return decryptWith(key).then(function () {
          return crypto.subtle.exportKey('raw', key).then(function (raw) {
            try { sessionStorage.setItem(KEY_STORE, bytesToB64(new Uint8Array(raw))); } catch (ex) { /* private window */ }
          });
        });
      }).then(function () { wrap.remove(); renderLocal(); })
        .catch(function () { err.textContent = 'That passphrase did not unlock the layer.'; });
    });
  }
  function tryStoredKey() {
    var raw = null;
    try { raw = sessionStorage.getItem(KEY_STORE); } catch (ex) { raw = null; }
    if (!raw) { return Promise.reject(); }
    return crypto.subtle.importKey('raw', b64ToBytes(raw), { name: 'AES-GCM' }, true, ['decrypt']).then(decryptWith);
  }
  if (unlockBtn && window.crypto && crypto.subtle) {
    fetch(base + 'data/local.enc.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.ct) { return; }
      enc = j;
      unlockBtn.hidden = false;
      unlockBtn.addEventListener('click', function () {
        if (payload) {
          try { sessionStorage.removeItem(KEY_STORE); } catch (ex) { /* ignore */ }
          payload = null;
          unlockBtn.classList.remove('is-open'); unlockBtn.textContent = 'My practice';
          if (localBox) { localBox.hidden = true; localBox.innerHTML = ''; }
          return;
        }
        gate();
      });
      tryStoredKey().then(renderLocal).catch(function () { /* locked */ });
    }).catch(function () { /* no local layer published */ });
  }
})();
