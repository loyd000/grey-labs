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

// Beat 3: the last items of the CRM's QA/QC checklist, as the field tech ticks them on site.
const checklist = [
  ['Inverter powered on successfully', 'Matagumpay na na-power on ang inverter'],
  ['No fault or alarm displayed', 'Walang fault o alarm na ipinapakita'],
  ['Monitoring system connected', 'Nakakonekta ang monitoring system'],
  ['Voltage and current checked', 'Nasuri ang boltahe at kuryente'],
  ['Final cleaning completed', 'Nakumpleto ang huling paglilinis'],
  ['Photos taken for documentation', 'Kumuha ng mga larawan para sa dokumentasyon'],
];
const TOTAL_ITEMS = 43;
const answered = (ticked: number) => TOTAL_ITEMS - checklist.length + ticked;
const sync = {
  offline: { text: 'Offline · saved on this phone', style: pill(hue.warning) },
  synced: { text: 'Synced to the office', style: pill(hue.success) },
};

const rowClass ='grid grid-cols-[1.3fr_1fr_auto] items-center px-5 py-3';

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
        scrollTrigger: { trigger: section, start: 'top top', end: '+=520%', pin: true, scrub: 0.6 },
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
        .to({}, { duration: 0.3 });

      // Beat 3: the dashboard steps back to the left and dims, the field tech's phone slides up beside it,
      // the checklist ticks off, then the offline report syncs and the dashboard row picks it up.
      const checks = q('[data-tour-check]');
      const countEl = q('[data-tour-answered]')[0];
      const barEl = q('[data-tour-bar]')[0];
      const syncEl = q('[data-tour-sync]')[0];
      const activityEl = q('[data-tour-activity]')[0];
      const setChecks = (n: number) => {
        checks.forEach((el, i) => { el.dataset.on = String(i < n); });
        countEl.textContent = String(answered(n));
        barEl.style.width = `${(answered(n) / TOTAL_ITEMS) * 100}%`;
      };
      const setSynced = (on: boolean) => {
        const s = on ? sync.synced : sync.offline;
        syncEl.textContent = s.text; Object.assign(syncEl.style, s.style);
        activityEl.textContent = on ? 'Checklist synced' : 'just now';
      };
      setChecks(0); setSynced(false); // the markup holds the finished state for no-JS; start from the top here

      tl.addLabel('beat3')
        .to(q('[data-tour-beat="2"]'), { y: -30, opacity: 0, duration: 0.35 }, 'beat3')
        .fromTo(q('[data-tour-beat="3"]'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, 'beat3+=0.15')
        .to(q('[data-tour-app]'), { xPercent: -9, scale: 0.8, opacity: 0.55, duration: 0.7, ease: 'power2.inOut' }, 'beat3')
        .fromTo(q('[data-tour-phone]'), { yPercent: 115, rotate: 6 }, {
          yPercent: 0, rotate: 0, duration: 0.7, ease: 'power3.out',
          onStart: () => { setChecks(0); setSynced(false); },
        }, 'beat3+=0.25');
      const ticked = { v: 0 };
      tl.to(ticked, { v: checklist.length, duration: 1.8, ease: 'none', onUpdate: () => setChecks(Math.floor(ticked.v + 0.001)) }, '>+0.1');
      const synced = { v: 0 };
      tl.to(synced, { v: 1, duration: 0.4, ease: 'none', onUpdate: () => setSynced(synced.v > 0.5) }, '>+0.2')
        // The phone covers the row's activity column, so the sync shows as a green flash on the whole row.
        // rgba, not color-mix(): GSAP can only interpolate plain colours (this is the success hue in sRGB).
        .fromTo(q('[data-tour-new]'), { backgroundColor: 'rgba(48,168,96,0)' }, { backgroundColor: 'rgba(48,168,96,0.2)', duration: 0.25 }, '<+0.2')
        .to(q('[data-tour-new]'), { backgroundColor: 'rgba(48,168,96,0)', duration: 0.4 })
        .to({}, { duration: 0.5 }); // hold on the finished scene before the pin releases
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
          <span data-tour-beat="3" className="opacity-0 [grid-area:1/1]">
            <span className="mb-3 block font-mono text-[11px] font-normal tracking-[0.08em] text-muted">03 · On site</span>
            checked on site, synced to the office.
          </span>
        </h2>

        <div data-tour-frame="" className="relative mx-auto aspect-[16/10] max-h-[68svh] w-full max-w-[min(100%,calc(68svh*1.6))]">
          {/* Without the scroll animation the app sits in its beat-3 place (stepped back, beside the phone). */}
          <div data-tour-app="" className="absolute inset-0 overflow-hidden rounded-[10px] border border-line opacity-55 will-change-transform [transform:translateX(-9%)_scale(.8)] [html.js_&]:motion-safe:opacity-100 [html.js_&]:motion-safe:[transform:none]" style={{ background: c.bg }}>
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
                      <span data-tour-activity="" className="text-[13px]" style={{ color: c.mutedFg }}>Checklist synced</span>
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

          {/* The field tech's phone: a 330×700 screen in the same scaled units as the app, so it lines up at any width. */}
          <div data-tour-phone="" className="absolute right-[calc(var(--s,0.5)*70px)] top-[calc(var(--s,0.5)*44px)] h-[calc(var(--s,0.5)*712px)] w-[calc(var(--s,0.5)*346px)]">
            <div className="h-[712px] w-[346px] origin-top-left rounded-[44px] border-[8px] border-[#2a2a2a] bg-[#0b0b0b] p-[3px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)] [transform:scale(var(--s,0.5))]">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[34px] px-5 pt-3" style={{ background: c.bg, color: c.fg, fontFeatureSettings: '"tnum"' }}>
                <div className="flex items-center justify-between px-2 text-[12px] font-medium">
                  <span>4:12</span>
                  <span className="h-[22px] w-[86px] rounded-full bg-[#000]" />
                  <span style={{ color: c.mutedFg }}>4G</span>
                </div>
                <p className="mt-5 text-[12px]" style={{ color: c.mutedFg }}>← Jose Mercado · Bacoor</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">QA/QC Checklist</p>
                <p className="mt-1 text-[12px]" style={{ color: c.mutedFg }}><span data-tour-answered="">{TOTAL_ITEMS}</span> of {TOTAL_ITEMS} items answered</p>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full" style={{ background: c.muted }}>
                  <div data-tour-bar="" className="h-full w-full rounded-full" style={{ background: hue.success }} />
                </div>

                <div className="mt-4 overflow-hidden rounded-[12px] border" style={{ background: c.card, borderColor: c.border }}>
                  {checklist.map(([en, tl], i) => (
                    <div key={en} data-tour-check="" data-on="true" className="group flex gap-3 px-3.5 py-3" style={i ? { borderTop: `1px solid ${c.border}` } : undefined}>
                      <span className="relative mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border border-dashed group-data-[on=true]:border-solid" style={{ borderColor: c.mutedFg }}>
                        <span className="absolute inset-[-1px] grid place-items-center rounded-full opacity-0 transition-opacity duration-150 group-data-[on=true]:opacity-100" style={{ background: hue.success, color: c.bg }}>
                          <Icon d="M5 12l5 5L20 7" className="size-[12px]" />
                        </span>
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[13px]">{en}</span>
                        <span className="text-[11px]" style={{ color: c.mutedFg }}>{tl}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <span data-tour-sync="" className="mx-auto mt-auto mb-6 rounded-full px-3 py-1.5 text-[12px]" style={sync.synced.style}>{sync.synced.text}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-3.5 font-mono text-[10px] text-muted">Rebuilt from the Lampara CRM dashboard · Demo data</p>
      </div>
    </section>
  );
}
