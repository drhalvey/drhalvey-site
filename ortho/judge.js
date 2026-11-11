/* Judge my practice: sends the entered plan plus this book's card for the operation to the AI relay and shows its opinion.
   Unlike the search, the text shown here is written by the AI. No patient identifiers should be entered. */
(function () {
  'use strict';
  var A = window.ORTHO_ATLAS, form = document.getElementById('jf'); if (!A || !form) { return; }
  var RELAY = 'https://bbwjroytqxynborrqylr.supabase.co/functions/v1/ai-relay';
  var TOKEN = 'ai_89af858d725a4f6b86a4624f487eb26b6a90fe7a0d0e410e815f7f490872396e';
  var out = document.getElementById('j-out'), status = document.getElementById('j-status'), go = document.getElementById('j-go');
  var FIELDS = ['j-op', 'j-age', 'j-wt', 'j-asa', 'j-hx', 'j-var', 'j-tech', 'j-airway', 'j-neuraxial', 'j-block', 'j-drugs', 'j-post'];
  function v(id) { return (document.getElementById(id).value || '').trim(); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function installId() { try { var k = 'ai.iid', x = localStorage.getItem(k); if (!x) { x = (crypto.randomUUID ? crypto.randomUUID() : 'x' + Math.random().toString(36).slice(2) + Date.now()); localStorage.setItem(k, x); } return x; } catch (e) { return 'm' + Date.now(); } }
  try { var saved = JSON.parse(sessionStorage.getItem('ob-judge') || '{}'); FIELDS.forEach(function (id) { if (saved[id]) { document.getElementById(id).value = saved[id]; } }); } catch (e) { /* nothing saved */ }
  var pre = (location.hash || '').slice(1); if (pre && document.querySelector('#j-op option[value="' + pre.replace(/[^a-z0-9-]/g, '') + '"]')) { document.getElementById('j-op').value = pre; }

  var SYS = "You are an experienced consultant anaesthetist with a subspecialty interest in orthopaedic anaesthesia, regional anaesthesia and acute pain, giving a frank peer opinion on a colleague's anaesthetic for one case. " +
    "Your colleague is a consultant in Australia: no teaching of basics, no flattery, no hedging padding, no disclaimers. UK English. Australian drug names. Never use em dashes. " +
    "You are given the reference card for the operation from the textbook they use (what the surgeon does, the pain mechanism and score, the recommended block and catheter decision, drug defaults, the main trap, pain plan and pitfalls). " +
    "Judge the plan against that card first, then against your own knowledge where the card is silent, and say which is which. " +
    "Check every dose: work out mg/kg for each local anaesthetic and the TOTAL local anaesthetic across spinal, blocks and surgeon infiltration against weight; check opioid doses for age and renal function; check tranexamic acid, antibiotic and dexamethasone doses; check anticoagulant timing against any neuraxial technique or deep block. Show the arithmetic briefly. If weight or another needed fact is missing, say what is missing and what you assumed. " +
    "Reply in exactly these sections, each heading on its own line in capitals followed by a colon: " +
    "VERDICT: one sentence, starting with one of Sound, Reasonable with changes, or Would not do this. " +
    "WHAT FITS THE OPERATION: up to 4 short bullet lines starting with '- '. " +
    "WHAT I WOULD CHANGE: bullet lines, most important first, each with the reason tied to what the surgeon does or to the patient. " +
    "DOSE CHECK: one bullet line for EVERY drug the colleague entered, including every opioid in theatre, recovery and the post-operative plan, each with the mg/kg or the comparison and a judgement for this patient's age, weight and renal function; then one line for the total local anaesthetic. Do not skip a drug. " +
    "WHAT IS MISSING: bullet lines for anything the operation or patient needs that the plan does not mention. Write '- Nothing' if nothing. " +
    "IF THIS WERE MY CASE: two or three sentences describing what you would have done. " +
    "Keep the whole reply under 480 words.";

  function cardText(id) {
    return fetch('c/' + id + '.html').then(function (r) { return r.ok ? r.text() : ''; }).then(function (h) {
      var d = new DOMParser().parseFromString(h, 'text/html'), parts = [];
      var loc = d.querySelector('.ob-local'); if (loc) { loc.remove(); }
      d.querySelectorAll('.ob-fields .ob-field').forEach(function (f) { parts.push(f.querySelector('dt').textContent.trim() + ': ' + f.querySelector('dd').textContent.replace(/\s+/g, ' ').trim()); });
      var pd = d.querySelector('.ob-pain-detail'); if (pd) { parts.unshift('Pain: ' + pd.textContent.replace(/\s+/g, ' ').trim()); }
      d.querySelectorAll('details.ob-section').forEach(function (s) {
        var h2 = s.querySelector('h2').textContent.trim();
        if (/Pain plan|Pitfalls|What the surgeon/.test(h2)) { parts.push('## ' + h2 + '\n' + s.querySelector('.ob-section-body').textContent.replace(/\s+/g, ' ').trim().slice(0, 5200)); }
      });
      return parts.join('\n');
    }).catch(function () { return ''; });
  }
  function render(text) {
    var html = '', inList = false;
    text.split(/\n+/).forEach(function (line) {
      line = line.trim(); if (!line) { return; }
      var h = line.match(/^\**([A-Z][A-Z ]{3,40}):\**\s*(.*)$/);
      if (h) { if (inList) { html += '</ul>'; inList = false; } html += '<h2>' + esc((h[1].charAt(0) + h[1].slice(1).toLowerCase()).replace(/\bi\b/g, 'I')) + '</h2>'; line = h[2]; if (!line) { return; } }
      var b = line.match(/^[-*•]\s+(.*)$/);
      if (b) { if (!inList) { html += '<ul>'; inList = true; } html += '<li>' + esc(b[1].replace(/\*\*/g, '')) + '</li>'; }
      else { if (inList) { html += '</ul>'; inList = false; } html += '<p>' + esc(line.replace(/\*\*/g, '')) + '</p>'; }
    });
    if (inList) { html += '</ul>'; }
    return html;
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var id = v('j-op'); if (!id) { status.textContent = 'Choose the operation first.'; return; }
    if (!v('j-tech') && !v('j-block') && !v('j-drugs') && !v('j-neuraxial')) { status.textContent = 'Enter the anaesthetic: technique, blocks or drugs.'; return; }
    var card = A.cards.filter(function (c) { return c.id === id; })[0];
    try { var s = {}; FIELDS.forEach(function (f) { s[f] = document.getElementById(f).value; }); sessionStorage.setItem('ob-judge', JSON.stringify(s)); } catch (e) { /* private window */ }
    go.disabled = true; status.textContent = 'Reading the card and judging. This takes up to half a minute.'; out.hidden = true;
    cardText(id).then(function (ct) {
      var plan = 'OPERATION: ' + card.title + '\nPATIENT: age ' + (v('j-age') || 'not given') + ', weight ' + (v('j-wt') ? v('j-wt') + ' kg' : 'not given') + ', ASA ' + (v('j-asa') || 'not given') +
        '\nHISTORY: ' + (v('j-hx') || 'none given') + '\nSURGICAL DETAILS: ' + (v('j-var') || 'none given') +
        '\nTECHNIQUE: ' + (v('j-tech') || 'not given') + '\nAIRWAY: ' + (v('j-airway') || 'not given') + '\nNEURAXIAL DRUGS: ' + (v('j-neuraxial') || 'none given') +
        '\nBLOCKS: ' + (v('j-block') || 'none given') + '\nOTHER DRUGS: ' + (v('j-drugs') || 'none given') + '\nPOST-OPERATIVE PLAN: ' + (v('j-post') || 'none given');
      var ctl = window.AbortController ? new AbortController() : null; if (ctl) { setTimeout(function () { ctl.abort(); }, 60000); }
      return fetch(RELAY, { method: 'POST', signal: ctl ? ctl.signal : undefined,
        headers: { 'content-type': 'application/json', 'x-app-token': TOKEN, 'x-install-id': installId() },
        body: JSON.stringify({ max_tokens: 3000, temperature: 0.2, messages: [{ role: 'system', content: SYS }, { role: 'user', content: 'TEXTBOOK CARD\n' + ct + '\n\nMY ANAESTHETIC\n' + plan }] }) })
        .then(function (r) { if (!r.ok) { throw new Error('The AI relay returned ' + r.status + '.'); } return r.json(); })
        .then(function (d) {
          var text = (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || '';
          if (!text.trim()) { throw new Error('The AI returned no opinion.'); }
          out.innerHTML = '<p class="ob-judge-case">' + esc(card.title) + ' <a href="c/' + esc(id) + '.html">open the card</a></p>' + render(text) +
            '<p class="ob-muted">An AI opinion read against this book. It can be wrong; check doses yourself.</p>';
          out.hidden = false; status.textContent = ''; out.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }).catch(function (e) { status.textContent = (e && e.name === 'AbortError') ? 'The AI took too long. Try again.' : ((e && e.message) || 'Could not reach the AI.') + ' Your entries are kept; try again.'; })
      .then(function () { go.disabled = false; });
  });
  document.getElementById('j-clear').addEventListener('click', function () {
    FIELDS.forEach(function (f) { document.getElementById(f).value = ''; }); out.hidden = true; out.innerHTML = ''; status.textContent = '';
    try { sessionStorage.removeItem('ob-judge'); } catch (e) { /* ignore */ }
  });
})();
