/* gallery.js — ES6+ */

const folder = document.currentScript.dataset.folder ?? './images/kuhni/';
const grid   = document.getElementById('photoGrid');
const lb     = document.getElementById('lightbox');
const lbImg  = document.getElementById('lightboxImg');
const lbCnt  = document.getElementById('lightboxCounter');

let photos  = []; // [{ src, price }]
let current = 0;

/* ---- загружаем манифест ---- */
fetch(`${folder}photos.json`)
  .then(r => r.json())
  .then(files => {
    if (!files.length) return;

    photos = files.map(f => ({
      src:   `${folder}${f.file}`,
      price: f.price ?? null,
    }));

    photos.forEach(({ src, price }, idx) => {
      const item = document.createElement('div');
      item.className = 'photo-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      item.appendChild(img);

      if (price) {
        const badge = document.createElement('div');
        badge.className = 'price-badge';
        badge.textContent = price;
        item.appendChild(badge);
      }

      item.addEventListener('click', () => open(idx));
      grid.appendChild(item);
    });
  })
  .catch(() => {});

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

const lbBox = lb.querySelector('.lb-img-box');

const update = () => {
  const { src, price } = photos[current];
  lbImg.src = src;
  lbCnt.textContent = `${current + 1} / ${photos.length}`;

  let lbPrice = lbBox.querySelector('.lb-price');
  if (price) {
    if (!lbPrice) {
      lbPrice = document.createElement('div');
      lbPrice.className = 'lb-price';
      lbBox.appendChild(lbPrice);
    }
    lbPrice.textContent = price;
  } else if (lbPrice) {
    lbPrice.remove();
  }
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
