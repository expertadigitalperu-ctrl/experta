(() => {
  const video = document.querySelector('#hero-demo');
  const toggle = document.querySelector('.premium-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let inView = true;
  let explicitPlay = false;
  if (video && toggle) {
    const update = () => {
      const playing = !video.paused;
      toggle.dataset.playing = String(playing);
      toggle.setAttribute('aria-label', playing ? 'Pausar demo' : 'Reproducir demo');
      toggle.setAttribute('aria-pressed', String(playing));
    };
    const sync = () => {
      if (!inView || document.hidden || userPaused || (reduced.matches && !explicitPlay)) video.pause();
      else video.play().catch(update);
      update();
    };
    video.addEventListener('play', update);
    video.addEventListener('pause', update);
    video.addEventListener('error', () => { video.pause(); toggle.hidden = true; });
    toggle.addEventListener('click', () => {
      if (video.paused) { userPaused = false; explicitPlay = true; video.play().catch(update); }
      else { userPaused = true; video.pause(); }
    });
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, {threshold: .15}).observe(video);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => { explicitPlay = false; sync(); });
    update();
  }
  document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => { link.closest('details').open = false; }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const menu = document.querySelector('.mobile-menu[open]');
    if (menu) { menu.open = false; menu.querySelector('summary').focus(); }
  });
})();
