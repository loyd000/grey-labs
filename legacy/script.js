/* Configure only with an HTTPS service that confirms accepted delivery as { "ok": true }. */
const INQUIRY_ENDPOINT = '';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const ownedHeroAnimations = new Set();
document.querySelector('#year') && (document.querySelector('#year').textContent = new Date().getFullYear());

document.documentElement.classList.add('js');
const menu = document.querySelector('.mobile-menu');
const menuSummary = menu.querySelector('button');
const menuNavigation = menu.querySelector('nav');
menuSummary.hidden = false;
function setMenu(open) { menuSummary.setAttribute('aria-expanded', String(open)); menuNavigation.hidden = !open; }
setMenu(false);
menuSummary.addEventListener('click', () => setMenu(menuSummary.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuSummary.getAttribute('aria-expanded') === 'true') { setMenu(false); menuSummary.focus(); } });
document.addEventListener('click', event => { if (!menu.contains(event.target)) setMenu(false); });

document.querySelectorAll('.faq-list details, .project-details').forEach(detail => {
  let animation;
  detail.addEventListener('toggle', () => {
    animation?.cancel();
    if (detail.open && !reducedMotion.matches) animation = detail.querySelector('.disclosure-content').animate([{ opacity: .35 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) animation?.cancel(); });
});
function openHashDetail() { const element = document.getElementById(location.hash.slice(1)); if (element?.matches('.project-details')) element.open = true; }
addEventListener('hashchange', openHashDetail); openHashDetail();

function configureInquiry(form, endpoint, send = fetch) {
  const button = form.querySelector('button[type="submit"]');
  const note = form.querySelector('#form-note');
  const status = form.querySelector('[role="status"]');
  let pending = false;
  const available = /^https:\/\//.test(endpoint);
  button.disabled = !available;
  note.textContent = available ? 'Your details will be used to respond to your project inquiry.' : 'Inquiries are currently unavailable. This form cannot send messages.';
  const submit = async event => {
    event.preventDefault();
    if (pending) return;
    if (!available) { status.textContent = 'Inquiries are currently unavailable. This form cannot send messages.'; return; }
    if (!form.reportValidity()) return;
    pending = true; button.disabled = true; form.setAttribute('aria-busy', 'true'); status.textContent = 'Sending inquiry…';
    try {
      const response = await send(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json();
      if (!response.ok || result?.ok !== true) throw new Error('Delivery not confirmed');
      status.textContent = 'Your inquiry has been sent. Thank you for getting in touch.'; form.reset();
    } catch { status.textContent = 'We could not confirm delivery. Please try again later.'; }
    finally { pending = false; button.disabled = false; form.removeAttribute('aria-busy'); }
  };
  form.addEventListener('submit', submit);
  return () => form.removeEventListener('submit', submit);
}
const inquiryForm = document.querySelector('#inquiry_form');
if (inquiryForm) configureInquiry(inquiryForm, INQUIRY_ENDPOINT);

// Screenshot viewer: every a[data-zoom] on the page is one sequence. Without JS the links open the full image.
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const shots = [...document.querySelectorAll('a[data-zoom]')];
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  const count = lightbox.querySelector('.lightbox-count');
  let index = 0;
  const show = i => {
    index = (i + shots.length) % shots.length;
    const shot = shots[index], thumb = shot.querySelector('img');
    image.src = shot.href; image.alt = thumb.alt;
    caption.textContent = shot.dataset.zoom || thumb.alt;
    count.textContent = (index + 1) + ' / ' + shots.length;
  };
  shots.forEach((shot, i) => shot.addEventListener('click', event => { event.preventDefault(); show(i); lightbox.showModal(); }));
  lightbox.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
  lightbox.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
}

function installReferenceReveals(root = document) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  const elements = [...root.querySelectorAll('[data-reveal]')];
  const finish = element => { element.dataset.revealPlayed = 'true'; animations.get(element)?.cancel(); animations.delete(element); };
  const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target; observer.unobserve(element); element.dataset.revealPlayed = 'true';
      if (reduced.matches || document.visibilityState === 'hidden' || entry.boundingClientRect.bottom <= 0) finish(element);
      else animations.get(element)?.play();
    }
  }, { threshold: 0, rootMargin: '0px 0px 96px 0px' }) : undefined;
  const stop = () => { observer?.disconnect(); elements.forEach(finish); };
  const onPreference = () => { if (reduced.matches) stop(); };
  reduced.addEventListener('change', onPreference);
  for (const element of elements) {
    if (element.dataset.revealPlayed === 'true') continue;
    const rect = element.getBoundingClientRect();
    if (reduced.matches || !observer || !element.animate || rect.top < innerHeight || document.visibilityState === 'hidden') { finish(element); continue; }
    const type = element.dataset.reveal;
    const transform = type === 'slide' ? 'translateX(-10px)' : type === 'rise' ? 'translateY(20px)' : 'none';
    const frames = type === 'emphasis' ? [{ color: '#a5a49f' }, { color: '#eae7de' }] : [{ opacity: 0, transform }, { opacity: 1, transform: 'none' }];
    const animation = element.animate(frames, { duration: Number(element.dataset.duration || 600), delay: Math.min(240, Number(element.dataset.delay || 0)), easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'backwards' });
    animation.pause(); animation.onfinish = () => finish(element); animations.set(element, animation); observer.observe(element);
  }
  // Finish groups skipped by a fast jump, including paused animations behind the viewport.
  const settlePassed = () => { for (const [element] of animations) if (element.getBoundingClientRect().bottom < 0) { observer?.unobserve(element); finish(element); } };
  addEventListener('scroll', settlePassed, { passive: true });
  const onVisibility = () => { if (document.visibilityState === 'hidden') stop(); };
  document.addEventListener('visibilitychange', onVisibility);
  return () => { stop(); reduced.removeEventListener('change', onPreference); removeEventListener('scroll', settlePassed); document.removeEventListener('visibilitychange', onVisibility); };
}
const cleanupReveals = installReferenceReveals();
function playHero() {
  if (reducedMotion.matches || scrollY > 20 || document.visibilityState === 'hidden') return;
  const elements = [...document.querySelectorAll('[data-hero]')];
  elements.forEach((element, i) => {
    // The page may already have painted: use transform only, never hide it late.
    const animation = element.animate([{ transform: 'translateY(' + (element.matches('figure') ? 20 : 14) + 'px)' }, { transform: 'none' }], { duration: element.matches('figure') ? 750 : 600, delay: [0,80,120,160,180][i], easing: 'cubic-bezier(0.22,1,0.36,1)' });
    ownedHeroAnimations.add(animation); animation.onfinish = () => { ownedHeroAnimations.delete(animation); animation.cancel(); };
  });
}
playHero();
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { ownedHeroAnimations.forEach(animation => animation.cancel()); ownedHeroAnimations.clear(); } });
addEventListener('pagehide', () => { cleanupReveals(); ownedHeroAnimations.forEach(animation => animation.cancel()); });
