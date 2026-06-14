(function(){
  var input=document.getElementById('siteq'); if(!input) return;
  var out=document.getElementById('searchres');
  var IDX=window.SEARCH_INDEX||[];
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
  function render(){
    var q=input.value.trim();
    if(q.length<2){out.style.display='none';out.innerHTML='';return;}
    var r=IDX.map(function(e){return {e:e,s:score(e,q)};}).filter(function(x){return x.s>=35;})
      .sort(function(a,b){return b.s-a.s;}).slice(0,8);
    if(!r.length){out.innerHTML='<a class="sr-item" href="contact.html"><span class="sr-t">No match found</span><span class="sr-p">Try another word, or contact the rooms.</span></a>';out.style.display='block';return;}
    out.innerHTML=r.map(function(x){var e=x.e;return '<a class="sr-item" href="'+e.u+'"><span class="sr-t">'+e.t+'</span>'+(e.s?'<span class="sr-p">'+e.s+'</span>':'')+'</a>';}).join('');
    out.style.display='block';
  }
  input.addEventListener('input',render);
  input.addEventListener('focus',function(){ if(input.value.trim().length>=2) render(); });
  document.addEventListener('click',function(ev){ if(ev.target!==input && !out.contains(ev.target)) out.style.display='none'; });
})();
