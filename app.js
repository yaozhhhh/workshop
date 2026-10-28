const toolData = [
  {image:'1046',caption:'01 / AI 辅助角色生成',alt:'电脑屏幕上的数字影箱界面，展示 AI 生成的角色及参考素材',description:'AI 辅助角色生成：把对人物的想象，转化为可讨论的视觉形象。'},
  {image:'1044',caption:'02 / 手势驱动数字皮影',alt:'学生面对数字皮影工具，举起手臂进行动作尝试',description:'通过手势驱动，让身体表达与数字皮影连接。'},
  {image:'1053',caption:'03 / 一键游戏，延伸互动体验',alt:'学生在教室前方操作电脑，屏幕展示皮影角色与场景',description:'从角色创作到互动体验，继续探索皮影的新可能。'}
];
const details = [...document.querySelectorAll('[data-tool]')];
details.forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  details.forEach(other => { if (other !== detail) other.open = false; });
  const item = toolData[Number(detail.dataset.tool)];
  document.getElementById('tool-image').src = `assets/classroom-${item.image}.webp`;
  document.getElementById('tool-image').alt = item.alt;
  document.getElementById('tool-caption').textContent = item.caption;
  const zoom = document.getElementById('tool-zoom');
  zoom.dataset.image = item.image;
  zoom.dataset.caption = item.description;
  zoom.setAttribute('aria-label', `放大查看：${item.caption.slice(5)}`);
}));
const gallery = document.querySelector('.gallery');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(other => {
      const selected = other === button;
      other.classList.toggle('active', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    galleryItems.forEach(item => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
    gallery.classList.toggle('filtered', filter !== 'all');
    const count = galleryItems.filter(item => !item.hidden).length;
    document.getElementById('gallery-count').textContent = `${String(count).padStart(2,'0')} FRAME(S)`;
  });
});
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
let activePhotos = [];
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + activePhotos.length) % activePhotos.length;
  const button = activePhotos[currentPhoto];
  lightboxImage.src = `assets/classroom-${button.dataset.image}.webp`;
  lightboxImage.alt = button.querySelector('img').alt;
  document.getElementById('lightbox-caption').textContent = button.dataset.caption;
  document.getElementById('lightbox-index').textContent = `${String(currentPhoto+1).padStart(2,'0')} / ${String(activePhotos.length).padStart(2,'0')}`;
}
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    const photoScope = button.closest('.gallery') || document;
    activePhotos = [...photoScope.querySelectorAll('[data-image]')].filter(item => !item.closest('[hidden]'));
    showPhoto(activePhotos.indexOf(button));
    lightbox.showModal();
    document.body.classList.add('modal-open');
  });
});
document.getElementById('close-lightbox').addEventListener('click', () => lightbox.close());
document.getElementById('prev-photo').addEventListener('click', () => showPhoto(currentPhoto-1));
document.getElementById('next-photo').addEventListener('click', () => showPhoto(currentPhoto+1));
lightbox.addEventListener('close', () => document.body.classList.remove('modal-open'));
lightbox.addEventListener('click', event => {if (event.target === lightbox) lightbox.close();});
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {event.preventDefault();showPhoto(currentPhoto-1);}
  if (event.key === 'ArrowRight') {event.preventDefault();showPhoto(currentPhoto+1);}
});

// Keep reading comfortable while progressively revealing the larger sections.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.intro-grid, .wide-photo, .tools-heading, .tools-grid, .belief h2, .gallery-heading, .gallery-item, .closing h2').forEach(element => {
    element.classList.add('reveal', 'is-pending');
    observer.observe(element);
  });
}
