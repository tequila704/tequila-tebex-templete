/* TEQUILA5M: muted, in-card YouTube autoplay previews.
   Browser autoplay requires muted playback. Click a preview or Watch Trailer to watch with sound.
   YouTube may prevent embedding for individual videos; links stay usable.
*/
(() => {
  'use strict';

  const selector = 'a.featured-media[href*="youtube.com/watch"], a.media[href*="youtube.com/watch"]';
  const prepared = new WeakSet();
  const visible = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;

  const style = document.createElement('style');
  style.id = 'tequila-featured-autoplay-style';
  style.textContent = [
    '.tq-autoplay-embed{position:absolute;inset:0;width:100%;height:100%;z-index:1;border:0;pointer-events:none;background:transparent;opacity:0;transition:opacity .35s ease}',
    '.tq-autoplay-live .tq-autoplay-embed{opacity:1}',
    '.tq-autoplay-live .featured-play,.tq-autoplay-live .play{opacity:0;pointer-events:none}',
    '.tq-autoplay-live.featured-media:after,.tq-autoplay-live.media:after{background:linear-gradient(180deg,transparent 70%,rgba(0,0,0,.40))}',
    'a.featured-media,a.media{isolation:isolate}',
    '@media (prefers-reduced-motion:reduce){.tq-autoplay-embed{transition:none}}'
  ].join('\n');
  document.head.appendChild(style);

  function getVideo(media) {
    try {
      const url = new URL(media.href);
      if (url.hostname !== 'www.youtube.com' && url.hostname !== 'youtube.com') return null;
      const id = url.searchParams.get('v');
      if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return null;
      const time = url.searchParams.get('t') || '0';
      const start = Number.parseInt(time, 10) || 0;
      return {id, start:Math.max(0, Math.min(start, 3600))};
    } catch (error) {
      return null;
    }
  }

  function stop(media) {
    media.querySelector('.tq-autoplay-embed')?.remove();
    media.classList.remove('tq-autoplay-live');
  }

  function start(media) {
    if (document.hidden || reducedMotion.matches || !media.isConnected) return;
    if (media.querySelector('.tq-autoplay-embed')) return;
    const video = getVideo(media);
    if (!video) return;

    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      autoplay:'1',
      mute:'1',
      playsinline:'1',
      loop:'1',
      playlist:video.id,
      controls:'0',
      rel:'0',
      modestbranding:'1',
      start:String(video.start)
    });
    iframe.className = 'tq-autoplay-embed';
    iframe.title = 'Muted automatic preview of TEQUILA5M trailer';
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.loading = 'eager';
    iframe.addEventListener('load', () => {
      if (iframe.isConnected) media.classList.add('tq-autoplay-live');
    }, {once:true});
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + video.id + '?' + params.toString();
    media.appendChild(iframe);
  }

  function refresh() {
    for (const media of visible) {
      if (!media.isConnected || document.hidden || reducedMotion.matches) {
        stop(media);
      } else {
        start(media);
      }
    }
  }

  function prepare(media) {
    if (prepared.has(media) || !getVideo(media)) return;
    prepared.add(media);
    observer.observe(media);
  }

  function scan(root) {
    if (root?.matches?.(selector)) prepare(root);
    root?.querySelectorAll?.(selector).forEach(prepare);
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const media = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          visible.add(media);
          start(media);
        } else {
          visible.delete(media);
          stop(media);
        }
      }
    }, {threshold:[0, 0.15, 0.35, 0.6],rootMargin:'60px 40px'});
    scan(document);
    const mutations = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === 1) scan(node);
        }
      }
    });
    mutations.observe(document.body, {childList:true,subtree:true});
    document.addEventListener('visibilitychange', refresh);
    reducedMotion.addEventListener?.('change', refresh);
    window.addEventListener('pagehide', () => {
      for (const media of visible) stop(media);
    });
  }
})();
