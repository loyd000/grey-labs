'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import * as S from '@/components/tour/scenes';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Scroll tour of Lampara, "one job, one take": Jose Mercado from his first message to the crew's payday.
// Every scene is a layer holding a world (one or more screens from components/tour/scenes.tsx) under a camera.
// A camera is a pan/zoom transform on the world; scenes hand over by zooming through a detail that becomes
// the next scene (chat → New Project button, row → pipeline card, quote chip → quotation, map pin → phone).
// The section pins and the scroll position scrubs one timeline. No-JS / reduced motion shows the finale.

type Cam = { x: number; y: number; z: number };

// Centres scene point (x, y) in the 1280×800 viewport at zoom z. Zoom tweens in log space so it feels even.
function camera(el: HTMLElement, start: Cam) {
  const st = { x: start.x, y: start.y, lz: Math.log(start.z) };
  const apply = () => { const z = Math.exp(st.lz); el.style.transform = `translate(${S.W / 2 - st.x * z}px,${S.H / 2 - st.y * z}px) scale(${z})`; };
  apply();
  return (to: Partial<Cam>, vars: gsap.TweenVars = {}) => {
    const v: gsap.TweenVars = { duration: 1, ease: 'power2.inOut', ...vars, onUpdate: apply };
    if (to.x !== undefined) v.x = to.x;
    if (to.y !== undefined) v.y = to.y;
    if (to.z !== undefined) v.lz = Math.log(to.z);
    return gsap.to(st, v);
  };
}

const centre = { x: S.W / 2, y: S.H / 2, z: 1 };

// The step list beside the stage: one entry per beat, the playing one bright with its bar filling.
const beats = [
  ['A message comes in', 'Jose asks about solar on Messenger, and the reply becomes a project.'],
  ['Every lead in one place', 'The CRM dashboard counts him in next to every other job.'],
  ['Quoted, signed, moving', 'His card rides the pipeline while the quote is built, signed and stamped.'],
  ['Booked, picked, on the road', 'Install day on the calendar, stock picked into the van, route to Bacoor.'],
  ['Checked on site', 'The crew times in, and the checklist and photos sync back to the office.'],
  ['Attendance in, payroll out', 'The cutoff closes, payroll adds itself up and the payslips go out.'],
  ['The whole job, in one place', 'One system from the first message to payday.'],
];

function Layer({ name, w = S.W, h = S.H, cam, children }: { name: string; w?: number; h?: number; cam?: Cam; children: ReactNode }) {
  return (
    <div data-layer={name} className={`absolute inset-0 overflow-hidden ${cam ? '' : 'invisible'}`}>
      <div data-cam="" className="absolute top-0 left-0 origin-top-left" style={{ width: w, height: h, transform: cam && `translate(${S.W / 2 - cam.x * cam.z}px,${S.H / 2 - cam.y * cam.z}px) scale(${cam.z})` }}>
        {children}
      </div>
    </div>
  );
}

export default function LamparaTour() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current!;
    const frame = section.querySelector<HTMLElement>('[data-tour-frame]')!;
    const pinEl = section.querySelector<HTMLElement>('[data-tour-pin]')!;
    const fit = () => frame.style.setProperty('--s', String(frame.clientWidth / S.W));
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    fit();

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const names = ['chat', 'dash', 'pipe', 'quote', 'prep', 'field', 'pay', 'fin'] as const;
      const L = Object.fromEntries(names.map(n => [n, section.querySelector<HTMLElement>(`[data-layer="${n}"]`)!])) as Record<(typeof names)[number], HTMLElement>;
      const all = (l: HTMLElement, s: string) => Array.from(l.querySelectorAll<HTMLElement>(s));
      const one = (l: HTMLElement, s: string) => l.querySelector<HTMLElement>(s)!;
      const camEl = (l: HTMLElement) => one(l, '[data-cam]');
      // Centre of an element in its world's own units, whatever the camera and page scale are right now.
      const pos = (el: Element, l: HTMLElement) => {
        const cam = camEl(l), r = el.getBoundingClientRect(), cr = cam.getBoundingClientRect(), k = cam.offsetWidth / cr.width;
        return { x: (r.left - cr.left + r.width / 2) * k, y: (r.top - cr.top + r.height / 2) * k };
      };
      const text = (el: HTMLElement, t: { text: string; style: object }) => { el.textContent = t.text; Object.assign(el.style, t.style); };

      // Measure everything in its finished layout first, before any tween moves it.
      const btn = pos(one(L.dash, '[data-dash-btn]'), L.dash);
      const newRowAt = pos(one(L.dash, '[data-dash-new]'), L.dash);
      const cardAt = pos(one(L.pipe, '[data-pipe-card]'), L.pipe);
      const chipAt = pos(one(L.pipe, '[data-pipe-quote]'), L.pipe);
      const flies = all(L.prep, '[data-wh-fly]');
      const flyAt = flies.map(el => pos(el, L.prep));
      const vanAt = pos(one(L.prep, '[data-wh-van]'), L.prep);
      const pinA = pos(one(L.prep, '[data-map-pin-a] circle'), L.prep);
      const pinB = pos(one(L.prep, '[data-map-pin-b] circle:last-of-type'), L.prep);
      const dots = all(L.field, '[data-f-dot]');
      const dotAt = pos(dots[0], L.field);
      const officeAt = pos(one(L.field, '[data-f-office-card]'), L.field);
      const slips = all(L.pay, '[data-pay-slip]');
      const slipAt = slips.map(el => pos(el, L.pay));
      const tableAt = pos(one(L.pay, '[data-pay-table]'), L.pay);

      // The markup holds every scene's finished state (for the finale tiles and no-JS); rewind the live ones.
      one(L.chat, '[data-chat-type]').textContent = '';
      all(L.dash, '[data-dash-count]').forEach(el => { el.textContent = '0'; });
      one(L.quote, '[data-q-total]').textContent = S.peso(0);
      all(L.prep, '[data-wh-count]').forEach((el, i) => { el.textContent = S.stock[i].on.toLocaleString('en-PH'); });
      one(L.prep, '[data-wh-loaded]').textContent = '0';
      one(L.pay, '[data-flip-num]').textContent = '14';
      all(L.pay, '[data-pay-count]').forEach((el, i) => { el.textContent = S.payrollStats[i].format(0); });
      text(one(L.pay, '[data-pay-run]'), S.runState.draft);
      all(L.fin, '[data-r-count]').forEach((el, i) => { el.textContent = S.recap[i].format(0); });

      gsap.set(Object.values(L), { autoAlpha: 0 });
      gsap.set(L.chat, { autoAlpha: 1 });

      const chatCam = camera(camEl(L.chat), { x: 640, y: 400, z: 1 });
      const dashCam = camera(camEl(L.dash), { ...btn, z: 5 });
      const pipeCam = camera(camEl(L.pipe), { ...cardAt, z: 2.4 });
      const quoteCam = camera(camEl(L.quote), { x: 640, y: 400, z: 0.55 });
      const prepCam = camera(camEl(L.prep), { x: 640, y: 400, z: 1.35 });
      const fieldCam = camera(camEl(L.field), { x: 640, y: 400, z: 1 });
      const payCam = camera(camEl(L.pay), { x: 640, y: 400, z: 1.3 });
      const finCam = camera(camEl(L.fin), { ...centre, z: 1.15 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        // Pin the inner wrapper, not the <section>: the pin-spacer GSAP wraps around the pinned node must stay
        // inside a node React owns, or React can't remove the section when the page unmounts.
        scrollTrigger: { trigger: pinEl, start: 'top top', end: '+=1900%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      const beatStarts = [0]; // timeline time each beat starts, for the step list
      const caption = (n: number, at: string) => { beatStarts[n - 1] = tl.addLabel(`beat${n}`, at).labels[`beat${n}`]; };
      // A scrubbed counter: tweens 0→1 (or a → b) and hands the value to `set` on every frame, both directions.
      const count = (from: number, to: number, set: (v: number) => void, vars: gsap.TweenVars, at: string) => {
        const o = { v: from };
        tl.to(o, { v: to, ease: 'none', ...vars, onUpdate: () => set(o.v) }, at);
      };

      /* 1 · Inquiry: the message types itself out, the replies pop in, then the chat shrinks into New Project. */
      const msgs = all(L.chat, '[data-chat-msg]');
      const typeEl = one(L.chat, '[data-chat-type]');
      const first = S.chat[0].text;
      tl.addLabel('b1', 0.2)
        .fromTo(msgs[0], { scale: 0.6, autoAlpha: 0, transformOrigin: '0% 100%' }, { scale: 1, autoAlpha: 1, duration: 0.25 }, 'b1');
      count(0, first.length, v => { typeEl.textContent = first.slice(0, Math.round(v)); }, { duration: 1 }, 'b1+=0.2');
      msgs.slice(1).forEach((m, i) => tl.fromTo(m,
        { scale: 0.5, autoAlpha: 0, y: 24, transformOrigin: i % 2 ? '0% 100%' : '100% 100%' },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.3, ease: 'back.out(1.8)' }, `b1+=${1.5 + i * 0.45}`));

      tl.addLabel('toDash', 'b1+=3')
        .add(chatCam({ z: 0.1 }, { duration: 0.8, ease: 'power3.in' }), 'toDash')
        .to(L.chat, { autoAlpha: 0, duration: 0.2 }, 'toDash+=0.65')
        .to(L.dash, { autoAlpha: 1, duration: 0.3 }, 'toDash+=0.4')
        .to(one(L.dash, '[data-dash-btn]'), { scale: 1.18, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 'toDash+=0.8')
        .add(dashCam({ x: 640, y: 400, z: 1 }, { duration: 1.3, ease: 'power3.inOut' }), 'toDash+=1');

      // The chat plays full screen: the stage starts scaled up to cover the whole pinned view and settles into its
      // column as the dashboard pulls back, with the step list sliding in beside it. Measured from layout offsets
      // (not the transformed box), and re-measured on every ScrollTrigger refresh.
      const stageCol = frame.parentElement!;
      const steps = one(section, '[data-tour-steps]');
      const full = () => {
        const p = pinEl.getBoundingClientRect(), col = stageCol.getBoundingClientRect(), w = frame.offsetWidth, h = frame.offsetHeight;
        return {
          x: p.left + p.width / 2 - (col.left + frame.offsetLeft + w / 2),
          y: p.top + p.height / 2 - (col.top + frame.offsetTop + h / 2),
          // Cover the view, but never zoom past the point where the chat window (≈47% of the stage) fills the width:
          // on a portrait phone, covering the height would crop the chat off both sides.
          scale: Math.min(Math.max(p.width / w, p.height / h), p.width / (w * 0.47)),
        };
      };
      tl.fromTo(frame,
        { x: () => full().x, y: () => full().y, scale: () => full().scale, borderRadius: 0, borderColor: 'rgba(54,54,51,0)' },
        { x: 0, y: 0, scale: 1, borderRadius: 12, borderColor: 'rgba(54,54,51,1)', duration: 1.4, ease: 'power3.inOut', immediateRender: true }, 'toDash+=0.9')
        .fromTo(steps, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.8, immediateRender: true }, 'toDash+=1.5');

      /* 2 · CRM: stats count up, rows rise, Jose's row drops in on top, then the camera dives into it. */
      caption(2, 'toDash+=1');
      const dashCounts = all(L.dash, '[data-dash-count]');
      dashCounts.forEach((el, i) => count(0, S.dashStats[i].base, v => { el.textContent = String(Math.round(v)); }, { duration: 0.9, ease: 'power1.out' }, `toDash+=${1.4 + i * 0.08}`));
      tl.from(all(L.dash, '[data-dash-row]'), { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, 'toDash+=1.6');
      const newRow = one(L.dash, '[data-dash-new]');
      tl.addLabel('b2', 'toDash+=2.7')
        .fromTo(newRow, { height: 0, autoAlpha: 0 }, {
          height: 'auto', autoAlpha: 1, duration: 0.5, ease: 'back.out(2)',
          onUpdate() { const added = +(this.progress() > 0.4); dashCounts[0].textContent = String(128 + added); dashCounts[1].textContent = String(37 + added); },
        }, 'b2')
        .fromTo(newRow, { backgroundColor: 'rgba(255,255,255,0.16)' }, { backgroundColor: 'rgba(255,255,255,0.04)', duration: 0.6 }, 'b2+=0.4');

      tl.addLabel('toPipe', 'b2+=1.4')
        .add(dashCam({ ...newRowAt, z: 2.4 }, { duration: 0.9, ease: 'power3.in' }), 'toPipe')
        .to(L.dash, { autoAlpha: 0, duration: 0.3 }, 'toPipe+=0.7')
        .to(L.pipe, { autoAlpha: 1, duration: 0.3 }, 'toPipe+=0.6');

      /* 3 · Sales: the card rides the pipeline with the camera panning along; at Proposal the quote chip
         opens into the quotation, which lifts off the screen, gets signed and stamped, then folds back. */
      caption(3, 'toPipe+=0.6');
      const card = one(L.pipe, '[data-pipe-card]');
      const pipePill = one(L.pipe, '[data-pipe-pill]');
      const chip = one(L.pipe, '[data-pipe-quote]');
      const STEP = S.PIPE.col + S.PIPE.gap;
      const half = S.W / 1.3 / 2;
      const PIPE_Y = 340; // keeps the board's header in frame at z 1.3
      const followX = (i: number) => gsap.utils.clamp(half, S.PIPE.width - half, cardAt.x + i * STEP + 220);
      const setStage = (i: number) => text(pipePill, { text: S.pipeline[i].stage, style: S.pill(S.pipeline[i].h) });
      setStage(0);
      tl.add(pipeCam({ x: followX(0), y: PIPE_Y, z: 1.3 }, { duration: 1, ease: 'power3.out' }), 'toPipe+=0.9');
      const moveTo = (i: number, at: string) => {
        tl.addLabel(`col${i}`, at)
          .to(card, { x: (i) * STEP, duration: 0.8, ease: 'power2.inOut', onUpdate() { setStage(this.progress() > 0.5 ? i : i - 1); } }, `col${i}`)
          .to(card, { keyframes: { y: [0, -18, 0], rotate: [0, 4, 0], scale: [1, 1.07, 1] }, duration: 0.8, ease: 'none' }, `col${i}`)
          .add(pipeCam({ x: followX(i) }, { duration: 0.9 }), `col${i}`);
      };
      moveTo(1, 'toPipe+=2');
      moveTo(2, 'toPipe+=3');
      tl.fromTo(chip, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2.5)' }, 'toPipe+=3.8');

      const doc = one(L.quote, '[data-q-doc]');
      const totalEl = one(L.quote, '[data-q-total]');
      tl.addLabel('toQuote', 'toPipe+=4.5')
        .add(pipeCam({ x: chipAt.x + 2 * STEP, y: chipAt.y, z: 4 }, { duration: 0.8, ease: 'power3.in' }), 'toQuote')
        .to(L.pipe, { autoAlpha: 0, duration: 0.3 }, 'toQuote+=0.6')
        .to(L.quote, { autoAlpha: 1, duration: 0.25 }, 'toQuote+=0.55')
        .add(quoteCam({ z: 1 }, { duration: 1, ease: 'power3.out' }), 'toQuote+=0.6')
        .from(all(L.quote, '[data-q-row]'), { x: -50, autoAlpha: 0, stagger: 0.12, duration: 0.35 }, 'toQuote+=1.2');
      count(0, S.quoteTotal, v => { totalEl.textContent = S.peso(Math.round(v)); }, { duration: 1, ease: 'power1.out' }, 'toQuote+=1.4');
      tl.to(doc, { rotateX: 16, rotateY: -10, scale: 0.9, y: -10, transformPerspective: 1400, boxShadow: '0 70px 90px -40px rgba(0,0,0,.9)', duration: 0.6, ease: 'power2.inOut' }, 'toQuote+=2.5')
        .fromTo(one(L.quote, '[data-q-sign]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, 'toQuote+=3')
        .fromTo(one(L.quote, '[data-q-stamp]'), { scale: 2.6, autoAlpha: 0, rotate: -34 }, { scale: 1, autoAlpha: 1, rotate: -12, duration: 0.3, ease: 'power4.in' }, 'toQuote+=4')
        .to(doc, { keyframes: { x: [0, 7, -6, 4, 0] }, duration: 0.2, ease: 'none' }, 'toQuote+=4.3')
        .to(doc, { rotateX: 0, rotateY: 0, scale: 1, y: 0, boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.5 }, 'toQuote+=4.7');

      tl.addLabel('backPipe', 'toQuote+=5.4')
        .add(quoteCam({ z: 0.55 }, { duration: 0.7, ease: 'power3.in' }), 'backPipe')
        .to(L.quote, { autoAlpha: 0, duration: 0.25 }, 'backPipe+=0.5')
        .to(L.pipe, { autoAlpha: 1, duration: 0.25 }, 'backPipe+=0.45')
        .add(pipeCam({ x: followX(2), y: PIPE_Y, z: 1.3 }, { duration: 0.8, ease: 'power3.out' }), 'backPipe+=0.6');
      moveTo(3, 'backPipe+=1.5');
      moveTo(4, 'backPipe+=2.5');

      /* 4 · Schedule and warehouse: the install drops onto the calendar, a whip pan to the pick list where the
         stock flies into the van, the van drives off onto the map and the camera rides along to Bacoor. */
      tl.addLabel('toPrep', 'backPipe+=3.6')
        .add(pipeCam({ z: 0.75 }, { duration: 0.7, ease: 'power2.in' }), 'toPrep')
        .to(L.pipe, { autoAlpha: 0, duration: 0.4 }, 'toPrep+=0.3')
        .to(L.prep, { autoAlpha: 1, duration: 0.4 }, 'toPrep+=0.3')
        .add(prepCam({ z: 1 }, { duration: 0.9, ease: 'power3.out' }), 'toPrep+=0.3')
        .from(one(L.prep, '[data-cal-chip]'), { y: -420, autoAlpha: 0, rotate: -10, duration: 0.8, ease: 'bounce.out' }, 'toPrep+=0.9')
        .fromTo(one(L.prep, '[data-cal-day]'), { backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: 'rgba(255,255,255,0.07)', duration: 0.3 }, 'toPrep+=1.5');
      caption(4, 'toPrep+=0.3');

      const whX = S.W + 120 + S.W / 2; // warehouse screen centre
      tl.addLabel('toWh', 'toPrep+=2.3')
        .add(prepCam({ x: (640 + whX) / 2, z: 0.62 }, { duration: 0.45, ease: 'power2.in' }), 'toWh')
        .add(prepCam({ x: whX, z: 1 }, { duration: 0.55, ease: 'power2.out' }), 'toWh+=0.45');
      const whCounts = all(L.prep, '[data-wh-count]');
      const loadedEl = one(L.prep, '[data-wh-loaded]');
      flies.forEach((el, i) => {
        const dx = vanAt.x - flyAt[i].x, dy = vanAt.y - flyAt[i].y;
        const at = `toWh+=${1.2 + i * 0.4}`;
        tl.to(el, { autoAlpha: 1, duration: 0.05 }, at)
          .to(el, { keyframes: { x: [0, dx * 0.5, dx], y: [0, Math.min(0, dy) - 150, dy], scale: [1, 1.4, 0.5], easeEach: 'sine.inOut' }, duration: 0.6, ease: 'none' }, at)
          .to(el, { autoAlpha: 0, duration: 0.08 }, `${at}+=0.55`);
        count(S.stock[i].on, S.stock[i].on - S.stock[i].pick, v => { whCounts[i].textContent = Math.round(v).toLocaleString('en-PH'); }, { duration: 0.4 }, at);
      });
      count(0, S.stock.length, v => { loadedEl.textContent = String(Math.floor(v + 0.001)); }, { duration: 0.4 * S.stock.length + 0.2 }, 'toWh+=1.3');
      tl.to(one(L.prep, '[data-wh-van]'), { keyframes: { x: [0, -12, 900] }, duration: 0.8, ease: 'power2.in' }, 'toWh+=3.6')
        .add(prepCam({ ...pinA, z: 1.6 }, { duration: 0.9, ease: 'power2.inOut' }), 'toWh+=3.9');

      const route = one(L.prep, '[data-map-route]');
      const mapVan = one(L.prep, '[data-map-van]');
      tl.addLabel('drive', 'toWh+=4.8')
        .fromTo(route, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, 'drive')
        .fromTo(mapVan, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 'drive')
        .to(mapVan, { motionPath: { path: route as unknown as SVGPathElement, align: route as unknown as SVGPathElement, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 2.2, ease: 'power1.inOut' }, 'drive')
        .add(prepCam({ ...pinB, z: 1.6 }, { duration: 2.2, ease: 'power1.inOut' }), 'drive');

      /* 5 · On site: the Bacoor pin opens into the leadman's phone. Crew time in, the checklist ticks, three photos
         snap, then the phone steps aside and the report streams to the office. */
      const phone = one(L.field, '[data-f-phone]');
      tl.addLabel('toField', 'drive+=2.4')
        .add(prepCam({ z: 7 }, { duration: 0.8, ease: 'power3.in' }), 'toField')
        .to(L.prep, { autoAlpha: 0, duration: 0.3 }, 'toField+=0.6')
        .to(L.field, { autoAlpha: 1, duration: 0.2 }, 'toField+=0.5')
        .fromTo(phone, { x: -S.PHONE.centred, scale: 0.05, rotate: -8 }, { x: -S.PHONE.centred, scale: 1, rotate: 0, duration: 0.9, ease: 'power3.out' }, 'toField+=0.5');
      caption(5, 'toField+=0.5');

      const crewPills = all(L.field, '[data-f-crew-pill]');
      const crewIn = one(L.field, '[data-f-crew-in]');
      const checks = all(L.field, '[data-f-check]');
      const answeredEl = one(L.field, '[data-f-answered]');
      const bar = one(L.field, '[data-f-bar]');
      const strip = one(L.field, '[data-f-strip]');
      const syncEl = one(L.field, '[data-f-sync]');
      const officeEl = one(L.field, '[data-f-office]');
      const setCrew = (n: number) => { crewPills.forEach((el, i) => text(el, S.crewPill(i, i < n))); crewIn.textContent = String(n); };
      const setChecks = (n: number) => {
        checks.forEach((el, i) => { el.dataset.on = String(i < n); });
        answeredEl.textContent = String(S.answered(n));
        bar.style.width = `${(S.answered(n) / S.TOTAL_ITEMS) * 100}%`;
      };
      setCrew(0); setChecks(0);
      text(syncEl, S.syncState.offline); text(officeEl, S.officeState.waiting);
      gsap.set(strip, { x: 0, xPercent: 0 });

      count(0, S.crew.length, v => setCrew(Math.floor(v + 0.001)), { duration: 1.3 }, 'toField+=1.5');
      tl.to(strip, { xPercent: -100, duration: 0.5, ease: 'power3.inOut' }, 'toField+=3');
      count(0, S.checklist.length, v => setChecks(Math.floor(v + 0.001)), { duration: 1.3 }, 'toField+=3.6');
      tl.to(strip, { xPercent: -200, duration: 0.5, ease: 'power3.inOut' }, 'toField+=5.1');
      all(L.field, '[data-f-photo]').forEach((el, i) => {
        const at = `toField+=${5.7 + i * 0.35}`;
        tl.to(one(L.field, '[data-f-flash]'), { keyframes: { opacity: [0, 0.85, 0] }, duration: 0.2, ease: 'none' }, at)
          .from(el, { scale: 0.2, autoAlpha: 0, rotate: -12, duration: 0.3, ease: 'back.out(2)' }, `${at}+=0.1`);
      });
      tl.addLabel('sync', 'toField+=7')
        .to(phone, { x: 0, duration: 0.7, ease: 'power3.inOut' }, 'sync')
        .from(one(L.field, '[data-f-office-card]'), { x: -560, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 'sync+=0.2');
      count(0, 1, v => text(syncEl, v > 0.5 ? S.syncState.synced : S.syncState.offline), { duration: 0.2 }, 'sync+=0.9');
      dots.forEach((el, i) => {
        const at = `sync+=${1 + i * 0.12}`;
        const dx = officeAt.x + 220 - dotAt.x, dy = officeAt.y - dotAt.y;
        tl.to(el, { autoAlpha: 1, duration: 0.05 }, at)
          .to(el, { keyframes: { x: [0, dx * 0.5, dx], y: [0, dy - 90, dy], easeEach: 'sine.inOut' }, duration: 0.6, ease: 'none' }, at)
          .to(el, { autoAlpha: 0, duration: 0.08 }, `${at}+=0.55`);
      });
      count(0, 1, v => text(officeEl, v > 0.5 ? S.officeState.received : S.officeState.waiting), { duration: 0.2 }, 'sync+=1.7');
      tl.fromTo(one(L.field, '[data-f-office-card]'), { borderColor: S.c.border }, { borderColor: S.hue.success, duration: 0.2, yoyo: true, repeat: 1 }, 'sync+=1.7');

      /* 6 · HR and payroll: the cutoff calendar flips to the 20th, a whip pan to the payroll run where the crew's
         rows fly in, the totals add up, the run is approved and the payslips fan out. */
      tl.addLabel('toPay', 'sync+=2.6')
        .add(fieldCam({ z: 0.6 }, { duration: 0.7, ease: 'power2.in' }), 'toPay')
        .to(L.field, { autoAlpha: 0, duration: 0.4 }, 'toPay+=0.3')
        .to(L.pay, { autoAlpha: 1, duration: 0.4 }, 'toPay+=0.3')
        .add(payCam({ z: 1 }, { duration: 0.9, ease: 'power3.out' }), 'toPay+=0.3');
      caption(6, 'toPay+=0.3');
      const flipNum = one(L.pay, '[data-flip-num]');
      // Each day flips over: the page turns away, the number changes edge-on, the next page turns in.
      count(14, 20, v => {
        const f = v % 1;
        flipNum.textContent = String(Math.floor(v) + +(f >= 0.5));
        flipNum.style.transform = `rotateX(${f < 0.5 ? -f * 180 : (1 - f) * 180}deg)`;
      }, { duration: 1.4 }, 'toPay+=1');

      const payX = S.W + 120 + S.W / 2;
      tl.addLabel('toRun', 'toPay+=2.7')
        .add(payCam({ x: (640 + payX) / 2, z: 0.62 }, { duration: 0.45, ease: 'power2.in' }), 'toRun')
        .add(payCam({ x: payX, z: 1 }, { duration: 0.55, ease: 'power2.out' }), 'toRun+=0.45')
        .from(all(L.pay, '[data-pay-row]'), { x: -700, rotate: -6, autoAlpha: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' }, 'toRun+=0.8');
      const payCounts = all(L.pay, '[data-pay-count]');
      count(0, 1, t => payCounts.forEach((el, i) => { el.textContent = S.payrollStats[i].format(S.payrollStats[i].value * t); }), { duration: 1, ease: 'power1.out' }, 'toRun+=1.2');
      const runEl = one(L.pay, '[data-pay-run]');
      tl.to(one(L.pay, '[data-pay-approve]'), { scale: 0.88, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 'toRun+=2.4');
      count(0, 1, v => text(runEl, v > 0.5 ? S.runState.approved : S.runState.draft), { duration: 0.2 }, 'toRun+=2.5');
      tl.from(slips, {
        x: i => tableAt.x - slipAt[i].x, y: i => tableAt.y - slipAt[i].y,
        rotate: 0, scale: 0.3, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)',
      }, 'toRun+=2.8');

      /* 7 · Recap: the camera pulls back off the payroll run into the end card; the journey line fills left to
         right and each stop's number counts up as the line reaches it, then the call to action rises. */
      const recapCounts = all(L.fin, '[data-r-count]');
      const dotsR = all(L.fin, '[data-r-dot]');
      const LINE = 1.8; // seconds of timeline for the journey line
      tl.addLabel('toFin', 'toRun+=4')
        .add(payCam({ z: 0.35 }, { duration: 0.9, ease: 'power3.in' }), 'toFin')
        .to(L.pay, { autoAlpha: 0, duration: 0.4 }, 'toFin+=0.5')
        .to(L.fin, { autoAlpha: 1, duration: 0.4 }, 'toFin+=0.5')
        .add(finCam(centre, { duration: 1, ease: 'power3.out' }), 'toFin+=0.5')
        .from(all(L.fin, '[data-r-eyebrow], [data-r-title]'), { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, 'toFin+=0.6')
        .fromTo(one(L.fin, '[data-r-line]'), { scaleX: 0 }, { scaleX: 1, duration: LINE, ease: 'none' }, 'toFin+=1.4');
      dotsR.forEach((el, i) => {
        const at = `toFin+=${1.4 + (LINE * i) / (dotsR.length - 1)}`;
        tl.from(el, { scale: 0, duration: 0.25, ease: 'back.out(3)' }, at);
        count(0, S.recap[i].value, v => { recapCounts[i].textContent = S.recap[i].format(v); }, { duration: 0.5, ease: 'power1.out' }, at);
      });
      tl.from(all(L.fin, '[data-r-chip]'), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.35 }, `toFin+=${1.6 + LINE}`)
        .from(one(L.fin, '[data-r-cta]'), { y: 30, autoAlpha: 0, scale: 0.9, duration: 0.45, ease: 'back.out(2)' }, `toFin+=${1.9 + LINE}`)
        .to({}, { duration: 0.8 });
      caption(7, 'toFin+=0.5');

      // Step list: the beat playing is active, and its bar fills across that beat's stretch of the timeline.
      const stepEls = all(section, '[data-step]');
      const fills = all(section, '[data-step-fill]');
      const setSteps = (time: number) => stepEls.forEach((el, i) => {
        const end = beatStarts[i + 1] ?? tl.duration();
        el.dataset.active = String(time >= beatStarts[i] && (time < end || i === stepEls.length - 1));
        fills[i].style.transform = `scaleY(${gsap.utils.clamp(0, 1, (time - beatStarts[i]) / (end - beatStarts[i]))})`;
      });
      tl.eventCallback('onUpdate', () => setSteps(tl.time()));
      setSteps(0);
    });

    return () => { mm.revert(); ro.disconnect(); };
  }, []);

  return (
    <section ref={root} id="tour" aria-labelledby="tour-title" className="overflow-hidden">
      <div data-tour-pin="" className="flex min-h-svh items-center py-8">
      <div className="mx-auto grid w-[calc(100%_-_112px)] max-w-360 grid-cols-[minmax(0,30%)_minmax(0,1fr)] items-center gap-12 max-lg:grid-cols-1 max-lg:gap-6 max-lg:md:w-[calc(100%_-_64px)] max-md:w-[calc(100%_-_40px)]">
        {/* Steps beside the stage. Below lg they share one grid cell so only the active one shows, above the stage.
            Without JS every step shows, with the last one marked active. */}
        <div data-tour-steps="">
          <h2 id="tour-title" className="sr-only">How Lampara runs a job, from first message to payday</h2>
          <ol className="m-0 grid list-none p-0">
            {beats.map(([title, desc], i) => (
              <li key={title} data-step="" data-active={i === beats.length - 1}
                className="relative py-3.5 pl-6 transition-opacity duration-300 data-[active=false]:opacity-35 max-lg:[grid-area:1/1] max-lg:py-0 max-lg:data-[active=false]:opacity-0">
                <span className="absolute inset-y-0 left-0 w-[2px] overflow-hidden bg-line max-lg:hidden">
                  <span data-step-fill="" className="block h-full w-full origin-top bg-cream" style={{ transform: `scaleY(${+(i === beats.length - 1)})` }} />
                </span>
                <p className="text-[length:clamp(20px,1.7vw,26px)] leading-tight font-medium tracking-[-0.03em]">{title}</p>
                <p className="mt-1.5 text-[length:clamp(15px,1.2vw,17px)] leading-snug text-muted">{desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative">
        <div data-tour-frame="" className="relative z-10 mx-auto aspect-[16/10] max-h-[80svh] w-full max-w-[min(100%,calc(80svh*1.6))] overflow-hidden rounded-[12px] border border-line" style={{ background: S.c.bg }}>
          <div className="absolute top-0 left-0 h-[800px] w-[1280px] origin-top-left [transform:scale(var(--s,0.5))]">
            <Layer name="chat"><S.ChatScreen /></Layer>
            <Layer name="dash"><S.DashboardScreen /></Layer>
            <Layer name="pipe" w={S.PIPE.width}><S.PipelineScreen /></Layer>
            <Layer name="quote"><S.QuoteScreen /></Layer>
            <Layer name="prep" w={2 * (S.W + 120) + S.MAP_W}>
              <div className="absolute top-0 left-0"><S.CalendarScreen /></div>
              <div className="absolute top-0" style={{ left: S.W + 120 }}><S.WarehouseScreen /></div>
              <div className="absolute top-0" style={{ left: 2 * (S.W + 120) }}><S.MapScreen /></div>
            </Layer>
            <Layer name="field"><S.FieldScreen /></Layer>
            <Layer name="pay" w={2 * S.W + 120}>
              <div className="absolute top-0 left-0"><S.FlipScreen /></div>
              <div className="absolute top-0" style={{ left: S.W + 120 }}><S.PayrollScreen /></div>
            </Layer>
            <Layer name="fin" cam={centre}><S.RecapScreen /></Layer>
          </div>
        </div>
        <p className="pt-3.5 font-mono text-[10px] text-muted">Rebuilt from Lampara’s CRM, Warehouse and HR screens · Demo data</p>
        </div>
      </div>
      </div>
    </section>
  );
}
