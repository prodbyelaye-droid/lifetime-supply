/* The server supplies price, structured data and checkout together. Refresh
   an already-open tab at the next absolute offer boundary as well. */
(function(){
  var marker=document.querySelector('meta[name="offer-refresh-at"]');
  if(!marker)return;
  // Elapsed time avoids reload loops when a visitor's wall clock is fast.
  var delay=Number(marker.dataset.delayMs);
  var started=performance.now();
  function refresh(){if(performance.now()-started>=delay)window.location.reload();}
  setTimeout(refresh,Math.max(0,Math.min(delay+1000,2147483647)));
  document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh();});
})();
