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
    surgery:1,operation:1,op:1,procedure:1,hospital:1,having:1,had:1,tomorrow:1,today:1,tonight:1,morning:1,afternoon:1,evening:1,night:1,
    am:1,pm:1,oclock:1,monday:1,tuesday:1,wednesday:1,thursday:1,friday:1,saturday:1,sunday:1,mon:1,tue:1,wed:1,thu:1,fri:1,sat:1,sun:1,
    jan:1,feb:1,mar:1,apr:1,jun:1,jul:1,aug:1,sep:1,sept:1,oct:1,nov:1,dec:1,january:1,february:1,march:1,april:1,june:1,july:1,august:1,
    september:1,october:1,november:1,december:1,booked:1,going:1,told:1,been:1,asked:1,was:1,were:1,just:1,still:1,ok:1,okay:1,allowed:1,
    supposed:1,next:1,happens:1,happen:1,happening:1,feel:1,feels:1,feeling:1,like:1,mean:1,means:1,know:1,want:1,worried:1,worry:1,normal:1,expect:1,week:1,day:1,at:1,by:1,from:1,up:1,until:1,till:1,im:1,ive:1,dont:1,not:1,but:1,also:1,then:1,than:1};
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
    drive:'driving drive',driving:'drive',alcohol:'alcohol',arrive:'arrival time',arrival:'arrival time',
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
    var raw=words(q.replace(/\b(get|be|arrive|come) (to|at|in(to)?) (the )?hospital\b/ig,'arrival').replace(/c[\s-]section/ig,'csection').replace(/fish oil/ig,'fishoil')), out=[];
    raw.forEach(function(tk){
      if(STOP[tk]||tk.length<2||/^\d+(am|pm|st|nd|rd|th)?$/.test(tk)) return;
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
    /* no more than three from one page, at most six in all, and nothing far weaker than the best match (07/10/2026) */
    var per={}, out=[], floor=res.length?res[0].s*0.3:0;
    for(var k=0;k<res.length&&out.length<6;k++){ if(res[k].s<floor) break; var p=IDX[res[k].i].p; per[p]=(per[p]||0)+1; if(per[p]<=3) out.push(res[k].i);}
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


  /* ---------- direct answers (01/10/2026) ----------
     The answer card is built from two things only: the site's own tools (fasting times, medicine
     planner, GLP-1 table) filled in from the question, and sentences quoted word for word from the
     pages, chosen by the AI. The AI never writes text that reaches the patient. */
  var DAYN=['sun','mon','tue','wed','thu','fri','sat'], MON=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  function p2(n){return (n<10?'0':'')+n;}
  function isoD(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());}
  function niceD(d){return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()]+' '+d.getDate()+' '+['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];}
  function niceT(t){var h=+t.split(':')[0],m=t.split(':')[1];return (h%12||12)+':'+m+(h<12?' am':' pm');}
  function parseWhen(q){
    var s=' '+q.toLowerCase().replace(/[,?!]/g,' ')+' ', now=new Date(); now.setHours(0,0,0,0);
    var d=null, m;
    if(/\bday after tomorrow\b/.test(s)) d=new Date(now.getTime()+2*864e5);
    else if(/\b(tomorrow|tmrw|tmw|tomoz|tomorow|tommorow|tommorrow)\b/.test(s)) d=new Date(now.getTime()+864e5);
    else if(/\b(today|tonight|this morning|this afternoon)\b/.test(s)) d=new Date(now);
    if(!d && (m=s.match(/\b(\d{1,2})(?:st|nd|rd|th)?(?: of)? (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/))) d=new Date(now.getFullYear(),MON.indexOf(m[2]),+m[1]);
    if(!d && (m=s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{1,2})(?:st|nd|rd|th)?\b/))) d=new Date(now.getFullYear(),MON.indexOf(m[1]),+m[2]);
    if(!d && (m=s.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/))) d=new Date(m[3]?(+m[3]<100?2000+ +m[3]:+m[3]):now.getFullYear(),+m[2]-1,+m[1]);
    if(!d && (m=s.match(/\b(sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)(?:day|nesday|rsday|urday)?\b/))){ var w=DAYN.indexOf(m[1].slice(0,3)); var add=(w-now.getDay()+7)%7; d=new Date(now.getTime()+add*864e5); }
    if(d && !isNaN(d) && d<now && (now-d)>30*864e5) d.setFullYear(d.getFullYear()+1);
    if(d && (isNaN(d)||d<now)) d=null;
    var t=null;
    if((m=s.match(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/))){ var h=+m[1]%12+(/^p/.test(m[3])?12:0); t=p2(h)+':'+(m[2]||'00'); }
    else if((m=s.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/))) t=p2(+m[1])+':'+m[2];
    else if(/\b(noon|midday|12 noon)\b/.test(s)) t='12:00';
    else if((m=s.match(/\bat (\d{1,2})\b(?! (?:days?|weeks?|hours?))/))){ var hh=+m[1]; if(hh>=1&&hh<=12){ hh=hh<7?hh+12:hh; t=p2(hh)+':00'; } }
    var arrive=/\b(arriv\w*|admission|admitted|admit|check(?:ing)? in|get to (?:the )?hospital|be at (?:the )?hospital|come in|told to come|booked in for)\b/.test(s);
    return {date:d?isoD(d):null, dateObj:d, time:t, arrival:!!(t&&arrive)};
  }
  function roundTime(t){ var a=t.split(':'), mins=+a[0]*60+ +a[1]; mins=Math.round(mins/15)*15; if(mins<300||mins>20*60+45) return null; return p2(Math.floor(mins/60))+':'+p2(mins%60); }
  var RX_FAST=/\b(eat|eating|ate|food|fast|fasting|starv\w*|hungry|thirsty|drink|drinking|water|coffee|tea|milk|juice|breakfast|lunch|dinner|supper|meal|snack|nil by mouth|nbm|chew|gum|lolly|lollies|lollie)\b/;
  var RX_GLP=/\b(ozempic|wegovy|mounjaro|trulicity|saxenda|rybelsus|semaglutide|tirzepatide|dulaglutide|liraglutide|glp ?-?1|weight loss injection)\b/;
  var RX_MEDS=/\b(tablets?|medicines?|medications?|pills?|meds|injections?|inhalers?|puffers?)\b/;
  var medWords=null;
  function prepMeds(){ if(medWords||!window.DRH_TOOLS) return; medWords={}; window.DRH_TOOLS.findMeds(function(md){ (md.meds||[]).forEach(function(x){ [x[0]].concat(x[1]).forEach(function(n){ n=String(n).toLowerCase(); if(n.length>=4) medWords[n]=1; }); }); }); }
  function findMedWord(q){
    if(!medWords) return null; var ws=q.toLowerCase().replace(/[^a-z0-9 -]/g,' ').split(/\s+/);
    for(var i=0;i<ws.length;i++){ if(ws[i].length>=4&&medWords[ws[i]]) return ws[i]; }
    for(i=0;i<ws.length-1;i++){ var two=ws[i]+' '+ws[i+1]; if(medWords[two]) return two; }
    return null;
  }
  function intents(q){
    var s=q.toLowerCase(), out={};
    if(RX_GLP.test(s)) out.glp1=1;
    var mw=findMedWord(q); if(mw&&!out.glp1) out.meds=mw; else if(!out.glp1&&RX_MEDS.test(s)&&!RX_FAST.test(s)) out.meds='';
    if((RX_FAST.test(s)||itemWords(q).length)&&!out.glp1) out.fasting=1;
    return out;
  }

  /* section text from the pages, split into sentences, for the AI to quote from */
  var pageCache={};
  function getPage(p){
    if(!pageCache[p]) pageCache[p]=fetch(p).then(function(r){return r.ok?r.text():'';}).then(function(h){ return new DOMParser().parseFromString(h,'text/html'); }).catch(function(){return null;});
    return pageCache[p];
  }
  function splitSent(t){
    t=t.replace(/\s+/g,' ').trim(); if(!t) return [];
    var parts=t.match(/[^.!?]+(?:[.!?]+["'’”)]*|$)/g)||[t], out=[], buf='';
    parts.forEach(function(x){ buf+=x; if(buf.trim().length>=20){ out.push(buf.trim()); buf=''; } });
    if(buf.trim()) out.push(buf.trim());
    return out;
  }
  function sectionSentences(doc,e){
    var main=doc.querySelector('.lf-main')||doc.querySelector('main')||doc.body; if(!main) return [];
    var id=e.u.split('#')[1], start=id?doc.getElementById(id):null, lvl=start?+start.tagName.charAt(1):2, h2seen=0;
    var lead=!id&&doc.querySelector('.lf-lead'), out=[];
    if(lead) splitSent(lead.textContent).forEach(function(x){out.push(x);});
    var tw=doc.createTreeWalker(main,NodeFilter.SHOW_ELEMENT,null,false), n, on=!start;
    while((n=tw.nextNode())){
      if(n===start){on=true;continue;}
      if(!on) continue;
      var tg=n.tagName;
      if(/^H[1-6]$/.test(tg)){ var l=+tg.charAt(1); if(start&&l<=lvl) break; if(!start&&tg==='H2'&&++h2seen>1) break; continue; }
      if(n.closest('script,style,noscript,form,.lf-prep,.lf-fasting,.lf-medsmini,nav,.lf-aside,.lf-video')) continue;
      var txt='';
      if(tg==='TR'){ txt=Array.prototype.map.call(n.children,function(c){return c.textContent.replace(/\s+/g,' ').trim();}).filter(Boolean).join(': '); if(txt&&!/[.!?]$/.test(txt)) txt+='.'; }
      else if(/^(P|LI|DD|DT|BLOCKQUOTE)$/.test(tg) && !n.querySelector('p,li,tr') && !n.closest('tr')) txt=n.textContent;
      if(txt&&tg==='TR'){ txt=txt.replace(/\s+/g,' ').trim(); if(txt.length>12) out.push(txt.length>450?txt.slice(0,txt.lastIndexOf(' ',440))+'…':txt); }   /* a table row stays whole, so a rule never loses the medicine it belongs to */
      else if(txt) splitSent(txt).forEach(function(x){ if(x.length>12) out.push(x); });
      if(out.length>=14) break;
    }
    return out;
  }
  var QSYS="You find answers on Dr Ed Halvey's patient information website (anaesthesia, Perth, Western Australia). "+
    "You are given numbered sentences copied from the website, then a patient's question. Choose up to 3 sentence numbers that, read together, most directly answer the question, best first. "+
    "Prefer sentences that state the actual rule, time or instruction over introductions or general statements. Do not choose sentences about a different medicine, operation or situation from the one asked about (for example caesarean or labour sentences for a general question). If the question is general, prefer sentences from general pages. "+
    "Reply with ONLY a JSON array of numbers, for example [4,9]. Reply [] if no sentence answers the question. Never write anything else.";
  var quoteCache={};
  function aiQuote(q,cands){
    var key=q.toLowerCase().replace(/\s+/g,' ').trim();
    if(quoteCache.hasOwnProperty(key)) return Promise.resolve(quoteCache[key]);
    var pages={}; cands.forEach(function(i){pages[IDX[i].p]=1;});
    return Promise.all(Object.keys(pages).map(function(p){return getPage(p).then(function(d){return [p,d];});})).then(function(docs){
      var dm={}; docs.forEach(function(x){dm[x[0]]=x[1];});
      var list=[], seen={}, len=0;
      cands.forEach(function(i){
        var d=dm[IDX[i].p]; if(!d) return;
        var ss=sectionSentences(d,IDX[i]);
        ss.forEach(function(t,k){ if(seen[t]||len>9000) return; seen[t]=1;
          /* a sentence that leans on the one before it ("They can usually be treated.") carries that one with it */
          if(k>0&&/^(they|this|these|it|that|those|both|either|its)\b/i.test(t)) t=ss[k-1]+' '+t;
          len+=t.length; list.push({t:t,i:i}); });
      });
      if(!list.length) return [];
      var body=list.map(function(x,n){return n+'| ['+IDX[x.i].t+'] '+x.t;}).join('\n');
      var ctl=window.AbortController?new AbortController():null; if(ctl) setTimeout(function(){ctl.abort();},10000);
      return fetch(RELAY,{method:'POST',signal:ctl?ctl.signal:undefined,
        headers:{'content-type':'application/json','x-app-token':TOKEN,'x-install-id':installId()},
        body:JSON.stringify({max_tokens:80,temperature:0,messages:[{role:'system',content:QSYS},{role:'user',content:'Sentences:\n'+body+'\n\nPatient question: '+q}]})})
      .then(function(r){return r.ok?r.json():null;})
      .then(function(d){
        if(!d) return null;
        var t=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'', m=t.match(/\[[\d,\s]*\]/); if(!m) return null;
        var got=[], s2={}; JSON.parse(m[0]).forEach(function(n){ if(list[n]&&!s2[n]&&got.length<3){s2[n]=1;got.push(list[n]);} });
        quoteCache[key]=got; return got;
      });
    }).catch(function(){return null;});
  }

  /* ---------- food and drink answers without AI (07/10/2026) ----------
     "Can I have fruit / coffee / gum before surgery?" is answered by quoting the sentences on
     fasting.html that name that item. No AI call, so it is instant and always the page's own words.
     If the page does not name the item, the AI quote search runs as before. */
  var ITEM_SYN={fruits:'fruit',banana:'fruit',bananas:'fruit',apple:'fruit',apples:'fruit',orange:'fruit',oranges:'fruit',grapes:'fruit',
    berries:'fruit',strawberries:'fruit',mango:'fruit',pear:'fruit',pears:'fruit',kiwi:'fruit',watermelon:'fruit',melon:'fruit',
    toast:'food',cereal:'food',biscuit:'food',biscuits:'food',sandwich:'food',meal:'food',snack:'food',breakfast:'food',lunch:'food',dinner:'food',supper:'food',
    yogurt:'yoghurt',lolly:'lollies',lollie:'lollies',candy:'lollies',sweets:'lollies',chocolate:'lollies',mint:'mints',chewing:'gum',
    coke:'carbonated soft drinks',lemonade:'lemonade carbonated',sprite:'lemonade carbonated',fizzy:'carbonated soft drinks',soda:'carbonated soft drinks',
    latte:'milk',cappuccino:'milk',flatwhite:'milk',smoothie:'smoothies',beer:'alcohol',wine:'alcohol',
    applejuice:'apple juice',orangejuice:'juice pulp',oj:'juice pulp'};
  var ITEM_WORDS={fruit:1,food:1,milk:1,water:1,coffee:1,tea:1,juice:1,cordial:1,lemonade:1,gum:1,lollies:1,alcohol:1,yoghurt:1,mints:1,smoothies:1,soup:1,jelly:1,honey:1,sugar:1,pulp:1};
  var FOOD_SECTIONS=['what-counts-as-food','a-general-guide-for-adults','what-counts-as-a-clear-fluid','other-things-to-avoid'];
  function itemWords(q){
    var s=q.toLowerCase().replace(/apple juice/g,'applejuice').replace(/orange juice/g,'orangejuice').replace(/flat white/g,'flatwhite').replace(/chewing gum/g,'gum').replace(/soft drinks?/g,'carbonated');
    var out=[];
    s.replace(/[^a-z ]/g,' ').split(/\s+/).forEach(function(w){
      if(ITEM_SYN[w]) ITEM_SYN[w].split(' ').forEach(function(x){ if(out.indexOf(x)<0) out.push(x); });
      else if(ITEM_WORDS[w]&&out.indexOf(w)<0) out.push(w);
    });
    return out;
  }
  function fastingIdx(id){
    var best=-1; for(var i=0;i<IDX.length;i++){ if(IDX[i].u==='fasting.html#'+id) return i; if(best<0&&IDX[i].p==='fasting.html') best=i; } return best;
  }
  function itemAnswer(q){
    var items=itemWords(q); if(!items.length||!window.fetch) return Promise.resolve(null);
    return getPage('fasting.html').then(function(doc){
      if(!doc) return null;
      var pool=[];
      FOOD_SECTIONS.forEach(function(id){
        var h=doc.getElementById(id); if(!h) return;
        for(var n=h.nextElementSibling;n&&!/^H[12]$/.test(n.tagName);n=n.nextElementSibling){
          var parts=[];
          if(n.classList.contains('timecard')){ var t=n.querySelector('.t'),d=n.querySelector('.d'); if(t&&d) parts=[t.textContent.trim()+': '+d.textContent.replace(/\s+/g,' ').trim()]; }
          else if(n.tagName==='P') parts=splitSent(n.textContent);
          else if(n.tagName==='UL'||n.tagName==='OL') parts=Array.prototype.map.call(n.querySelectorAll('li'),function(li){return li.textContent.replace(/\s+/g,' ').trim();});
          parts.forEach(function(t){ pool.push({t:t,id:id}); });
        }
      });
      var scored=pool.map(function(x,k){
        var low=' '+x.t.toLowerCase().replace(/[^a-z ]/g,' ')+' ', s=0;
        items.forEach(function(w){ if(low.indexOf(' '+w+' ')>-1||low.indexOf(' '+w+'s ')>-1) s+=(w==='food'||w==='water'?1:2); });
        return {s:s,k:k,x:x};
      }).filter(function(o){return o.s>0;});
      if(!scored.length) return null;
      scored.sort(function(a,b){return b.s-a.s||a.k-b.k;});
      return scored.slice(0,2).sort(function(a,b){return a.k-b.k;}).map(function(o){ return {t:o.x.t,i:fastingIdx(o.x.id)}; }).filter(function(o){return o.i>=0;});
    }).catch(function(){return null;});
  }

  /* ---------- panel ---------- */
  var box=input.closest?input.closest('.lf-sbox')||input.parentNode:input.parentNode;
  (function note(){
    var wrap=box.parentNode; if(!wrap||wrap.querySelector('.sr-note')) return;
    var n=document.createElement('p'); n.className='sr-note';
    n.textContent="Questions are sent to Google's AI to find the answer in these guides. Please don't type names, dates of birth or other personal details.";
    wrap.insertBefore(n, box.nextSibling);
  })();
  out.classList.add('sr-panel'); out.setAttribute('role','region'); out.setAttribute('aria-label','Search results');
  out.innerHTML='<div class="sr-answer" hidden></div><div class="sr-head"></div><div class="sr-list" role="listbox"></div>'+
    '<div class="sr-foot">General information only, not personal medical advice. Follow the times your hospital gives you.</div>';
  document.body.appendChild(out);            /* lives outside the banner so nothing clips it */
  var elHead=out.querySelector('.sr-head'), elAns=out.querySelector('.sr-answer'), elList=out.querySelector('.sr-list');
  input.setAttribute('aria-controls','searchres');

  function place(){
    var r=box.getBoundingClientRect(), vw=document.documentElement.clientWidth, vh=window.innerHeight;
    var phone=vw<700, left=phone?12:r.left, width=phone?vw-24:Math.min(Math.max(r.width,680),vw-left-24);
    out.style.left=(left+window.pageXOffset)+'px'; out.style.top=(r.bottom+window.pageYOffset+8)+'px'; out.style.width=width+'px';
    out.style.maxHeight=Math.max(320,vh-r.bottom-24)+'px';
  }
  function ensureRoom(){
    var r=box.getBoundingClientRect(), vh=window.innerHeight;
    if(vh-r.bottom<Math.min(520,vh*0.65)){ window.scrollBy({top:r.top-80,behavior:'smooth'}); setTimeout(place,350); }
  }
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function mark(text,q){
    var h=esc(text), T=terms(q), ws=[];
    T.forEach(function(g){ws.push(g.main);});
    ws=ws.filter(function(w){return w.length>=3;}).map(function(w){return w.replace(/[^a-z0-9]/g,'');}).filter(Boolean);
    if(!ws.length) return h;
    return h.replace(new RegExp('\\b('+ws.join('|')+')[a-z]*','gi'),'<mark>$&</mark>');
  }
  function crumb(e){ return e.s ? esc(e.s) : 'Full guide'; }
  function row(i,q,n){
    var e=IDX[i];
    return '<a class="sr-row" role="option" id="sr-o'+n+'" href="'+esc(e.u)+'">'+
      '<span class="sr-crumb">'+crumb(e)+'</span>'+
      '<span class="sr-title">'+mark(e.t,q)+'</span>'+
      (e.d?'<span class="sr-snip">'+mark(e.d,q)+'</span>':'')+'</a>';
  }
  var cur=-1, lastIds=[], ansKey='';
  function show(){ out.style.display='block'; input.setAttribute('aria-expanded','true'); place(); }
  function paintList(q,ids,state){
    lastIds=ids; cur=-1;
    if(!ids.length && state!=='wait'){
      elHead.innerHTML='<span>No pages found for &ldquo;'+esc(q)+'&rdquo;</span>';
      elList.innerHTML='<div class="sr-empty">Try a different word, for example the name of your operation or medicine. Or <a href="procedures.html">browse every guide</a>, or <a href="contact.html">contact the rooms</a>.</div>';
    } else {
      elHead.innerHTML='<span>'+(ids.length?(elAns.hidden?'':'More from the guides: ')+ids.length+' '+(ids.length===1?'page':'pages')+' for &ldquo;'+esc(q)+'&rdquo;':'Searching&hellip;')+'</span>'+
        (state==='ai'?'<span class="sr-ai">Best match first, picked with AI help</span>':(isQuestion(q)||!elAns.hidden?'':'<span class="sr-hint">Press Enter to ask it as a question</span>'));
      elList.innerHTML=ids.map(function(i,n){return row(i,q,n);}).join('');
    }
    show();
  }
  function clearAnswer(){ elAns.hidden=true; elAns.innerHTML=''; ansKey=''; }
  function buildAnswer(q,base){
    prepMeds();
    var it=intents(q), w=parseWhen(q), key=JSON.stringify([it,w.date,w.time,w.arrival]);
    var tools=[];
    if(it.glp1) tools.push('glp1'); if(it.meds!==undefined) tools.push('meds'); if(it.fasting) tools.push('fasting');
    var wantQuotes=(isQuestion(q)&&base.length>0)||(!!it.fasting&&itemWords(q).length>0);
    if(!tools.length&&!wantQuotes){ clearAnswer(); return null; }
    var qsHtml='<div class="sr-qs" aria-live="polite">'+(wantQuotes?'<p class="sr-wait"><span class="sr-busy"></span>Finding the answer in the guides&hellip;</p>':'')+'</div>';
    /* the patient's own date or time makes the tool the answer: show it first and open.
       Otherwise the quoted answer comes first and the tool waits, folded, underneath (07/10/2026). */
    var timed=!!(w.date||w.time);
    var h='<div class="sr-ans-in">'+(timed?'':qsHtml);
    tools.forEach(function(t){
      if(t==='fasting'){
        var op=w.time&&!w.arrival;
        var inner=(op?'<blockquote class="sr-q sr-q-key">Use the arrival time on your hospital letter, not the time of the operation.<cite><a href="fasting.html#work-out-my-fasting-times">Fasting before your surgery</a></cite></blockquote>'+
              '<p class="sr-say">You gave '+niceT(w.time)+' as the time of your operation. Choose the time you have been asked to arrive at hospital.</p>':'')+
          '<div data-sr-tool="fasting"></div>';
        h+=timed?'<div class="sr-tool'+(op?' sr-op':'')+'"><h3 class="sr-th">Your fasting times</h3>'+inner+'</div>'
          :'<details class="sr-tool sr-fold"><summary class="sr-th">Work out your own fasting times</summary>'+inner+'</details>';
      } else if(t==='meds'){
        h+='<div class="sr-tool"><h3 class="sr-th">Your medicines</h3><div data-sr-tool="meds"></div></div>';
      } else if(t==='glp1'){
        h+='<div class="sr-tool"><h3 class="sr-th">GLP-1 medicines and fasting</h3><div data-sr-tool="glp1"></div></div>';
      }
    });
    h+=(timed?qsHtml:'')+'</div>';
    if(key===ansKey&&!elAns.hidden){ return wantQuotes; }   /* same question shape: keep what the patient has already chosen */
    ansKey=key; elAns.innerHTML=h; elAns.hidden=false;
    var T=window.DRH_TOOLS;
    if(T){
      var f=elAns.querySelector('[data-sr-tool="fasting"]'); if(f) T.fasting(f,{date:w.date, time:(w.time&&w.arrival)?roundTime(w.time):null});
      var m=elAns.querySelector('[data-sr-tool="meds"]'); if(m) T.meds(m,{q:it.meds||'',date:w.date});
      var g=elAns.querySelector('[data-sr-tool="glp1"]'); if(g) T.glp1(g);
    } else {
      Array.prototype.forEach.call(elAns.querySelectorAll('[data-sr-tool]'),function(x){ x.innerHTML='<p><a href="fasting.html">Open the fasting guide</a></p>'; });
    }
    if(w.date&&tools.length) elAns.querySelector('.sr-th').insertAdjacentHTML('afterend','<p class="sr-date">For '+niceD(w.dateObj)+', from your question. You can change it below.</p>');
    return wantQuotes;
  }
  function paintQuotes(q,got){
    var qs=elAns.querySelector('.sr-qs'); if(!qs) return;
    if(!got||!got.length){
      /* got is null when the AI was slow or offline, [] when the guides do not answer it. Say which, never leave a spinner (07/10/2026). */
      var msg=got?'The guides do not answer this directly. The pages below are the closest. If you are unsure, <a href="contact.html">contact the rooms</a>.'
                 :'The answer could not be found just now. The pages below are the closest matches. If you are unsure, <a href="contact.html">contact the rooms</a>.';
      if(!elAns.querySelector('.sr-tool')){ clearAnswer(); paintList(q,lastIds,''); elHead.innerHTML='<span>'+msg+'</span>'; }
      else qs.innerHTML='<p class="sr-wait">'+msg+'</p>';
      return;
    }
    var bySrc=[], idx={};
    got.forEach(function(x){ if(idx[x.i]===undefined){idx[x.i]=bySrc.length;bySrc.push({i:x.i,t:[]});} bySrc[idx[x.i]].t.push(x.t); });
    qs.innerHTML='<p class="sr-lab">From the guides</p>'+bySrc.map(function(b){
      var e=IDX[b.i];
      return '<blockquote class="sr-q">'+b.t.map(function(x){return '<p>'+esc(x)+'</p>';}).join('')+'<cite><a href="'+esc(e.u)+'">'+esc(e.s?e.s.split(' › ')[0]+' › '+e.t:e.t)+'</a></cite></blockquote>';
    }).join('');
    place();
  }
  function runAnswer(q,base){
    var seq=++aiSeq;
    var wantQ=buildAnswer(q,base);
    paintList(q,base,'');
    if(!base.length){                     /* nothing found by the instant search: let the AI look through the whole catalogue */
      paintList(q,[], 'wait'); elHead.innerHTML='<span class="sr-ai sr-busy">Looking through every guide&hellip;</span>';
      aiPick(q).then(function(ids){ if(seq!==aiSeq||input.value.trim()!==q) return; paintList(q,ids||[],ids&&ids.length?'ai':''); if(ids&&ids.length&&isQuestion(q)) runQuotes(q,ids,seq); });
      return;
    }
    if(wantQ) runQuotes(q,base,seq);
  }
  function runQuotes(q,base,seq){
    if(elAns.hidden) buildAnswer(q,base);
    var slow=setTimeout(function(){
      if(seq!==aiSeq) return; var wt=elAns.querySelector('.sr-qs .sr-wait'); if(wt&&wt.querySelector('.sr-busy')) wt.innerHTML='<span class="sr-busy"></span>Still looking. This can take up to 10 seconds&hellip;';
    },4000);
    var viaAI=false;
    itemAnswer(q).then(function(got){ if(got&&got.length) return got; viaAI=true; return base.length?aiQuote(q,base.slice(0,6)):[]; }).then(function(got){
      clearTimeout(slow);
      if(seq!==aiSeq||input.value.trim()!==q) return;
      paintQuotes(q,got);
      if(got&&got.length){              /* the sections the answer came from go to the top of the list */
        var top=[]; got.forEach(function(x){ if(top.indexOf(x.i)<0) top.push(x.i); });
        paintList(q,top.concat(base.filter(function(i){return top.indexOf(i)<0;})),viaAI?'ai':'');
      }
    });
  }
  function close(){ out.style.display='none'; input.setAttribute('aria-expanded','false'); cur=-1; }
  function update(force){
    var q=input.value.trim();
    clearTimeout(aiTimer); aiSeq++;
    if(q.length<2){ close(); clearAnswer(); return; }
    var base=search(q);
    if(!isQuestion(q)&&!force) clearAnswer();
    paintList(q,base,'');
    if(force) runAnswer(q,base);
    else if(isQuestion(q)) aiTimer=setTimeout(function(){ if(input.value.trim()===q) runAnswer(q,base); },900);
  }
  function move(d){
    var rows=elList.querySelectorAll('.sr-row'); if(!rows.length) return;
    if(cur>=0&&rows[cur]) rows[cur].classList.remove('on');
    cur=(cur+d+rows.length)%rows.length; rows[cur].classList.add('on'); rows[cur].scrollIntoView({block:'nearest'});
    input.setAttribute('aria-activedescendant',rows[cur].id);
  }
  input.addEventListener('input',function(){ update(false); });
  input.addEventListener('focus',function(){ prepMeds(); ensureRoom(); if(input.value.trim().length>=2) update(false); });
  input.addEventListener('keydown',function(ev){
    if(ev.key==='ArrowDown'){ev.preventDefault();move(1);}
    else if(ev.key==='ArrowUp'){ev.preventDefault();move(-1);}
    else if(ev.key==='Escape'){close();}
    else if(ev.key==='Enter'){
      ev.preventDefault();
      var rows=elList.querySelectorAll('.sr-row');
      if(cur>=0&&rows[cur]){ window.location.href=rows[cur].getAttribute('href'); return; }
      ensureRoom(); update(true); input.blur&&window.innerWidth<700&&input.blur();
    }
  });
  var btn=box.querySelector('button');
  if(btn){ btn.removeAttribute('onclick'); btn.onclick=null; btn.addEventListener('click',function(ev){ev.preventDefault();ensureRoom();update(true);}); }
  window.addEventListener('resize',function(){ if(out.style.display==='block') place(); });
  window.addEventListener('scroll',function(){ if(out.style.display==='block') place(); },{passive:true});
  document.addEventListener('click',function(ev){ if(ev.target!==input && !out.contains(ev.target) && !(btn&&btn.contains(ev.target))) close(); });
})();
