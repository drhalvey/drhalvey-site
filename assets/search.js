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
  }
  input.addEventListener('input',render);
  input.addEventListener('keydown',function(ev){ if(ev.key==='Enter'&&out._ansUrl&&out.style.display==='block'){ev.preventDefault();window.location.href=out._ansUrl;} });
  input.addEventListener('focus',function(){ if(input.value.trim().length>=2) render(); });
  document.addEventListener('click',function(ev){ if(ev.target!==input && !out.contains(ev.target)) out.style.display='none'; });
})();
