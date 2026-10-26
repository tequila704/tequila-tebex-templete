/* TEQUILA5M cinematic hero slider: real whole-image left/right motion.
   Rotates every 6.8s, arrows/dots work, and does NOT freeze on mouse hover.
   Honors reduced-motion and stops in background tabs. */
(() => {
  'use strict';
  function boot() {
    const wrap=document.querySelector('.hero-image-wrap');
    const stage=document.getElementById('tqHeroStage');
    const track=document.getElementById('tqHeroTrack');
    if(!wrap||!stage||!track)return;
    const panels=[...track.querySelectorAll('.tq-hero-panel')];
    const dots=[...wrap.querySelectorAll('[data-hero-go]')];
    const arrows=[...wrap.querySelectorAll('[data-hero-dir]')];
    if(panels.length!==2||dots.length!==2)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let current=0, timer=null;

    function goTo(index) {
      const next=(index+panels.length)%panels.length;
      if(next===current)return;
      current=next;
      track.classList.toggle('is-second',next===1);
      panels.forEach((panel,i)=>{
        panel.classList.toggle('is-active',i===current);
        panel.setAttribute('aria-hidden',String(i!==current));
      });
      dots.forEach((dot,i)=>{
        const selected=i===current;
        dot.classList.toggle('is-current',selected);
        dot.setAttribute('aria-pressed',String(selected));
      });
    }
    function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
    function start(){
      stop();
      if(document.hidden||reduced.matches)return;
      timer=setInterval(()=>goTo(current+1),6800);
    }
    dots.forEach(dot=>dot.addEventListener('click',()=>{
      goTo(Number(dot.dataset.heroGo));start();
    }));
    arrows.forEach(arrow=>arrow.addEventListener('click',()=>{
      goTo(current+Number(arrow.dataset.heroDir));start();
    }));
    document.addEventListener('visibilitychange',start);
    reduced.addEventListener?.('change',start);
    window.addEventListener('pagehide',stop);
    // Keep rotating with a mouse resting over the banner.
    // Keyboard focus pauses until a user clicks a control or leaves the banner.
    wrap.addEventListener('focusin',stop);
    wrap.addEventListener('focusout',(event)=>{
      if(!wrap.contains(event.relatedTarget))start();
    });
    start();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();