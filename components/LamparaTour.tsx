'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll tour of Lampara: a live HTML rebuild of the CRM dashboard (not a screenshot), pinned while the page
// scrolls so its parts can move on their own.
//   Beat 1: the app arrives, the sidebar slides in, the stats count up, the recent projects fill in.
//   Beat 2: a new project is added and its stage pill walks the pipeline, moving the stats as it goes.
// The mock is laid out at a fixed 1280×800 and scaled to fit, so it keeps the real app's proportions at any width.
// Without JS or with reduced motion it renders in its finished (end of beat 2) state.
// Colours are the CRM's own dark theme (.dark in Lampara's src/index.css) and its STAGE_COLORS map.

const W = 1280;

const c = {
  bg: 'oklch(0.145 0 0)', card: 'oklch(0.205 0 0)', muted: 'oklch(0.269 0 0)',
  fg: 'oklch(0.985 0 0)', mutedFg: 'oklch(0.708 0 0)', primary: 'oklch(0.922 0 0)', primaryFg: 'oklch(0.205 0 0)',
  border: 'oklch(1 0 0 / 10%)',
};

// Stage pill = the stage hue at 10% behind the hue itself, as STAGE_COLORS does with bg-x/10 text-x.
const hue = { info: 'oklch(0.672 0.13 255)', warning: 'oklch(0.678 0.146 70)', contract: 'oklch(0.687 0.15 303)', install: 'oklch(0.76 0.135 50)', success: 'oklch(0.653 0.15 152)', danger: 'oklch(0.687 0.17 27)' };
const pill = (h?: string) => h ? { background: `color-mix(in oklch, ${h} 10%, transparent)`, color: h } : { background: c.muted, color: c.fg };

const nav = [
  { label: 'Dashboard', icon: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z' },
  { label: 'Projects', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { label: 'Quotes', icon: 'M6 2h12v20H6zM9 7h6M9 11h6M9 15h3' },
  { label: 'Calendar', icon: 'M3 5h18v16H3zM16 3v4M8 3v4M3 10h18' },
  { label: 'Warehouse', icon: 'M3 9l9-6 9 6v12H3zM9 21v-6h6v6' },
  { label: 'HR', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1' },
];

// The stage the new project walks through in beat 2, in pipeline order.
const journey = [
  { stage: 'New Lead' },
  { stage: 'Survey Scheduled', h: hue.info },
  { stage: 'Proposal Sent', h: hue.warning },
  { stage: 'Contract Signed', h: hue.contract },
  { stage: 'Installation Scheduled', h: hue.install },
  { stage: 'Active Customer', h: hue.success },
];
const last = journey.length - 1;

// base = what beat 1 counts up to; now(added, step) = the value once the new project exists and is at `step`.
const stats = [
  { label: 'Total Projects', base: 128, now: (added: boolean) => 128 + +added },
  { label: 'Active Pipeline', base: 37, now: (added: boolean, step: number) => 37 + +(added && step < last) },
  { label: 'Contracts Signed', base: 52, now: (added: boolean, step: number) => 52 + +(added && step >= 3) },
  { label: 'Installations', base: 41, now: (added: boolean, step: number) => 41 + +(added && step >= last) },
];

const projects = [
  { name: 'Maria Santos', city: 'Antipolo City', stage: 'Inspection Scheduled', h: hue.info, when: '2d ago' },
  { name: 'Juan Dela Cruz', city: 'Quezon City', stage: 'New Lead', when: '3d ago' },
  { name: 'Liza Fernandez', city: 'Marikina City', stage: 'Cancelled', h: hue.danger, when: '5d ago' },
  { name: 'Pedro Reyes', city: 'Dasmariñas', stage: 'Proposal Sent', h: hue.warning, when: '6d ago' },
  { name: 'Ana Gonzales', city: 'Los Baños', stage: 'Contract Signed', h: hue.contract, when: '15d ago' },
  { name: 'Ricardo Bautista', city: 'Lipa City', stage: 'Active Customer', h: hue.success, when: '25d ago' },
];

const rowClass = 'grid grid-cols-[1.3fr_1fr_auto] items-center px-5 py-3';

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
      const counts = q('[data-tour-count]');
      const pillEl = q('[data-tour-pill]')[0];
      const setStats = (added: boolean, step: number) => counts.forEach((el, i) => { el.textContent = String(stats[i].now(added, step)); });
      const setStage = (step: number) => { pillEl.textContent = journey[step].stage; Object.assign(pillEl.style, pill(journey[step].h)); };

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: section, start: 'top top', end: '+=360%', pin: true, scrub: 0.6 },
      });

      // Beat 1
      tl.fromTo(q('[data-tour-app]'),
        { scale: 0.62, y: 90, opacity: 0.25, clipPath: 'inset(8% 10% 8% 10% round 18px)' },
        { scale: 1, y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 10px)', duration: 1 })
        .from(q('[data-tour-side]'), { xPercent: -100, duration: 0.6 }, 0.55)
        .from(q('[data-tour-nav]'), { x: -24, opacity: 0, stagger: 0.06, duration: 0.35 }, 0.75)
        .from(q('[data-tour-head]'), { y: 24, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.8)
        .from(q('[data-tour-stat]'), { y: 40, opacity: 0, stagger: 0.1, duration: 0.45 }, 1.05);
      // Count each stat from 0 while its card rises; the server-rendered text is the finished state for no-JS.
      counts.forEach((el, i) => {
        const counter = { v: 0 };
        tl.to(counter, { v: stats[i].base, duration: 0.7, ease: 'power1.out', onUpdate: () => { el.textContent = String(Math.round(counter.v)); } }, 1.1 + i * 0.1);
      });
      tl.from(q('[data-tour-row]'), { y: 30, opacity: 0, stagger: 0.07, duration: 0.4 }, 1.5)
        .to({}, { duration: 0.4 });

      // Beat 2: the caption swaps, "New Project" is pressed, the project row opens at the top of the list
      // and its stage pill steps through the pipeline while the stats follow.
      tl.addLabel('beat2')
        .to(q('[data-tour-beat="1"]'), { y: -30, opacity: 0, duration: 0.35 }, 'beat2')
        .fromTo(q('[data-tour-beat="2"]'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, 'beat2+=0.15')
        .to(q('[data-tour-new-btn]'), { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 'beat2+=0.3')
        .fromTo(q('[data-tour-new]'), { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.45,
          onStart: () => { setStage(0); },
          onUpdate() { setStats(this.progress() > 0.5, 0); },
        }, 'beat2+=0.6');
      const step = { v: 0 };
      tl.to(step, {
        v: last, duration: 2.2, ease: 'none',
        onUpdate: () => { const s = Math.round(step.v); setStage(s); setStats(true, s); },
      }, '>+0.15')
        .to(q('[data-tour-new]'), { backgroundColor: 'oklch(1 0 0 / 0%)', duration: 0.4 })
        .to({}, { duration: 0.4 }); // hold on the finished dashboard before the pin releases
    });

    return () => { mm.revert(); ro.disconnect(); };
  }, []);

  const done = journey[last];

  return (
    <section ref={root} id="tour" aria-labelledby="tour-title" className="flex min-h-svh flex-col justify-center overflow-hidden py-10">
      <div className="mx-auto w-[calc(100%_-_112px)] max-w-360 max-lg:md:w-[calc(100%_-_64px)] max-md:w-[calc(100%_-_40px)]">
        {/* Both beats' captions share one grid cell so they can cross over. Without JS only the first shows. */}
        <h2 id="tour-title" className="mb-8 grid text-[length:clamp(36px,4vw,60px)] max-md:mb-6">
          <span data-tour-beat="1" className="[grid-area:1/1]">
            <span className="mb-3 block font-mono text-[11px] font-normal tracking-[0.08em] text-muted">01 · Lampara CRM</span>
            the whole business, at a glance.
          </span>
          <span data-tour-beat="2" className="opacity-0 [grid-area:1/1]">
            <span className="mb-3 block font-mono text-[11px] font-normal tracking-[0.08em] text-muted">02 · Projects</span>
            every job, inquiry to install.
          </span>
        </h2>

        <div data-tour-frame="" className="relative mx-auto aspect-[16/10] max-h-[68svh] w-full max-w-[min(100%,calc(68svh*1.6))]">
          <div data-tour-app="" className="absolute inset-0 overflow-hidden rounded-[10px] border border-line will-change-transform" style={{ background: c.bg }}>
            {/* Fixed-size app, scaled to the frame width by --s. */}
            <div className="absolute top-0 left-0 flex h-[800px] w-[1280px] origin-top-left [transform:scale(var(--s,0.5))]" style={{ color: c.fg, fontFeatureSettings: '"tnum"' }}>
              <aside data-tour-side="" className="flex w-[232px] shrink-0 flex-col border-r px-2.5 pt-4" style={{ background: c.card, borderColor: c.border }}>
                <div className="mb-5 flex items-center gap-2.5 px-2">
                  <span className="grid size-9 place-items-center rounded-[8px] border text-[15px] font-semibold" style={{ borderColor: c.border, background: c.muted }}>L</span>
                  <span className="leading-tight"><b className="block text-[14px] font-medium">Lampara</b><span className="text-[12px]" style={{ color: c.mutedFg }}>CRM · powered by Lampara</span></span>
                </div>
                {nav.map((item, i) => (
                  <div key={item.label} data-tour-nav="" className="mb-0.5 flex items-center gap-3 rounded-[8px] px-3 py-2 text-[14px]"
                    style={i === 0 ? { background: c.primary, color: c.primaryFg } : { color: c.mutedFg }}>
                    <Icon d={item.icon} /> {item.label}
                  </div>
                ))}
              </aside>

              <main className="flex-1 px-7 pt-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p data-tour-head="" className="text-[26px] font-semibold tracking-[-0.03em]">Good evening, Olivia</p>
                    <p data-tour-head="" className="mt-1 text-[14px]" style={{ color: c.mutedFg }}>Here’s what’s happening at Lampara today.</p>
                  </div>
                  <span data-tour-head="">
                    <span data-tour-new-btn="" className="inline-block rounded-[8px] px-4 py-2 text-[13px] font-medium" style={{ background: c.primary, color: c.primaryFg }}>+ New Project</span>
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-4 overflow-hidden rounded-[12px] border" style={{ background: c.card, borderColor: c.border }}>
                  {stats.map((s, i) => (
                    <div key={s.label} data-tour-stat="" className="px-5 py-5" style={i ? { borderLeft: `1px solid ${c.border}` } : undefined}>
                      <p data-tour-count="" className="text-[28px] font-semibold tracking-[-0.03em]">{s.now(true, last)}</p>
                      <p className="mt-1 text-[13px]" style={{ color: c.mutedFg }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 overflow-hidden rounded-[12px] border" style={{ background: c.card, borderColor: c.border }}>
                  <p className="px-5 py-4 text-[16px] font-medium">Recent Projects</p>
                  <div data-tour-new="" className="overflow-hidden" style={{ background: 'oklch(1 0 0 / 5%)' }}>
                    <div className={rowClass} style={{ borderTop: `1px solid ${c.border}` }}>
                      <span className="leading-tight"><span className="block text-[14px]">Jose Mercado</span><span className="text-[12px]" style={{ color: c.mutedFg }}>Bacoor</span></span>
                      <span><span data-tour-pill="" className="rounded-full px-2.5 py-1 text-[12px]" style={pill(done.h)}>{done.stage}</span></span>
                      <span className="text-[13px]" style={{ color: c.mutedFg }}>just now</span>
                    </div>
                  </div>
                  {projects.map(p => (
                    <div key={p.name} data-tour-row="" className={rowClass} style={{ borderTop: `1px solid ${c.border}` }}>
                      <span className="leading-tight"><span className="block text-[14px]">{p.name}</span><span className="text-[12px]" style={{ color: c.mutedFg }}>{p.city}</span></span>
                      <span><span className="rounded-full px-2.5 py-1 text-[12px]" style={pill(p.h)}>{p.stage}</span></span>
                      <span className="text-[13px]" style={{ color: c.mutedFg }}>{p.when}</span>
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
