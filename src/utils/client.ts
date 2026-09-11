const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const enquiry = document.querySelector<HTMLFormElement>('[data-enquiry]');
if(enquiry){
  const select=enquiry.querySelector<HTMLSelectElement>('[name="service"]')!;
  const requestedService=new URLSearchParams(location.search).get('service');
  if(requestedService && [...select.options].some(o=>o.value===requestedService))select.value=requestedService;
  const status=enquiry.querySelector<HTMLElement>('[data-form-status]')!;
  const message=()=>{
    const data=new FormData(enquiry);
    return `${data.get('name')}\n${data.get('email')}\n${data.get('phone') || ''}\n\n${select.selectedOptions[0].text}\n\n${data.get('message')}`;
  };
  enquiry.addEventListener('submit',e=>{
    e.preventDefault();if(!enquiry.reportValidity())return;
    status.textContent=enquiry.dataset.ready || '';
    location.href=`mailto:${enquiry.dataset.email}?subject=${encodeURIComponent(enquiry.dataset.subject || '')}&body=${encodeURIComponent(message())}`;
  });
  enquiry.querySelector('[data-copy-enquiry]')?.addEventListener('click',async()=>{
    if(!enquiry.reportValidity())return;
    try{await navigator.clipboard.writeText(message());status.textContent=enquiry.dataset.copied || '';}catch{status.textContent=enquiry.dataset.copyError || '';}
  });
}

// Store only explicit language choices. Direct localized links remain authoritative.
document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach(link => {
  link.addEventListener('click', () => {
    try { localStorage.setItem('traver-language', link.dataset.language!); } catch { /* Storage can be disabled. */ }
  });
});

const intro = document.querySelector<HTMLElement>('.intro');
if (intro) {
  // The CSS animation completes independently if JavaScript fails.
  const dismiss = () => intro.remove();
  window.addEventListener('keydown', dismiss, { once: true });
  window.addEventListener('pointerdown', dismiss, { once: true });
  intro.addEventListener('animationend', e => { if (e.target === intro) dismiss(); });
  if (reduced.matches) dismiss();
}

const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
const menuOpen = document.querySelector<HTMLButtonElement>('[data-menu-open]');
let closing = false;
const closeMenu = () => {
  if (!menu?.open || closing) return;
  closing = true;
  const finish = () => { menu.close(); menu.classList.remove('closing'); closing = false; menuOpen?.setAttribute('aria-expanded','false'); menuOpen?.focus(); };
  if (reduced.matches) { finish(); return; }
  menu.classList.add('closing');
  menu.addEventListener('animationend', finish, { once: true });
};
menuOpen?.addEventListener('click', () => { menu?.showModal(); menuOpen.setAttribute('aria-expanded','true'); });
document.querySelector('[data-menu-close]')?.addEventListener('click',closeMenu);
menu?.addEventListener('cancel', e => { e.preventDefault(); closeMenu(); });
menu?.addEventListener('close', () => menuOpen?.setAttribute('aria-expanded','false'));
window.matchMedia('(min-width: 64rem)').addEventListener('change', e => { if (e.matches) closeMenu(); });

if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}

const lightbox = document.querySelector<HTMLDialogElement>('[data-lightbox]');
const photos = [...document.querySelectorAll<HTMLAnchorElement>('[data-gallery-index]')];
if (lightbox && photos.length) {
  let index = 0;
  let returnFocus: HTMLAnchorElement | undefined;
  const img = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const caption = lightbox.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const count = lightbox.querySelector<HTMLElement>('[data-counter]')!;
  const show = (i: number) => {
    index = (i + photos.length) % photos.length;
    const photo = photos[index];
    img.src = photo.href; img.alt = photo.dataset.alt || '';
    caption.textContent = img.alt;
    count.textContent = `${String(index+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  };
  photos.forEach((photo,i) => photo.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); returnFocus = photo; show(i); lightbox.showModal();
  }));
  lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(index-1));
  lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(index+1));
  lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index+1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index-1); }
  });
  lightbox.addEventListener('close', () => returnFocus?.focus());
  let touchX = 0;
  img.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  img.addEventListener('touchend', e => { const delta=e.changedTouches[0].clientX-touchX; if(Math.abs(delta)>60) show(index+(delta<0?1:-1)); }, { passive: true });
}
