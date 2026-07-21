/* "Was this page helpful?" - sends an event to Google Analytics, no server needed */
(function(){
  var host=document.getElementById('pagefb'); if(!host) return;
  var KEY='fb-'+location.pathname;
  function thanks(){host.innerHTML='<div style="border:1px solid #e7dcd2;border-radius:6px;background:#fff;padding:14px 18px;font-size:14.5px;color:#5b4d49">Thanks - your feedback helps improve these guides.</div>';}
  try{ if(localStorage.getItem(KEY)){thanks();return;} }catch(e){}
  host.innerHTML='<div style="border:1px solid #e7dcd2;border-radius:6px;background:#fff;padding:14px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">'+
    '<span style="font-size:14.5px"><span style="font-weight:600">Was this page helpful?</span><br><span style="font-size:12.5px;color:#6b5a55">One click really helps us improve this site. Anonymous - no sign-up, nothing else is collected.</span></span>'+
    '<button data-v="yes" style="font-family:inherit;font-size:14px;font-weight:600;padding:8px 18px;border-radius:3px;border:1px solid #e7dcd2;background:#fff;color:#4e1d24;cursor:pointer">Yes</button>'+
    '<button data-v="no" style="font-family:inherit;font-size:14px;font-weight:600;padding:8px 18px;border-radius:3px;border:1px solid #e7dcd2;background:#fff;color:#4e1d24;cursor:pointer">No</button></div>';
  host.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click',function(){
      var v=b.getAttribute('data-v');
      if(typeof gtag==='function') gtag('event','page_feedback',{helpful:v,page_path:location.pathname});
      try{localStorage.setItem(KEY,v);}catch(e){}
      thanks();
    });
  });
})();
