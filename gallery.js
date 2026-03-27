/* gallery.js — ES6+ */

const folder  = document.currentScript.dataset.folder ?? './images/kuhni/';
const max     = parseInt(document.currentScript.dataset.max ?? '50', 10);
const grid    = document.getElementById('photoGrid');
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lightboxImg');
const lbCnt   = document.getElementById('lightboxCounter');

let photos  = [];
let current = 0;

/* ---- сетка ---- */
for (let i = 1; i <= max; i++) {
  const src  = `${folder}${i}.jpg`;
  const item = document.createElement('div');
  item.className    = 'photo-item';
  item.style.display = 'none';
  item.dataset.src  = src;

  const img = document.createElement('img');
  img.alt = '';

  img.onload = () => {
    item.style.display = '';
    item.addEventListener('click', () => open(photos.indexOf(src)));
    photos.push(src);
  };

  img.onerror = () => item.remove();
  img.src = src;

  item.appendChild(img);
  grid.appendChild(item);
}

/* ---- лайтбокс ---- */
const open = (idx) => {
  current = idx;
  update();
  lb.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
};

const close = () => {
  lb.classList.remove('open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
};

const update = () => {
  lbImg.src = photos[current];
  lbCnt.textContent = `${current + 1} / ${photos.length}`;
};

const prev = () => { current = (current - 1 + photos.length) % photos.length; update(); };
const next = () => { current = (current + 1) % photos.length; update(); };

window.closeLightbox = close;
window.prevPhoto     = prev;
window.nextPhoto     = next;

lb.addEventListener('click', (e) => {
  if (e.target === lb || e.target.classList.contains('lightbox-img-wrap')) close();
});

let touchX = 0;
lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  const diff = touchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
}, { passive: true });

document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  const actions = { ArrowLeft: prev, ArrowRight: next, Escape: close };
  actions[e.key]?.();
});
