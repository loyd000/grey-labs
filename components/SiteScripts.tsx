'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* Configure only with an HTTPS service that confirms accepted delivery as { "ok": true }. */
const INQUIRY_ENDPOINT = '';
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

// Ported from the static site's script.js. Re-runs per route; every listener is tied to one AbortSignal.
export default function SiteScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const ac = new AbortController();
    const signal = ac.signal;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const owned = new Set<Animation>();
    document.documentElement.classList.add('js');

    // Disclosures fade their content in when opened.
    document.querySelectorAll<HTMLDetailsElement>('details').forEach(detail => {
      let animation: Animation | undefined;
      detail.addEventListener('toggle', () => {
        animation?.cancel();
        const content = detail.querySelector('summary + *');
        if (detail.open && !reduced.matches && content) animation = content.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
      }, { signal });
    });
    const openHashDetail = () => { const element = location.hash && document.getElementById(location.hash.slice(1)); if (element instanceof HTMLDetailsElement) element.open = true; };
    addEventListener('hashchange', openHashDetail, { signal }); openHashDetail();

    // Inquiry form stays disabled until INQUIRY_ENDPOINT is an HTTPS service.
    const form = document.querySelector<HTMLFormElement>('#inquiry_form');
    if (form) {
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      const note = form.querySelector('#form-note')!;
      const status = form.querySelector('[role="status"]')!;
      const available = /^https:\/\//.test(INQUIRY_ENDPOINT);
      let pending = false;
      button.disabled = !available;
      note.textContent = available ? 'Your details will be used to respond to your project inquiry.' : 'Inquiries are currently unavailable. This form cannot send messages.';
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (pending) return;
        if (!available) { status.textContent = 'Inquiries are currently unavailable. This form cannot send messages.'; return; }
        if (!form.reportValidity()) return;
        pending = true; button.disabled = true; form.setAttribute('aria-busy', 'true'); status.textContent = 'Sending inquiry…';
        try {
          const response = await fetch(INQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
          const result = await response.json();
          if (!response.ok || result?.ok !== true) throw new Error('Delivery not confirmed');
          status.textContent = 'Your inquiry has been sent. Thank you for getting in touch.'; form.reset();
        } catch { status.textContent = 'We could not confirm delivery. Please try again later.'; }
        finally { pending = false; button.disabled = false; form.removeAttribute('aria-busy'); }
      }, { signal });
    }

    // Screenshot viewer: every a[data-zoom] on the page is one sequence. Without JS the links open the full image.
    const lightbox = document.querySelector<HTMLDialogElement>('dialog');
    if (lightbox) {
      const shots = [...document.querySelectorAll<HTMLAnchorElement>('a[data-zoom]')];
      const image = lightbox.querySelector('img')!;
      const caption = lightbox.querySelector('figcaption')!;
      const count = lightbox.querySelector('[data-count]')!;
      let index = 0;
      const show = (i: number) => {
        index = (i + shots.length) % shots.length;
        const shot = shots[index], thumb = shot.querySelector('img');
        image.src = shot.href; image.alt = thumb?.alt ?? '';
        caption.textContent = shot.dataset.zoom || thumb?.alt || '';
        count.textContent = (index + 1) + ' / ' + shots.length;
      };
      shots.forEach((shot, i) => shot.addEventListener('click', event => { event.preventDefault(); show(i); lightbox.showModal(); }, { signal }));
      lightbox.querySelector('[data-prev]')!.addEventListener('click', () => show(index - 1), { signal });
      lightbox.querySelector('[data-next]')!.addEventListener('click', () => show(index + 1), { signal });
      lightbox.querySelector('[data-close]')!.addEventListener('click', () => lightbox.close(), { signal });
      lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); }, { signal });
      lightbox.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') show(index - 1);
        if (event.key === 'ArrowRight') show(index + 1);
      }, { signal });
    }

    // Scroll reveals: content defaults to visible; animations only play for elements still below the fold.
    const animations = new Map<HTMLElement, Animation>();
    const finish = (element: HTMLElement) => { element.dataset.revealPlayed = 'true'; animations.get(element)?.cancel(); animations.delete(element); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement; observer.unobserve(element); element.dataset.revealPlayed = 'true';
        if (reduced.matches || document.visibilityState === 'hidden' || entry.boundingClientRect.bottom <= 0) finish(element);
        else animations.get(element)?.play();
      }
    }, { threshold: 0, rootMargin: '0px 0px 96px 0px' });
    for (const element of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
      if (element.dataset.revealPlayed === 'true') continue;
      if (reduced.matches || element.getBoundingClientRect().top < innerHeight || document.visibilityState === 'hidden') { finish(element); continue; }
      const type = element.dataset.reveal;
      const transform = type === 'slide' ? 'translateX(-10px)' : type === 'rise' ? 'translateY(20px)' : 'none';
      const frames = type === 'emphasis' ? [{ color: '#a5a49f' }, { color: '#eae7de' }] : [{ opacity: 0, transform }, { opacity: 1, transform: 'none' }];
      const animation = element.animate(frames, { duration: Number(element.dataset.duration || 600), delay: Math.min(240, Number(element.dataset.delay || 0)), easing: EASE, fill: 'backwards' });
      animation.pause(); animation.onfinish = () => finish(element); animations.set(element, animation); observer.observe(element);
    }
    // Finish groups skipped by a fast jump, including paused animations behind the viewport.
    addEventListener('scroll', () => { for (const [element] of animations) if (element.getBoundingClientRect().bottom < 0) { observer.unobserve(element); finish(element); } }, { passive: true, signal });
    const stopReveals = () => { observer.disconnect(); [...animations.keys()].forEach(finish); };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') stopReveals(); }, { signal });

    // Hero entrance: transform only, so already-painted content is never hidden late.
    if (!reduced.matches && scrollY <= 20 && document.visibilityState !== 'hidden') {
      document.querySelectorAll<HTMLElement>('[data-hero]').forEach((element, i) => {
        const figure = element.matches('figure');
        const animation = element.animate([{ transform: `translateY(${figure ? 20 : 14}px)` }, { transform: 'none' }], { duration: figure ? 750 : 600, delay: [0, 80, 120, 160, 180][i] ?? 180, easing: EASE });
        owned.add(animation); animation.onfinish = () => { owned.delete(animation); animation.cancel(); };
      });
    }
    const cancelOwned = () => { owned.forEach(animation => animation.cancel()); owned.clear(); };
    reduced.addEventListener('change', () => { if (reduced.matches) { stopReveals(); cancelOwned(); } }, { signal });

    return () => { ac.abort(); stopReveals(); cancelOwned(); };
  }, [pathname]);

  return null;
}
