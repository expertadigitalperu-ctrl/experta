(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const viewer = document.createElement('dialog');
 viewer.className = 'demo-viewer';
 const viewerHeader = document.createElement('div'); viewerHeader.className = 'viewer-header';
 const viewerTitle = document.createElement('h2');
 const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Cerrar';
 close.className = 'viewer-close';
 const viewerVideo = document.createElement('video');
 const viewerImage = document.createElement('img'); viewerImage.hidden = true;
 viewerVideo.controls = true; viewerVideo.muted = true; viewerVideo.playsInline = true;
 viewerHeader.append(viewerTitle, close); viewer.append(viewerHeader, viewerVideo, viewerImage); document.body.append(viewer);
 viewer.setAttribute('aria-label', 'Vista ampliada del sistema');
 close.addEventListener('click', () => viewer.close());
 viewer.addEventListener('click', e => { if (e.target === viewer) { const r = viewer.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) viewer.close(); } });
 viewer.addEventListener('close', () => { viewerVideo.pause(); galleries.forEach(g => g.sync()); });
 document.querySelectorAll('.service-expand').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.service-gallery');
  const video = button.closest('.example-panel').querySelector('video');
  const image = button.closest('.example-panel').querySelector('img');
  viewerTitle.textContent = card.querySelector('.example-tab[aria-pressed="true"]').textContent;
  document.querySelectorAll('.service-demo').forEach(v => v.pause());
  viewerVideo.hidden = !video; viewerImage.hidden = !!video;
  if (video) {
   viewerVideo.src = video.querySelector('source').src;
   viewerVideo.poster = video.poster;
  } else {
   viewerVideo.pause(); viewerImage.src = image.src; viewerImage.alt = image.alt;
  }
  viewer.showModal(); if (video) viewerVideo.play().catch(() => {});
 }));
 const galleries = [...document.querySelectorAll('.service-gallery')].map(card => {
  const buttons = [...card.querySelectorAll('.example-tab')];
  const panels = [...card.querySelectorAll('.example-panel')];
  const states = [...card.querySelectorAll('.service-demo')].map(video => {
   const button = video.closest('.example-panel').querySelector('.service-play');
   const state = {video, button, paused: false, explicit: false};
   const update = () => {
    const playing = !video.paused;
    button.textContent = playing ? 'Pausar demo' : 'Reproducir demo';
    button.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reproducir'} demo: ${buttons[panels.indexOf(video.closest('.example-panel'))].textContent}`);
   };
   video.addEventListener('play', update); video.addEventListener('pause', update);
   video.addEventListener('error', () => { button.textContent = 'Vista previa disponible'; button.disabled = true; });
   button.addEventListener('click', () => {
    state.paused = !video.paused;
    if (!state.paused) state.explicit = true;
    sync();
   });
   return state;
  });
  let visible = false;
  function sync() {
   states.forEach(s => {
    const selected = !s.video.closest('.example-panel').hidden;
    if (!visible || !selected || document.hidden || viewer.open || s.paused || (reduced.matches && !s.explicit)) s.video.pause();
    else s.video.play().catch(() => {});
   });
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
   buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
   panels.forEach((p, i) => { p.hidden = i !== index; });
   sync();
  }));
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold: .18}).observe(card);
  return {sync};
 });
 document.addEventListener('visibilitychange', () => galleries.forEach(g => g.sync()));
 reduced.addEventListener('change', () => galleries.forEach(g => g.sync()));
})();
