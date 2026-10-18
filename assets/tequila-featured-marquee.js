/* TEQUILA5M featured drops continuous carousel: move RIGHT, seamless repeat.
 * Preserves the independently loaded muted autoplay previews, YouTube links and Tebex package buttons.
 */
(() => {
  'use strict';
  const selector = '.featured-rail, .rail';
  const style = document.createElement('style');
  style.id = 'tequila-featured-marquee-style';
  style.textContent = [
    '.tq-featured-marquee{display:block!important;overflow-x:hidden!important;scroll-snap-type:none!important;scrollbar-width:none!important;touch-action:pan-y}',
    '.tq-featured-marquee::-webkit-scrollbar{display:none!important}',
    '.tq-featured-marquee-track{display:flex;gap:0;width:max-content;animation:tqFeaturedSlideRight var(--tq-featured-duration,76s) linear infinite;will-change:transform}',
    '.tq-featured-marquee-group{display:flex;align-items:stretch;flex:0 0 auto;gap:16px;padding-right:16px}',
    '.tq-featured-marquee .featured-drop-card,.tq-featured-marquee .card{scroll-snap-align:none!important;flex-shrink:0}',
    '.tq-featured-marquee:hover .tq-featured-marquee-track,.tq-featured-marquee:focus-within .tq-featured-marquee-track,.tq-featured-marquee[data-tq-paused] .tq-featured-marquee-track{animation-play-state:paused!important}',
    '@keyframes tqFeaturedSlideRight{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}',
    '@media(prefers-reduced-motion:reduce){.tq-featured-marquee{overflow-x:auto!important;touch-action:pan-x!important}.tq-featured-marquee-track{animation:none!important;transform:none!important;will-change:auto!important}.tq-featured-marquee-copy{display:none!important}}'
  ].join('\n');
  document.head.appendChild(style);

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rails = new Set();

  function fitSpeed(rail) {
    const track = rail.querySelector('.tq-featured-marquee-track');
    const original = rail.querySelector('.tq-featured-marquee-original');
    if (!track || !original) return;
    const width = original.getBoundingClientRect().width;
    if (width > 0) {
      // Same comfortable drift speed as the category ticker, but towards the right.
      track.style.setProperty('--tq-featured-duration', Math.max(30, width / 54).toFixed(2) + 's');
    }
  }

  function install(rail) {
    if (rail.dataset.tqFeaturedMarquee === '1') return;
    const items = Array.from(rail.children).filter(el => el.matches('.featured-drop-card, .card'));
    if (items.length < 2) return;
    rail.dataset.tqFeaturedMarquee = '1';

    const original = document.createElement('div');
    original.className = 'tq-featured-marquee-group tq-featured-marquee-original';
    for (const card of items) original.appendChild(card);

    const copy = original.cloneNode(true);
    copy.className = 'tq-featured-marquee-group tq-featured-marquee-copy';
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('.tq-autoplay-embed').forEach(frame => frame.remove());
    copy.querySelectorAll('.tq-autoplay-live').forEach(el => el.classList.remove('tq-autoplay-live'));
    copy.querySelectorAll('a,button,[tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));

    const track = document.createElement('div');
    track.className = 'tq-featured-marquee-track';
    // Start on the real cards; move right to reveal the identical leading copy.
    track.append(copy, original);
    rail.appendChild(track);
    rail.classList.add('tq-featured-marquee');
    rails.add(rail);

    fitSpeed(rail);
    rail.addEventListener('pointerdown', () => {
      rail.dataset.tqPaused = '1';
    }, {passive:true});
    rail.addEventListener('pointerup', () => {
      delete rail.dataset.tqPaused;
    }, {passive:true});
    rail.addEventListener('pointercancel', () => {
      delete rail.dataset.tqPaused;
    }, {passive:true});
    rail.addEventListener('pointerleave', () => {
      delete rail.dataset.tqPaused;
    }, {passive:true});
  }

  function scan(root) {
    if (root.matches?.(selector)) install(root);
    root.querySelectorAll?.(selector).forEach(install);
  }

  const watcher = new MutationObserver(changes => {
    for (const change of changes) {
      for (const node of change.addedNodes) {
        if (node.nodeType === 1) scan(node);
      }
    }
  });

  function init() {
    scan(document);
    watcher.observe(document.body, {childList:true,subtree:true});
    window.addEventListener('resize', () => {
      for (const rail of rails) if (rail.isConnected) fitSpeed(rail);
    }, {passive:true});
    document.addEventListener('visibilitychange', () => {
      for (const rail of rails) {
        if (document.hidden) rail.dataset.tqPaused = '1';
        else delete rail.dataset.tqPaused;
      }
    });
    media.addEventListener?.('change', () => {
      for (const rail of rails) if (rail.isConnected) fitSpeed(rail);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();