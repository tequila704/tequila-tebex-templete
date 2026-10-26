/* TEQUILA5M luxury hero: timed slide rotation, manual arrows and dots, autoplay pause on hover/focus. */
(() => {
  'use strict';
  function boot() {
    const wrap = document.querySelector('.hero-image-wrap');
    const stage = document.getElementById('tqHeroStage');
    if (!wrap || !stage) return;
    const panels = [...stage.querySelectorAll('.tq-hero-panel')];
    const dots = [...wrap.querySelectorAll('[data-hero-go]')];
    const arrows = [...wrap.querySelectorAll('[data-hero-dir]')];
    if (panels.length !== 2 || dots.length !== 2) return;
    let current = 0;
    let busy = false;
    let timer = null;
    let cleanup = null;
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)');
    const interval = 7500;

    function show(index) {
      const next = (index + panels.length) % panels.length;
      if (next === current || busy) return;
      busy = true;
      const oldPanel = panels[current];
      const newPanel = panels[next];
      oldPanel.classList.remove('is-active');
      oldPanel.classList.add('is-outgoing');
      oldPanel.setAttribute('aria-hidden','true');
      newPanel.classList.remove('is-outgoing');
      newPanel.classList.add('is-active');
      newPanel.setAttribute('aria-hidden','false');
      dots.forEach((dot,i) => {
        const selected = i === next;
        dot.classList.toggle('is-current',selected);
        dot.setAttribute('aria-pressed',String(selected));
      });
      current = next;
      clearTimeout(cleanup);
      cleanup = setTimeout(() => {
        oldPanel.classList.remove('is-outgoing');
        busy = false;
      }, reduce.matches ? 40 : 960);
    }

    function stop() {
      if (timer !== null) clearInterval(timer);
      timer = null;
    }
    function start() {
      stop();
      if (document.hidden || reduce.matches || wrap.matches(':hover') || wrap.contains(document.activeElement)) return;
      timer = setInterval(() => show(current + 1), interval);
    }
    dots.forEach(dot => dot.addEventListener('click',() => {
      show(Number(dot.dataset.heroGo));
      start();
    }));
    arrows.forEach(button => button.addEventListener('click',() => {
      show(current + Number(button.dataset.heroDir));
      start();
    }));
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);
    wrap.addEventListener('focusin', stop);
    wrap.addEventListener('focusout', () => setTimeout(start,0));
    document.addEventListener('visibilitychange',start);
    reduce.addEventListener?.('change', start);
    start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();