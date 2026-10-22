'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll tour of Lampara: a live HTML rebuild of the CRM dashboard (not a screenshot), pinned while the page
// scrolls so its parts can move on their own. Beat 1: the app arrives, the sidebar slides in, the stats count up.
// The mock is laid out at a fixed 1280×800 and scaled to fit, so it keeps the real app's proportions at any width.
// Without JS or with reduced motion it renders in its finished state.

const W = 1280;

const nav = [
  { label: 'Dashboard', icon: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z' },
  { label: 'Projects', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { label: 'Quotes', icon: 'M6 2h12v20H6zM9 7h6M9 11h6M9 15h3' },
  { label: 'Calendar', icon: 'M3 5h18v16H3zM16 3v4M8 3v4M3 10h18' },
  { label: 'Warehouse', icon: 'M3 9l9-6 9 6v12H3zM9 21v-6h6v6' },
  { label: 'HR', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1' },
];

const stats = [
  { value: 128, label: 'Total Projects' },
  { value: 37, label: 'Active Pipeline' },
  { value: 52, label: 'Contracts Signed' },
  { value: 41, label: 'Installations' },
];

// Stage pills use the CRM's approved stage colours.
const projects = [
  { name: 'Maria Santos', city: 'Antipolo City', stage: 'Inspection Scheduled', pill: 'bg-[#e6f0fb] text-[#1d5fa8]', when: '2d ago' },
  { name: 'Juan Dela Cruz', city: 'Quezon City', stage: 'New Lead', pill: 'bg-[#f1f1f0] text-[#2b2b2b]', when: '3d ago' },
  { name: 'Liza Fernandez', city: 'Marikina City', stage: 'Cancelled', pill: 'bg-[#fbe9e9] text-[#b42323]', when: '5d ago' },
  { name: 'Pedro Reyes', city: 'Dasmariñas', stage: 'Proposal Sent', pill: 'bg-[#f7efdc] text-[#8a5a0b]', when: '6d ago' },
  { name: 'Ana Gonzales', city: 'Los Baños', stage: 'Contract Signed', pill: 'bg-[#f1e9fb] text-[#6b3fb0]', when: '15d ago' },
  { name: 'Ricardo Bautista', city: 'Lipa City', stage: 'Active Customer', pill: 'bg-[#e5f4ea] text-[#1f7a43]', when: '25d ago' },
  { name: 'Carmela Villanueva', city: 'Calamba', stage: 'Installation', pill: 'bg-[#e1f3f1] text-[#11695f]', when: '28d ago' },
];

function Icon({ d, className = 'size-[18px]' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={d} />
    </svg>
  );
}

export default function LamparaTour() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current!;
    const frame = section.querySelector<HTMLElement>('[data-tour-frame]')!;
    const fit = () => frame.style.setProperty('--s', String(frame.clientWidth / W));
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    fit();

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: section, start: 'top top', end: '+=180%', pin: true, scrub: 0.6 },
      });

      tl.fromTo(q('[data-tour-app]'),
        { scale: 0.62, y: 90, opacity: 0.25, clipPath: 'inset(8% 10% 8% 10% round 18px)' },
        { scale: 1, y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 10px)', duration: 1 })
        .from(q('[data-tour-side]'), { xPercent: -100, duration: 0.6 }, 0.55)
        .from(q('[data-tour-nav]'), { x: -24, opacity: 0, stagger: 0.06, duration: 0.35 }, 0.75)
        .from(q('[data-tour-head]'), { y: 24, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.8)
        .from(q('[data-tour-stat]'), { y: 40, opacity: 0, stagger: 0.1, duration: 0.45 }, 1.05);

      // Count each stat from 0 while its card rises; textContent keeps the server-rendered final value as the fallback.
      q('[data-tour-count]').forEach((el, i) => {
        const counter = { v: 0 };
        tl.to(counter, { v: stats[i].value, duration: 0.7, ease: 'power1.out', onUpdate: () => { el.textContent = String(Math.round(counter.v)); } }, 1.1 + i * 0.1);
      });

      tl.from(q('[data-tour-row]'), { y: 30, opacity: 0, stagger: 0.07, duration: 0.4 }, 1.5)
        .to({}, { duration: 0.3 }); // short hold on the finished dashboard before the pin releases
    });

    return () => { mm.revert(); ro.disconnect(); };
  }, []);

  return (
    <section ref={root} id="tour" aria-labelledby="tour-title" className="flex min-h-svh flex-col justify-center overflow-hidden py-10">
      <div className="mx-auto w-[calc(100%_-_112px)] max-w-360 max-lg:md:w-[calc(100%_-_64px)] max-md:w-[calc(100%_-_40px)]">
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted">01 · Lampara CRM</p>
        <h2 id="tour-title" className="mt-3 mb-8 max-md:mb-6 text-[length:clamp(36px,4vw,60px)]">the whole business, at a glance.</h2>

        <div data-tour-frame="" className="relative mx-auto aspect-[16/10] max-h-[68svh] w-full max-w-[min(100%,calc(68svh*1.6))]">
          <div data-tour-app="" className="absolute inset-0 overflow-hidden rounded-[10px] border border-line bg-[#fafafa] will-change-transform">
            {/* Fixed-size app, scaled to the frame width by --s. */}
            <div className="absolute top-0 left-0 flex h-[800px] w-[1280px] origin-top-left text-[#141414] [transform:scale(var(--s,0.5))]" style={{ fontFeatureSettings: '"tnum"' }}>
              <aside data-tour-side="" className="flex w-[232px] shrink-0 flex-col border-r border-[#e7e7e5] bg-[#fafafa] px-2.5 pt-4">
                <div className="mb-5 flex items-center gap-2.5 px-2">
                  <span className="grid size-9 place-items-center rounded-[8px] border border-[#e7e7e5] bg-[#fff] text-[15px] font-semibold">L</span>
                  <span className="leading-tight"><b className="block text-[14px] font-medium">Lampara</b><span className="text-[12px] text-[#6b6b6b]">CRM · powered by Lampara</span></span>
                </div>
                {nav.map((item, i) => (
                  <div key={item.label} data-tour-nav="" className={`mb-0.5 flex items-center gap-3 rounded-[8px] px-3 py-2 text-[14px] ${i === 0 ? 'bg-[#141414] text-[#fff]' : 'text-[#2b2b2b]'}`}>
                    <Icon d={item.icon} /> {item.label}
                  </div>
                ))}
              </aside>

              <main className="flex-1 px-7 pt-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p data-tour-head="" className="text-[26px] font-semibold tracking-[-0.03em]">Good evening, Olivia</p>
                    <p data-tour-head="" className="mt-1 text-[14px] text-[#6b6b6b]">Here’s what’s happening at Lampara today.</p>
                  </div>
                  <span data-tour-head="" className="rounded-[8px] bg-[#141414] px-4 py-2 text-[13px] font-medium text-[#fff]">+ New Project</span>
                </div>

                <div className="mt-7 grid grid-cols-4 overflow-hidden rounded-[12px] border border-[#e7e7e5] bg-[#fff]">
                  {stats.map((s, i) => (
                    <div key={s.label} data-tour-stat="" className={`px-5 py-5 ${i ? 'border-l border-[#e7e7e5]' : ''}`}>
                      <p data-tour-count="" className="text-[28px] font-semibold tracking-[-0.03em]">{s.value}</p>
                      <p className="mt-1 text-[13px] text-[#6b6b6b]">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 overflow-hidden rounded-[12px] border border-[#e7e7e5] bg-[#fff]">
                  <p className="border-b border-[#e7e7e5] px-5 py-4 text-[16px] font-medium">Recent Projects</p>
                  {projects.map(p => (
                    <div key={p.name} data-tour-row="" className="grid grid-cols-[1.3fr_1fr_auto] items-center border-b border-[#efefed] px-5 py-3 last:border-0">
                      <span className="leading-tight"><span className="block text-[14px]">{p.name}</span><span className="text-[12px] text-[#6b6b6b]">{p.city}</span></span>
                      <span><span className={`rounded-full px-2.5 py-1 text-[12px] ${p.pill}`}>{p.stage}</span></span>
                      <span className="text-[13px] text-[#6b6b6b]">{p.when}</span>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </div>
        <p className="pt-3.5 font-mono text-[10px] text-muted">Rebuilt from the Lampara CRM dashboard · Demo data</p>
      </div>
    </section>
  );
}
