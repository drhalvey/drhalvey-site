/* Site search for drhalvey.com.au (rebuilt 01/10/2026).
   1. Instant search over the site's own pages: titles, keywords and the first words of every section.
   2. Results open in a full panel under the search box, never clipped by the banner.
   3. Every word shown is quoted from the site. The AI only re-orders entries from this index, and only
      for questions (two or more words) or when the patient presses Search. If the AI is slow, capped or
      offline, the instant results stay as they are. */
(function(){
  var IDX=window.SEARCH_INDEX||[], QA=window.QA_BANK||[];

  /* ---------- instant search ---------- */
  var STOP={i:1,im:1,me:1,my:1,a:1,an:1,the:1,is:1,are:1,am:1,do:1,does:1,did:1,to:1,of:1,in:1,on:1,at:1,it:1,be:1,and:1,or:1,
    for:1,can:1,you:1,your:1,how:1,what:1,when:1,why:1,which:1,will:1,would:1,should:1,could:1,have:1,has:1,
    get:1,go:1,there:1,this:1,that:1,with:1,about:1,need:1,much:1,many:1,any:1,if:1,so:1,dr:1,doctor:1,please:1,
    surgery:1,operation:1,op:1,procedure:1,hospital:1};
  /* everyday words to the words the site uses */
  var SYN={
    ozempic:'glp-1 glp1 semaglutide',wegovy:'glp-1 glp1',mounjaro:'glp-1 glp1 tirzepatide',trulicity:'glp-1 glp1',saxenda:'glp-1 glp1',
    rybelsus:'glp-1 glp1 rybelsus',semaglutide:'glp-1',tirzepatide:'glp-1',weight:'glp-1',
    xarelto:'blood thinners rivaroxaban',eliquis:'blood thinners apixaban',pradaxa:'blood thinners dabigatran',warfarin:'blood thinners warfarin',
    clexane:'blood thinners',aspirin:'aspirin blood thinners',clopidogrel:'blood thinners plavix',plavix:'blood thinners',anticoagulant:'blood thinners',
    jardiance:'diabetes sglt2 empagliflozin',forxiga:'diabetes sglt2 dapagliflozin',metformin:'diabetes metformin',insulin:'diabetes insulin',
    diabetic:'diabetes',sugar:'diabetes',
    coversyl:'blood pressure perindopril',perindopril:'blood pressure',candesartan:'blood pressure',ramipril:'blood pressure',bp:'blood pressure',
    tablets:'medicines',pills:'medicines',meds:'medicines',medication:'medicines',medications:'medicines',
    eat:'fasting eating food',eating:'fasting food',food:'fasting food',breakfast:'fasting food',hungry:'fasting',starve:'fasting',
    drink:'fasting clear fluids',drinking:'fasting clear fluids',water:'clear fluids water',coffee:'clear fluids coffee',tea:'clear fluids tea',
    juice:'clear fluids',milk:'milk fasting',nil:'fasting',fast:'fasting',gum:'chewing gum',lollies:'lollies',
    sick:'nausea vomiting',vomit:'nausea vomiting',vomiting:'nausea',nauseous:'nausea',throat:'sore throat',
    snore:'sleep apnoea',snoring:'sleep apnoea',cpap:'sleep apnoea cpap',apnea:'apnoea',
    vape:'vaping smoking',vaping:'vaping smoking',smoke:'smoking',cigarettes:'smoking',nicotine:'smoking',
    csection:'caesarean',caesar:'caesarean',cesarean:'caesarean',section:'caesarean',
    baby:'labour epidural caesarean',labour:'labour epidural',labor:'labour epidural',birth:'labour caesarean',pregnant:'pregnancy',
    breastfeed:'breastfeeding',breastfeeding:'breastfeeding',feeding:'breastfeeding',
    cost:'fees',price:'fees',fee:'fees',pay:'fees',gap:'fees gap',bill:'fees',insurance:'fees health fund',fund:'fees health fund',
    awake:'sedation awake spinal',asleep:'general anaesthetic',sleep:'sleep',unconscious:'general anaesthetic',
    ga:'general anaesthetic',numb:'nerve block numb',block:'nerve block',catheter:'catheter',
    drive:'driving drive',driving:'drive',alcohol:'alcohol',arrive:'arrival time',arrival:'arrival time',time:'time',
    painkillers:'pain relief',pain:'pain relief',endone:'oxycodone',oxy:'oxycodone',celebrex:'celecoxib',
    knee:'knee',tkr:'knee replacement',hip:'hip',thr:'hip replacement',acl:'acl',scope:'arthroscopy',hernia:'hernia',bowel:'bowel',
    port:'infusaport',portacath:'infusaport',stitch:'cerclage',piles:'haemorrhoidectomy',hemorrhoids:'haemorrhoidectomy',
    consent:'consent',risks:'risks side effects',risk:'risks',side:'side effects',effects:'side effects',
    anesthetic:'anaesthetic',anesthesia:'anaesthesia',anaesthesia:'anaesthetic',spinal:'spinal',epidural:'epidural',
    halvey:'about qualifications',ed:'about',who:'about',work:'practises hospitals',practise:'practises hospitals',hospitals:'hospitals practises',where:'practises hospitals',
    bring:'bring checklist',wear:'wear',shower:'shower',fishoil:'fish oil',supplements:'supplements herbal',herbal:'supplements'
  };
  function lev(a,b){var m=a.length,n=b.length;if(!m)return n;if(!n)return m;var p=[],c,i,j;for(j=0;j<=n;j++)p[j]=j;
    for(i=1;i<=m;i++){c=[i];for(j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
  function words(s){return (s||'').toLowerCase().replace(/&amp;/g,' ').replace(/[^a-z0-9\- ]+/g,' ').split(/[\s]+/).filter(Boolean);}
  /* precompute word sets per field */
  var F=IDX.map(function(e){return {t:words(e.t+' '+(e.s||'').split(' › ').pop()), k:words(e.k), b:words((e.d||'')+' '+(e.b||''))};});
  var DF={}; F.forEach(function(f){var seen={};f.t.concat(f.k,f.b).forEach(function(w){if(!seen[w]){seen[w]=1;DF[w]=(DF[w]||0)+1;}});});
  var VOCAB=Object.keys(DF), N=IDX.length;
  function idf(w){var d=DF[w]||0;return Math.log(1+N/(1+d));}
  function inField(ws,tk){
    for(var i=0;i<ws.length;i++){var w=ws[i]; if(w===tk) return 1; if(tk.length>=4&&w.indexOf(tk)===0) return .85; if(tk.length>=5&&w.length>=5&&w.indexOf(tk.slice(0,-1))===0) return .8;}
    return 0;
  }
  function fixSpelling(tk){
    if(DF[tk]||SYN[tk]||tk.length<5) return tk;
    var best=null,bd=3;
    for(var i=0;i<VOCAB.length;i++){var w=VOCAB[i]; if(Math.abs(w.length-tk.length)>2||w[0]!==tk[0]) continue; var d=lev(tk,w); if(d<bd||(d===bd&&best&&DF[w]>DF[best])){bd=d;best=w;}}
    return (best&&bd<=(tk.length>=8?2:1))?best:tk;
  }
  function terms(q){
    var raw=words(q.replace(/c[\s-]section/ig,'csection').replace(/fish oil/ig,'fishoil')), out=[];
    raw.forEach(function(tk){
      if(STOP[tk]||tk.length<2) return;
      tk=fixSpelling(tk);
      var g={main:tk,alts:[]};
      if(SYN[tk]) g.alts=words(SYN[tk]).filter(function(a){return a!==tk;});
      out.push(g);
    });
    return out;
  }
  function search(q){
    var T=terms(q), ql=q.toLowerCase().trim();
    if(!T.length) return [];
    var res=[];
    for(var i=0;i<IDX.length;i++){
      var f=F[i], e=IDX[i], s=0, hit=0;
      for(var j=0;j<T.length;j++){
        var g=T[j], best=0, cands=[[g.main,1]].concat(g.alts.map(function(a){return [a,.75];}));
        for(var c=0;c<cands.length;c++){
          var w=cands[c][0], wt=cands[c][1], idw=idf(w)*wt;
          var v=Math.max(inField(f.t,w)*3, inField(f.k,w)*1.8, inField(f.b,w)*1)*idw;
          if(v>best) best=v;
        }
        if(best>0){hit++; s+=best;}
      }
      if(!hit) continue;
      s*=Math.pow(hit/T.length,1.6);          /* reward entries that cover the whole question */
      if((e.t||'').toLowerCase().indexOf(ql)>-1) s*=1.4;
      if(e.u.indexOf('#')<0) s*=1.08;            /* the page itself, slightly, for one-word searches */
      res.push({i:i,s:s});
    }
    /* quick-answer bank: its keywords only nudge its page up; its text is not shown */
    var qa=qaMatch(q); if(qa) res.forEach(function(r){ if(IDX[r.i].u===qa.u||IDX[r.i].u.split('#')[0]===qa.u.split('#')[0]) r.s*=1.25; });
    res.sort(function(a,b){return b.s-a.s;});
    /* no more than three from one page */
    var per={}, out=[];
    for(var k=0;k<res.length&&out.length<10;k++){var p=IDX[res[k].i].p; per[p]=(per[p]||0)+1; if(per[p]<=3) out.push(res[k].i);}
    return out;
  }
  function qaMatch(q){
    q=q.toLowerCase().replace(/[^a-z ]/g,' '); var toks=q.split(/\s+/).filter(function(w){return w.length>=3&&!STOP[w];}); if(!toks.length) return null;
    var best=null,bs=0;
    QA.forEach(function(e){var kw=' '+e.k+' ',h=0;toks.forEach(function(t){if(kw.indexOf(' '+t)>-1)h++;});if(h>bs&&(h>=2||toks.length===1)){bs=h;best=e;}});
    return best;
  }
  window.__drhSearch={search:search,terms:terms,IDX:IDX};   /* used by the test script only */

  var input=document.getElementById('siteq'); if(!input) return;
  var out=document.getElementById('searchres'); if(!out) return;

  /* ---------- AI re-ordering ---------- */
  var RELAY='https://bbwjroytqxynborrqylr.supabase.co/functions/v1/ai-relay';
  var TOKEN='ai_89af858d725a4f6b86a4624f487eb26b6a90fe7a0d0e410e815f7f490872396e';
  var SYS="You are the search engine for Dr Ed Halvey's patient information website (anaesthesia, Perth, Western Australia). "+
    "Patients type everyday questions, often misspelt, the night before surgery. Each catalogue line is: number | section title | page | the first words of that section. "+
    "Pick the entries whose text most directly answers what the patient is asking, best first, up to 6. "+
    "Work out what the patient means: Ozempic, Mounjaro, Wegovy and Trulicity are GLP-1 medicines; Xarelto, Eliquis, warfarin and Pradaxa are blood thinners; "+
    "Jardiance and Forxiga are SGLT2 diabetes medicines; 'put to sleep' or 'going under' is a general anaesthetic; 'nil by mouth' or 'can I eat' is fasting; "+
    "'c section' is caesarean; snoring is sleep apnoea; vaping is smoking. A specific section beats a whole page; a procedure page beats a general page only when the patient names the procedure. "+
    "Reply with ONLY a JSON array of entry numbers, for example [12,40,7]. Reply [] if nothing fits. Never answer the question.";
  var CAT=IDX.map(function(e,i){return i+'|'+e.t+'|'+(e.s||'page')+'|'+(e.d||'').slice(0,110);}).join('\n');
  var aiCache={}, aiSeq=0, aiTimer=null, memId=null;
  function installId(){
    try{var k='ai.iid',v=localStorage.getItem(k);if(!v){v=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():('x'+Math.random().toString(36).slice(2)+Date.now());localStorage.setItem(k,v);}return v;}
    catch(e){ if(!memId) memId='m'+Math.random().toString(36).slice(2)+Date.now(); return memId; }
  }
  function isQuestion(q){ return q.length>=8 && terms(q).length>=2; }
  function aiPick(q){
    var key=q.toLowerCase().replace(/\s+/g,' ').trim();
    if(aiCache.hasOwnProperty(key)) return Promise.resolve(aiCache[key]);
    if(!window.fetch) return Promise.resolve(null);
    var ctl=window.AbortController?new AbortController():null; if(ctl) setTimeout(function(){ctl.abort();},10000);
    return fetch(RELAY,{method:'POST',signal:ctl?ctl.signal:undefined,
      headers:{'content-type':'application/json','x-app-token':TOKEN,'x-install-id':installId()},
      body:JSON.stringify({max_tokens:160,temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:'Catalogue:\n'+CAT+'\n\nPatient search: '+q}]})})
    .then(function(r){return r.ok?r.json():null;})
    .then(function(d){
      if(!d) return null;
      var t=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'';
      var m=t.match(/\[[\d,\s]*\]/); if(!m) return null;
      var seen={}, ids=JSON.parse(m[0]).filter(function(i){ if(!IDX[i]||seen[i]) return false; seen[i]=1; return true; }).slice(0,6);
      aiCache[key]=ids; return ids;
    }).catch(function(){return null;});
  }

  /* ---------- panel ---------- */
  var box=input.closest?input.closest('.lf-sbox')||input.parentNode:input.parentNode;
  (function note(){
    var wrap=box.parentNode; if(!wrap||wrap.querySelector('.sr-note')) return;
    var n=document.createElement('p'); n.className='sr-note';
    n.textContent="Questions are sent to Google's AI to find the best page. Please don't type names, dates of birth or other personal details.";
    wrap.insertBefore(n, box.nextSibling);
  })();
  out.classList.add('sr-panel'); out.setAttribute('role','listbox');
  document.body.appendChild(out);            /* lives outside the banner so nothing clips it */
  input.setAttribute('aria-controls','searchres'); input.setAttribute('aria-autocomplete','list');

  function place(){
    var r=box.getBoundingClientRect(), vw=document.documentElement.clientWidth, vh=window.innerHeight;
    var phone=vw<700, left=phone?12:r.left, width=phone?vw-24:Math.min(Math.max(r.width,640),vw-left-24);
    out.style.left=(left+window.pageXOffset)+'px'; out.style.top=(r.bottom+window.pageYOffset+8)+'px'; out.style.width=width+'px';
    out.style.maxHeight=Math.max(300,vh-r.bottom-24)+'px';
  }
  function ensureRoom(){
    var r=box.getBoundingClientRect(), vh=window.innerHeight;
    if(vh-r.bottom<Math.min(460,vh*0.6)){ window.scrollBy({top:r.top-80,behavior:'smooth'}); setTimeout(place,350); }
  }
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function mark(text,q){
    var h=esc(text), T=terms(q), ws=[];
    T.forEach(function(g){ws.push(g.main);});
    ws=ws.filter(function(w){return w.length>=3;}).map(function(w){return w.replace(/[^a-z0-9]/g,'');}).filter(Boolean);
    if(!ws.length) return h;
    return h.replace(new RegExp('\\b('+ws.join('|')+')[a-z]*','gi'),'<mark>$&</mark>');
  }
  function crumb(e){ var p=(e.s||'').split(' › '); return e.s ? esc(p.join(' › ')) : 'Full guide'; }
  function row(i,q,n){
    var e=IDX[i];
    return '<a class="sr-row" role="option" id="sr-o'+n+'" href="'+esc(e.u)+'">'+
      '<span class="sr-crumb">'+crumb(e)+'</span>'+
      '<span class="sr-title">'+mark(e.t,q)+'</span>'+
      (e.d?'<span class="sr-snip">'+mark(e.d,q)+'</span>':'')+'</a>';
  }
  var cur=-1, lastQ='', lastIds=[], viaAI=false;
  function paint(q,ids,state){
    lastIds=ids; cur=-1;
    var head;
    if(!ids.length && state!=='wait') head='<div class="sr-head"><span>No pages found for &ldquo;'+esc(q)+'&rdquo;</span></div>'+
      '<div class="sr-empty">Try a different word, for example the name of your operation or medicine. Or <a href="procedures.html">browse every guide</a>, or <a href="contact.html">contact the rooms</a>.</div>';
    else head='<div class="sr-head"><span>'+(ids.length?ids.length+' '+(ids.length===1?'page':'pages')+' for &ldquo;'+esc(q)+'&rdquo;':'Searching&hellip;')+'</span>'+
      (state==='wait'?'<span class="sr-ai sr-busy">Asking AI for the best match&hellip;</span>':state==='ai'?'<span class="sr-ai">Best match first, picked with AI help</span>':
       (isQuestion(q)?'':'<span class="sr-hint">Press Enter for AI help</span>'))+'</div>';
    out.innerHTML=head+(ids.length?'<div class="sr-list">'+ids.map(function(i,n){return row(i,q,n);}).join('')+'</div>':'')+
      '<div class="sr-foot">General information only, not personal medical advice. Follow the times your hospital gives you.</div>';
    out.style.display='block'; input.setAttribute('aria-expanded','true'); place();
  }
  function close(){ out.style.display='none'; input.setAttribute('aria-expanded','false'); cur=-1; }
  function runAI(q,base){
    var seq=++aiSeq;
    var cached=aiCache[q.toLowerCase().replace(/\s+/g,' ').trim()];
    if(cached===undefined) paint(q,base,'wait');
    aiPick(q).then(function(ids){
      if(seq!==aiSeq||input.value.trim()!==q) return;
      if(!ids||!ids.length){ paint(q,base,''); return; }
      /* blend the two orders, so a page both agree on rises and an odd AI pick cannot jump the queue alone */
      var pts={};
      base.forEach(function(i,r){ pts[i]=(pts[i]||0)+(10-r); });
      ids.forEach(function(i,r){ pts[i]=(pts[i]||0)+(r===0?12:9-r*1.5); });
      var merged=Object.keys(pts).map(Number).sort(function(a,b){return pts[b]-pts[a];}).slice(0,10);
      viaAI=true; paint(q,merged,'ai');
    });
  }
  function update(force){
    var q=input.value.trim();
    clearTimeout(aiTimer); aiSeq++;
    if(q.length<2){ close(); lastQ=''; return; }
    var base=search(q); lastQ=q; viaAI=false;
    paint(q,base,'');
    if(force) runAI(q,base);
    else if(isQuestion(q)) aiTimer=setTimeout(function(){ if(input.value.trim()===q) runAI(q,base); },900);
  }
  function move(d){
    var rows=out.querySelectorAll('.sr-row'); if(!rows.length) return;
    if(cur>=0&&rows[cur]) rows[cur].classList.remove('on');
    cur=(cur+d+rows.length)%rows.length; rows[cur].classList.add('on'); rows[cur].scrollIntoView({block:'nearest'});
    input.setAttribute('aria-activedescendant',rows[cur].id);
  }
  input.addEventListener('input',function(){ update(false); });
  input.addEventListener('focus',function(){ ensureRoom(); if(input.value.trim().length>=2) update(false); });
  input.addEventListener('keydown',function(ev){
    if(ev.key==='ArrowDown'){ev.preventDefault();move(1);}
    else if(ev.key==='ArrowUp'){ev.preventDefault();move(-1);}
    else if(ev.key==='Escape'){close();}
    else if(ev.key==='Enter'){
      ev.preventDefault();
      var rows=out.querySelectorAll('.sr-row');
      if(cur>=0&&rows[cur]){ window.location.href=rows[cur].getAttribute('href'); return; }
      if(out.style.display==='block'&&viaAI&&rows[0]){ window.location.href=rows[0].getAttribute('href'); return; }
      ensureRoom(); update(true);
    }
  });
  var btn=box.querySelector('button');
  if(btn){ btn.removeAttribute('onclick'); btn.onclick=null; btn.addEventListener('click',function(ev){ev.preventDefault();input.focus();ensureRoom();update(true);}); }
  window.addEventListener('resize',function(){ if(out.style.display==='block') place(); });
  window.addEventListener('scroll',function(){ if(out.style.display==='block') place(); },{passive:true});
  document.addEventListener('click',function(ev){ if(ev.target!==input && !out.contains(ev.target) && !(btn&&btn.contains(ev.target))) close(); });
})();
