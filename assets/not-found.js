/* Page-not-found helper for drhalvey.com.au (10/10/2026).
   Runs on 404.html only, after search.js. GitHub Pages cannot send server redirects, so this page
   works out where an old or mistyped link was meant to go:
   1. the same page with a trailing slash, capitals or .htm/.php (/Knee-Replacement/)  -> go there now
   2. a known old address from the previous site (ALIASES)                             -> go there now
   3. an operation or topic word in the address (KEYWORDS)                              -> "Taking you to ..." after a short pause, with a stop link
   4. nothing recognised -> the address words go into the search box and matching pages are listed; Search asks the AI.
   The old addresses Google still links to also have their own redirect pages (made by .github/scripts/make-redirects.py
   from the ALIASES block below), so search engines see a move, not a dead page. Keep the block valid JSON. */
(function(){
  /* ALIASES-START */
  var ALIASES = {
    "procedures-1": "procedures.html",
    "information-for-patients": "pre-op-guidance.html",
    "anaesthesia-for-infusaport-insertion": "infusaport.html",
    "acl-reconstructive-surgery": "acl-reconstruction.html",
    "pain-medications-after-caesarean-section": "caesarean.html#what-pain-relief-am-i-given-after-my-caesarean-bir",
    "caesarean-birth": "caesarean.html",
    "home": "index.html",
    "home-1": "index.html",
    "caesarean-section": "caesarean.html",
    "c-section": "caesarean.html",
    "patient-information": "pre-op-guidance.html",
    "information": "pre-op-guidance.html",
    "patients": "pre-op-guidance.html",
    "before-surgery": "pre-op-guidance.html",
    "preparing-for-surgery": "pre-op-guidance.html",
    "pre-op": "pre-op-guidance.html",
    "preop": "pre-op-guidance.html",
    "after-surgery": "tools/pain-relief.html",
    "pain-relief": "tools/pain-relief.html",
    "fasting-before-surgery": "fasting.html",
    "medications": "medicines-before-surgery.html",
    "medicines": "medicines-before-surgery.html",
    "research": "clinical-research.html",
    "publications": "clinical-research.html",
    "contact-us": "contact.html",
    "about-me": "about.html",
    "about-us": "about.html",
    "fees-and-billing": "fees.html",
    "billing": "fees.html"
  };
  /* ALIASES-END */

  /* Address words to pages. Checked in order: specific operations first, then topics, then general pages.
     A word matches when an address word starts with it (so "haemorrhoid" catches haemorrhoidectomy). */
  var KEYWORDS = [
    [["knee","tkr","tka"], "knee-replacement.html", "Knee replacement"],
    [["hip","thr","tha"], "hip-replacement.html", "Hip replacement"],
    [["acl","cruciate"], "acl-reconstruction.html", "ACL reconstruction"],
    [["arthroscop","keyhole","meniscus"], "joint-arthroscopy.html", "Joint arthroscopy"],
    [["caesar","cesar","csection","lscs"], "caesarean.html", "Caesarean birth"],
    [["cerclage","stitch"], "cervical-cerclage.html", "Cervical cerclage"],
    [["hernia"], "hernia-surgery.html", "Hernia surgery"],
    [["haemorrhoid","hemorrhoid","piles"], "haemorrhoidectomy.html", "Haemorrhoidectomy"],
    [["bowel","colectomy","resection","colorectal"], "bowel-resection.html", "Bowel resection"],
    [["infusaport","portacath","port"], "infusaport.html", "Infusaport insertion"],
    [["endoscop","colonoscop","gastroscop","sedation"], "endoscopy-sedation.html", "Endoscopy and sedation"],
    [["foot","ankle","bunion"], "foot-ankle-surgery.html", "Foot and ankle surgery"],
    [["epidural","labour","labor"], "labour-epidural.html", "Labour epidural"],
    [["spinal"], "spinal-anaesthetic.html", "Spinal anaesthetic"],
    [["nerve","block"], "nerve-blocks.html", "Nerve blocks"],
    [["breastfe"], "breastfeeding-after-anaesthetic.html", "Breastfeeding after an anaesthetic"],
    [["glp","ozempic","mounjaro","wegovy","semaglutide","tirzepatide"], "glp1-before-surgery.html", "GLP-1 medicines before surgery"],
    [["fasting","fast","nil","eat","drink"], "fasting.html", "Fasting before surgery"],
    [["medicine","medication","tablet","blood-thinner"], "medicines-before-surgery.html", "Medicines before surgery"],
    [["arrival","arrive"], "arrival-time.html", "Arrival time"],
    [["consent","risk"], "consent-and-assessment.html", "Consent and assessment"],
    [["needle","fear","anxious","anxiety"], "needle-fear.html", "Worried about needles"],
    [["smok","vap","cannabis"], "smoking-vaping-before-surgery.html", "Smoking and vaping before surgery"],
    [["apnoea","apnea","cpap","snor"], "sleep-apnoea-before-surgery.html", "Sleep apnoea before surgery"],
    [["general","asleep"], "general-anaesthetic.html", "General anaesthetic"],
    [["pain","analges","opioid"], "tools/pain-relief.html", "Pain relief after surgery"],
    [["day-of","on-the-day","checklist"], "day-of-surgery.html", "On the day of surgery"],
    [["fee","cost","gap","price","bill"], "fees.html", "Fees"],
    [["hospital"], "hospitals.html", "Hospitals"],
    [["contact","phone","enquir"], "contact.html", "Contact the rooms"],
    [["about","bio","halvey"], "about.html", "About Dr Halvey"],
    [["research","publication","paper"], "clinical-research.html", "Research and publications"],
    [["glossary","terms"], "glossary.html", "Glossary"],
    [["procedure","operation","surger"], "procedures.html", "Operations"],
    [["guidance","patient","information","prepar","before"], "pre-op-guidance.html", "Before surgery"]
  ];

  /* Every real page, so /Knee-Replacement/ or /fasting.htm finds fasting.html */
  var PAGES = {"index":1,"tools/pain-relief":1};
  (window.SEARCH_INDEX||[]).forEach(function(e){ if(e.p) PAGES[e.p.replace(/\.html$/,'')]=1; });

  /* Probes from bots (wp-admin, .env, .php scanners): never guess for these */
  var PROBE = /(^|\/)(wp-|wordpress|xmlrpc|cgi-bin|\.env|\.git|admin|phpmyadmin|vendor|config|backup|\.well-known)|\.(php|asp|aspx|jsp|cgi|sql|zip|bak)$/i;

  var raw = location.pathname;
  try { raw = decodeURIComponent(raw); } catch(e) {}
  var path = raw.toLowerCase().replace(/\/index\.html?$/,'').replace(/\/+$/,'').replace(/^\/+/,'').replace(/\.(html?|php|aspx?)$/,'');
  var last = path.split('/').pop();
  var hash = location.hash || '';

  function track(target, how, then){
    var done=false; function go(){ if(!done){ done=true; then&&then(); } }
    try{
      if(typeof gtag==='function'){
        gtag('event','page_not_found',{missing_path:location.pathname, redirect_to:target||'(none)', match:how, transport_type:'beacon', event_callback:go});
        setTimeout(go,400); return;
      }
    }catch(e){}
    go();
  }
  function goNow(target, how){
    var url='/'+target+(target.indexOf('#')<0?hash:'');
    track(target, how, function(){ location.replace(url); });
  }

  if(path && !PROBE.test(location.pathname)){
    /* 1. the same page written differently */
    if(PAGES[path]) return goNow(path+'.html','same page');
    if(PAGES[last]) return goNow(last+'.html','same page');
    /* 2. a known old address */
    if(ALIASES[path]) return goNow(ALIASES[path],'old address');
    if(ALIASES[last]) return goNow(ALIASES[last],'old address');
  }

  /* 3 and 4 need the page drawn */
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    var box=document.getElementById('nf-guess'), list=document.getElementById('nf-matches');
    if(!path || PROBE.test(location.pathname)){ track('', 'none'); return; }
    var words = path.replace(/[^a-z0-9]+/g,' ').trim();
    var toks = words.split(' ').filter(function(w){return w.length>1 && !/^\d+$/.test(w);});
    var joined = '-'+toks.join('-')+'-';

    var hit=null;
    for(var i=0;i<KEYWORDS.length && !hit;i++){
      var keys=KEYWORDS[i][0];
      for(var j=0;j<keys.length;j++){
        var k=keys[j];
        var ok = k.indexOf('-')>-1 ? joined.indexOf('-'+k+'-')>-1 || joined.indexOf('-'+k)>-1
                                   : toks.some(function(t){ return t.indexOf(k)===0; });
        if(ok){ hit=KEYWORDS[i]; break; }
      }
    }

    /* put the address words in the search box so one tap on Search asks the AI */
    var input=document.getElementById('siteq');
    var query = toks.filter(function(t){return !/^(anaesthesia|anesthesia|anaesthetic|for|and|the|of|dr|ed|page|html)$/.test(t);}).join(' ');
    if(input && query) input.value=query;

    /* matching pages from the site's own index, no AI call */
    var S=window.__drhSearch, IDX=(S&&S.IDX)||[];
    if(list && S && query){
      var seen={}, rows=[];
      S.search(query).forEach(function(i){ var e=IDX[i]; if(!e||seen[e.u]) return; seen[e.u]=1;
        var title=e.s&&e.u.indexOf('#')>-1 ? e.s.split(' \u203a ').pop()+': '+e.t : e.t;
        rows.push('<a class="lf-gl" href="/'+e.u+'"><b>'+esc(title)+'</b><span>'+esc(snip(e.d))+'</span></a>'); });
      if(rows.length){ list.innerHTML='<h2 class="lf-h2">Pages that may help</h2><div style="max-width:760px">'+rows.join('')+'</div>'; list.hidden=false; }
    }

    if(!hit || !box){ track('', 'none'); return; }
    var target=hit[1], name=hit[2], secs=3, stopped=false;
    box.innerHTML='<p><b>Taking you to '+esc(name)+'</b> <span id="nf-count">in '+secs+' seconds</span>.</p>'+
      '<p><a href="/'+target+'" style="color:inherit">Go now</a><span style="padding:0 12px">|</span><a href="#" id="nf-stop" style="color:inherit">Stay here and search instead</a></p>';
    box.hidden=false;
    var t=setInterval(function(){
      if(stopped) return;
      secs--; var c=document.getElementById('nf-count'); if(c) c.textContent='in '+secs+' second'+(secs===1?'':'s');
      if(secs<=0){ clearInterval(t); goNow(target,'keyword'); }
    },1000);
    document.getElementById('nf-stop').addEventListener('click',function(ev){
      ev.preventDefault(); stopped=true; clearInterval(t); box.hidden=true; track(target,'keyword, stopped');
      if(input){ input.focus(); }
    });
  });
  function snip(d){ d=(d||'').replace(/\u2026$/,''); if(d.length<=120) return d; d=d.slice(0,120); return d.slice(0,d.lastIndexOf(' '))+'\u2026'; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
})();
