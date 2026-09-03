/* "Was this page helpful?" - sends an event to Google Analytics, no server needed */
(function(){
  var host=document.getElementById('pagefb'); if(!host) return;
  var KEY='fb-'+location.pathname;
  function thanks(){host.innerHTML='<div style="border:1px solid #e7dcd2;border-radius:6px;background:#fff;padding:20px 24px;font-size:16px;color:#5b4d49">Thank you. Your feedback helps improve these guides.</div>';}
  try{ if(localStorage.getItem(KEY)){thanks();return;} }catch(e){}
  var bs='font-family:inherit;font-size:16px;font-weight:600;min-width:96px;padding:12px 24px;border-radius:3px;border:1.5px solid #cbb9ac;background:#fff;color:#4e1d24;cursor:pointer';
  host.innerHTML='<div style="border:1px solid #e7dcd2;border-radius:6px;background:#fff;padding:20px 24px;display:flex;gap:16px 32px;align-items:center;justify-content:space-between;flex-wrap:wrap">'+
    '<div style="flex:1 1 320px;display:flex;flex-direction:column;gap:4px"><span style="font-size:18px;font-weight:700;letter-spacing:-.01em">Was this page helpful?</span><span style="font-size:14px;color:#5b4d49">Anonymous, one click. Nothing else is collected.</span></div>'+
    '<div style="display:flex;gap:12px;flex:0 0 auto"><button data-v="yes" style="'+bs+'">Yes</button><button data-v="no" style="'+bs+'">No</button></div></div>';
  host.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click',function(){
      var v=b.getAttribute('data-v');
      if(typeof gtag==='function') gtag('event','page_feedback',{helpful:v,page_path:location.pathname});
      try{localStorage.setItem(KEY,v);}catch(e){}
      thanks();
    });
  });
})();
