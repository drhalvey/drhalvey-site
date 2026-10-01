(function(){
  var input=document.getElementById('siteq'); if(!input) return;
  var out=document.getElementById('searchres');
  var IDX=window.SEARCH_INDEX||[], QA=window.QA_BANK||[];
  var STOP={surgery:1,operation:1,anaesthetic:1,anesthetic:1,before:1,after:1,hospital:1,halvey:1,doctor:1,what:1,when:1,will:1,does:1,have:1,take:1,about:1,the:1,and:1,for:1,can:1,you:1,your:1,how:1};
  function lev(a,b){a=a||'';b=b||'';var m=a.length,n=b.length;if(!m)return n;if(!n)return m;var d=[];for(var i=0;i<=m;i++)d[i]=[i];for(var j=0;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++){var c=a[i-1]===b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);}return d[m][n];}
  function score(e,q){
    q=q.toLowerCase().trim(); if(!q) return 0;
    var k=e.k||'', t=(e.t||'').toLowerCase(), best=0;
    if(t===q) best=100;
    else if(t.indexOf(q)>-1) best=85;
    if(k.indexOf(q)>-1) best=Math.max(best,70);
    q.split(/\s+/).forEach(function(tk){ if(tk.length<3) return;
      if(k.indexOf(tk)>-1) best=Math.max(best,55);
      else { k.split(/\s+/).forEach(function(w){ if(!w) return; var dd=lev(tk,w); if(dd<=1) best=Math.max(best,45); else if(dd===2&&tk.length>4) best=Math.max(best,35); }); }
    });
    return best;
  }
  function qaMatch(q){
    q=q.toLowerCase().replace(/[?.,!']/g,' ').trim(); if(q.length<3) return null;
    var toks=q.split(/\s+/).filter(function(w){return w.length>=3&&!STOP[w];});
    var best=null;
    QA.forEach(function(e){
      var kw=e.k.split(/\s+/), hits=0, strong=false;
      toks.forEach(function(tk){
        var hit=false;
        for(var i=0;i<kw.length;i++){var w=kw[i];
          if(w===tk){hit=true;strong=true;break;}
          if((tk.length>3&&w.indexOf(tk)===0)||(w.length>4&&lev(tk,w)<=1)){hit=true;if(tk.length>=5)strong=true;break;}}
        if(hit)hits++;
      });
      if(e.t.toLowerCase().replace(/[?']/g,'')===q)hits+=3;
      if(hits&&(hits>=2||strong)){var s=hits*10+(strong?5:0);if(!best||s>best.s)best={e:e,s:s};}
    });
    return best&&best.e;
  }
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;');}

  /* AI layer (added 01/10/2026). The AI only PICKS entries from this site's own search index; every word shown
     to the patient is the site's own text. If the AI is slow, capped or offline, the normal results stay. */
  var RELAY='https://bbwjroytqxynborrqylr.supabase.co/functions/v1/ai-relay';
  var TOKEN='ai_89af858d725a4f6b86a4624f487eb26b6a90fe7a0d0e410e815f7f490872396e';
  var SYS="You rank pages on Dr Ed Halvey's patient information website (anaesthesia, Perth, Western Australia). "+
    "You get a numbered list of pages and page sections, then a patient's search. Reply with ONLY a JSON array of up to 5 numbers: "+
    "the entries that best answer the search, best first. Prefer a specific section over a whole page. Understand everyday words, "+
    "misspellings and brand names (for example 'put to sleep' means general anaesthetic, 'blood thinners' means anticoagulants, "+
    "'Ozempic' or 'Mounjaro' means GLP-1 medicines, 'nil by mouth' means fasting). Reply [] if nothing in the list is relevant. "+
    "Never answer the question and never write anything except the array.";
  var CAT=IDX.map(function(e,i){return i+'|'+e.t+(e.s?' ('+e.s+')':'');}).join('\n');
  var aiCache={}, aiTimer=null, aiSeq=0, memId=null;
  function installId(){
    try{var k='ai.iid',v=localStorage.getItem(k);if(!v){v=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():('x'+Math.random().toString(36).slice(2)+Date.now());localStorage.setItem(k,v);}return v;}
    catch(e){ if(!memId) memId='m'+Math.random().toString(36).slice(2)+Date.now(); return memId; }
  }
  function wantsAI(q){ return q.length>=6 && q.split(/\s+/).filter(Boolean).length>=2; }
  function aiPick(q){
    var key=q.toLowerCase();
    if(aiCache.hasOwnProperty(key)) return Promise.resolve(aiCache[key]);
    if(!window.fetch) return Promise.resolve(null);
    var ctl=window.AbortController?new AbortController():null; if(ctl) setTimeout(function(){ctl.abort();},9000);
    return fetch(RELAY,{method:'POST',signal:ctl?ctl.signal:undefined,
      headers:{'content-type':'application/json','x-app-token':TOKEN,'x-install-id':installId()},
      body:JSON.stringify({max_tokens:120,temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:'Entries:\n'+CAT+'\n\nSearch: '+q}]})})
    .then(function(r){return r.ok?r.json():null;})
    .then(function(d){
      if(!d) return null;
      var t=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'';
      var m=t.match(/\[[\d,\s]*\]/); if(!m) return null;
      var seen={}, ids=JSON.parse(m[0]).filter(function(i){ if(!IDX[i]||seen[IDX[i].u]) return false; seen[IDX[i].u]=1; return true; }).slice(0,5);
      aiCache[key]=ids; return ids;
    }).catch(function(){return null;});
  }
  function item(e){return '<a class="sr-item" href="'+e.u+'"><span class="sr-t">'+esc(e.t)+'</span>'+(e.s?'<span class="sr-p">'+esc(e.s)+'</span>':'')+'</a>';}
  (function note(){
    var box=out.parentNode; if(!box||!box.parentNode||box.parentNode.querySelector('.sr-note')) return;
    var n=document.createElement('p'); n.className='sr-note';
    n.textContent="Searches are sent to Google's AI to find the best page. Please don't type names, dates of birth or other personal details.";
    n.style.cssText='margin:8px 0 0;font-size:13px;line-height:1.4;opacity:.85;color:inherit';
    box.parentNode.insertBefore(n, box.nextSibling);
  })();
  function render(){
    var q=input.value.trim();
    if(q.length<2){out.style.display='none';out.innerHTML='';return;}
    var ans=qaMatch(q);
    var r=IDX.map(function(e){return {e:e,s:score(e,q)};}).filter(function(x){return x.s>=35;})
      .sort(function(a,b){return b.s-a.s;}).slice(0,ans?4:8);
    if(ans) r=r.filter(function(x){return x.e.u!==ans.u;});
    var html='';
    if(ans) html+='<div class="sr-ans"><span class="tag">Quick answer</span><span class="qt">'+esc(ans.t)+'</span><p>'+esc(ans.a)+'</p><a href="'+ans.u+'">'+esc(ans.x)+' &rarr;</a></div>';
    if(r.length) html+=(ans?'<div class="sr-more">More on this</div>':'')+r.map(function(x){var e=x.e;return '<a class="sr-item" href="'+e.u+'"><span class="sr-t">'+e.t+'</span>'+(e.s?'<span class="sr-p">'+e.s+'</span>':'')+'</a>';}).join('');
    if(!html) html='<a class="sr-item" href="contact.html"><span class="sr-t">No match found</span><span class="sr-p">Try another word, or contact the rooms.</span></a>';
    out.innerHTML=html; out.style.display='block';
    out._ansUrl=ans?ans.u:(r.length&&r[0].s>=70?r[0].e.u:null);
    clearTimeout(aiTimer); var seq=++aiSeq;
    if(!wantsAI(q)) return;
    var cached=aiCache[q.toLowerCase()];
    var paint=function(ids){
      if(seq!==aiSeq) return;
      var pend=out.querySelector('.sr-ai-wait'); if(pend) pend.parentNode.removeChild(pend);
      if(!ids||!ids.length) return;
      var shown={}; ids.forEach(function(i){shown[IDX[i].u]=1;});
      var rest=r.filter(function(x){return !shown[x.e.u];}).slice(0,4);
      var h='';
      if(ans) h+='<div class="sr-ans"><span class="tag">Quick answer</span><span class="qt">'+esc(ans.t)+'</span><p>'+esc(ans.a)+'</p><a href="'+ans.u+'">'+esc(ans.x)+' &rarr;</a></div>';
      h+='<div class="sr-more">Best matches <span style="font-weight:400;text-transform:none;letter-spacing:0">(picked by AI from this site)</span></div>'+ids.map(function(i){return item(IDX[i]);}).join('');
      if(rest.length) h+='<div class="sr-more">Other results</div>'+rest.map(function(x){return item(x.e);}).join('');
      out.innerHTML=h; out.style.display='block';
      out._ansUrl=ans?ans.u:IDX[ids[0]].u;
    };
    if(cached!==undefined){ paint(cached); return; }
    if(!out.querySelector('.sr-ai-wait')) out.insertAdjacentHTML('afterbegin','<div class="sr-more sr-ai-wait">Finding the best pages&hellip;</div>');
    aiTimer=setTimeout(function(){ aiPick(q).then(paint); },650);
  }
  input.addEventListener('input',render);
  input.addEventListener('keydown',function(ev){ if(ev.key==='Enter'&&out._ansUrl&&out.style.display==='block'){ev.preventDefault();window.location.href=out._ansUrl;} });
  input.addEventListener('focus',function(){ if(input.value.trim().length>=2) render(); });
  document.addEventListener('click',function(ev){ if(ev.target!==input && !out.contains(ev.target)) out.style.display='none'; });
})();
