'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll-scrubbed reveal for screenshots, in step with the ScrollReveal text: screens open from a clipped,
// slightly smaller frame as they rise to mid-screen; phones rise from lower down with a small tilt, so they trail.
// Targets: every zoomable screenshot (a[data-zoom]) and anything marked data-media-reveal ("phone" for phones).
// The animated element must not have its own CSS transform transition (it would lag the scrub).
export default function MediaReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      for (const el of document.querySelectorAll<HTMLElement>('a[data-zoom], [data-media-reveal]')) {
        // Already on screen at load (e.g. a case-study cover): show it as is rather than start it clipped.
        if (el.getBoundingClientRect().top < innerHeight * 0.9) continue;
        const phone = el.dataset.mediaReveal === 'phone';
        // clamp() keeps screenshots near the page end reachable, so they always finish revealing.
        const scrollTrigger = { trigger: el, start: 'top bottom', end: 'clamp(top 45%)', scrub: true };
        if (phone) {
          // No sideways travel: the phone sits on the right edge and would push the page wider on mobile.
          gsap.fromTo(el, { y: 140, rotate: 5, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, ease: 'none', scrollTrigger });
        } else {
          // Ends at a negative inset so nothing (shadows, hover lift) stays clipped once revealed.
          gsap.fromTo(el,
            { y: 70, scale: 0.92, opacity: 0.3, clipPath: 'inset(10% 6% 10% 6% round 14px)' },
            { y: 0, scale: 1, opacity: 1, clipPath: 'inset(-10% -10% -10% -10% round 0px)', ease: 'none', scrollTrigger });
        }
      }
    });
    return () => mm.revert();
  }, [pathname]);

  return null;
}
