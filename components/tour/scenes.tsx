import type { CSSProperties, ReactNode } from 'react';

// Markup for every scene of the Lampara scroll tour (components/LamparaTour.tsx drives the motion).
// Each screen is a fixed 1280×800 rebuild of a real Lampara screen in the app's own dark theme
// (.dark in Lampara's src/index.css, stage hues from STAGE_COLORS). Everything renders in its
// finished state: the finale reuses these screens as tiles, and no-JS / reduced motion shows the finale.
// data-* attributes are the animation hooks; they are always looked up inside one scene layer.

export const W = 1280;
export const H = 800;

export const c = {
  bg: 'oklch(0.145 0 0)', card: 'oklch(0.205 0 0)', muted: 'oklch(0.269 0 0)',
  fg: 'oklch(0.985 0 0)', mutedFg: 'oklch(0.708 0 0)', primary: 'oklch(0.922 0 0)', primaryFg: 'oklch(0.205 0 0)',
  border: 'oklch(1 0 0 / 10%)',
};
export const hue = { info: 'oklch(0.672 0.13 255)', warning: 'oklch(0.678 0.146 70)', contract: 'oklch(0.687 0.15 303)', install: 'oklch(0.76 0.135 50)', success: 'oklch(0.653 0.15 152)', danger: 'oklch(0.687 0.17 27)' };
// Stage pill = the stage hue at 10% behind the hue itself, as STAGE_COLORS does with bg-x/10 text-x.
export const pill = (h?: string): CSSProperties => h ? { background: `color-mix(in oklch, ${h} 10%, transparent)`, color: h } : { background: c.muted, color: c.fg };
export const peso = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const d = {
  dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  doc: 'M6 2h12v20H6zM9 7h6M9 11h6M9 15h3',
  calendar: 'M3 5h18v16H3zM16 3v4M8 3v4M3 10h18',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1',
  payroll: 'M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 12h.01M18 12h.01',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  truck: 'M1 6h13v10H1zM14 10h4l3 3v3h-7zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3',
  check: 'M5 12l5 5L20 7',
};

function Icon({ path, className = 'size-[18px]' }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return <div className="relative flex h-[800px] w-[1280px] overflow-hidden" style={{ background: c.bg, color: c.fg, fontFeatureSettings: '"tnum"' }}>{children}</div>;
}

function Sidebar({ module, items, active }: { module: string; items: [string, string][]; active: string }) {
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r px-2.5 pt-4" style={{ background: c.card, borderColor: c.border }}>
      <div className="mb-5 flex items-center gap-2.5 px-2">
        <span className="grid size-9 place-items-center rounded-[8px] border text-[15px] font-semibold" style={{ borderColor: c.border, background: c.muted }}>L</span>
        <span className="leading-tight"><b className="block text-[14px] font-medium">Lampara</b><span className="text-[12px]" style={{ color: c.mutedFg }}>{module} · powered by Lampara</span></span>
      </div>
      {items.map(([label, path]) => (
        <div key={label} className="mb-0.5 flex items-center gap-3 rounded-[8px] px-3 py-2 text-[14px]" style={label === active ? { background: c.primary, color: c.primaryFg } : { color: c.mutedFg }}>
          <Icon path={path} /> {label}
        </div>
      ))}
    </aside>
  );
}
const crmNav: [string, string][] = [['Dashboard', d.dashboard], ['Projects', d.people], ['Quotes', d.doc], ['Calendar', d.calendar]];
const hrNav: [string, string][] = [['Today', d.clock], ['Approvals', d.doc], ['Manpower', d.people], ['Timesheet', d.calendar], ['Payroll', d.payroll], ['Employees', d.person]];
const whNav: [string, string][] = [['Stock', d.box], ['Pick lists', d.list], ['Deliveries', d.truck], ['Suppliers', d.people], ['Reports', d.doc]];

const Muted = ({ children, className = '' }: { children: ReactNode; className?: string }) => <span className={className} style={{ color: c.mutedFg }}>{children}</span>;
// Rest props carry data-* animation hooks through to the element.
const Card = ({ children, className = '', style, ...rest }: { children: ReactNode; className?: string; style?: CSSProperties; [hook: `data-${string}`]: string }) =>
  <div {...rest} className={`rounded-[12px] border ${className}`} style={{ background: c.card, borderColor: c.border, ...style }}>{children}</div>;
const line = { borderTop: `1px solid ${c.border}` };

/* ── Beat 1 · Messenger inquiry ─────────────────────────────────────────── */

export const chat = [
  { me: false, text: 'Hi po! Magkano po ang 8kW solar? Taga-Bacoor po ako.' },
  { me: true, text: 'Hello po, Sir Jose! Libre po ang site survey. Ano po ang address ninyo?' },
  { me: false, text: 'Blk 4 Lot 12, Molino III, Bacoor po.' },
  { me: true, text: 'Salamat po! Gagawan na po namin kayo ng project.' },
];

export function ChatScreen() {
  return (
    <Screen>
      {/* A generic messenger window, deliberately unbranded. Centred on (640, 400) so the camera can shrink into it. */}
      <div data-chat-window="" className="absolute top-[70px] left-[360px] flex h-[660px] w-[560px] flex-col overflow-hidden rounded-[22px] border" style={{ background: c.card, borderColor: c.border }}>
        <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: c.border }}>
          <span className="grid size-11 place-items-center rounded-full text-[16px] font-semibold" style={{ background: '#0a7cff', color: '#fff' }}>L</span>
          <span className="leading-tight"><b className="block text-[16px] font-medium">Lampara Electrical</b><Muted className="text-[13px]">Active now</Muted></span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-3 px-5 pb-5">
          {chat.map((m, i) => (
            <div key={i} data-chat-msg="" className={`flex items-end gap-2 ${m.me ? 'justify-end' : ''}`}>
              {!m.me && <span className="grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-medium" style={{ background: c.muted }}>JM</span>}
              <span {...(i === 0 ? { 'data-chat-type': '' } : {})} className="max-w-[340px] rounded-[20px] px-4 py-2.5 text-[16px] leading-snug" style={m.me ? { background: '#0a7cff', color: '#fff' } : { background: c.muted }}>{m.text}</span>
            </div>
          ))}
        </div>
        <div className="mx-4 mb-4 rounded-full px-4 py-2.5 text-[15px]" style={{ background: c.muted, color: c.mutedFg }}>Aa</div>
      </div>
    </Screen>
  );
}

/* ── Beat 2 · CRM dashboard ─────────────────────────────────────────────── */

export const dashStats = [
  { label: 'Total Projects', base: 128 }, { label: 'Active Pipeline', base: 37 },
  { label: 'Contracts Signed', base: 52 }, { label: 'Installations', base: 41 },
];
const recent = [
  { name: 'Maria Santos', city: 'Antipolo City', stage: 'Survey Scheduled', h: hue.info, when: '2d ago' },
  { name: 'Juan Dela Cruz', city: 'Quezon City', stage: 'New Lead', when: '3d ago' },
  { name: 'Liza Fernandez', city: 'Marikina City', stage: 'Cancelled', h: hue.danger, when: '5d ago' },
  { name: 'Pedro Reyes', city: 'Dasmariñas', stage: 'Proposal Sent', h: hue.warning, when: '6d ago' },
  { name: 'Ana Gonzales', city: 'Los Baños', stage: 'Contract Signed', h: hue.contract, when: '15d ago' },
  { name: 'Ricardo Bautista', city: 'Lipa City', stage: 'Active Customer', h: hue.success, when: '25d ago' },
];
const rowClass = 'grid grid-cols-[1.3fr_1fr_auto] items-center px-5 py-3';

function ProjectRow({ name, city, stage, h, when }: { name: string; city: string; stage: string; h?: string; when: string }) {
  return (
    <div className={rowClass} style={line}>
      <span className="leading-tight"><span className="block text-[14px]">{name}</span><Muted className="text-[12px]">{city}</Muted></span>
      <span><span className="rounded-full px-2.5 py-1 text-[12px]" style={pill(h)}>{stage}</span></span>
      <Muted className="text-[13px]">{when}</Muted>
    </div>
  );
}

export function DashboardScreen() {
  return (
    <Screen>
      <Sidebar module="CRM" items={crmNav} active="Dashboard" />
      <main className="flex-1 px-7 pt-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[26px] font-semibold tracking-[-0.03em]">Good evening, Olivia</p>
            <Muted className="mt-1 block text-[14px]">Here’s what’s happening at Lampara today.</Muted>
          </div>
          <span data-dash-btn="" className="inline-block rounded-[8px] px-4 py-2 text-[13px] font-medium" style={{ background: c.primary, color: c.primaryFg }}>+ New Project</span>
        </div>
        <Card className="mt-7 grid grid-cols-4 overflow-hidden">
          {dashStats.map((s, i) => (
            <div key={s.label} className="px-5 py-5" style={i ? { borderLeft: `1px solid ${c.border}` } : undefined}>
              <p data-dash-count="" className="text-[28px] font-semibold tracking-[-0.03em]">{s.base + +(i < 2)}</p>
              <Muted className="mt-1 block text-[13px]">{s.label}</Muted>
            </div>
          ))}
        </Card>
        <Card className="mt-6 overflow-hidden">
          <p className="px-5 py-4 text-[16px] font-medium">Recent Projects</p>
          <div data-dash-new="" className="overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <ProjectRow name="Jose Mercado" city="Molino III, Bacoor" stage="New Lead" when="just now" />
          </div>
          {recent.map(p => <div key={p.name} data-dash-row=""><ProjectRow {...p} /></div>)}
        </Card>
      </main>
    </Screen>
  );
}

/* ── Beat 3 · Pipeline board and quote ──────────────────────────────────── */

// Absolute layout so the moving card lands exactly on each column's slot: column i starts at left + i × (col + gap).
export const PIPE = { left: 40, col: 280, gap: 24, top: 96, slot: 48, cardH: 116, width: 1880 };
export const pipeline = [
  { stage: 'New Lead', cards: [['Juan Dela Cruz', 'Quezon City'], ['Rosa Lim', 'Pasig City']] },
  { stage: 'Survey Scheduled', h: hue.info, cards: [['Maria Santos', 'Antipolo City']] },
  { stage: 'Proposal Sent', h: hue.warning, cards: [['Pedro Reyes', 'Dasmariñas'], ['Lito Garcia', 'Imus']] },
  { stage: 'Contract Signed', h: hue.contract, cards: [['Ana Gonzales', 'Los Baños']] },
  { stage: 'Installation Scheduled', h: hue.install, cards: [['Carmela Villanueva', 'Calamba']] },
  { stage: 'Active Customer', h: hue.success, cards: [['Ricardo Bautista', 'Lipa City'], ['Nena Ramos', 'Tanauan']] },
];

export function PipelineScreen() {
  return (
    <div className="relative h-[800px]" style={{ width: PIPE.width, background: c.bg, color: c.fg }}>
      <div className="absolute top-8 left-10 right-10 flex items-center justify-between">
        <p className="text-[26px] font-semibold tracking-[-0.03em]">Projects</p>
        <span className="rounded-[8px] border px-3 py-1.5 text-[13px]" style={{ borderColor: c.border, color: c.mutedFg }}>Board · List</span>
      </div>
      {pipeline.map((col, i) => (
        <div key={col.stage} className="absolute" style={{ left: PIPE.left + i * (PIPE.col + PIPE.gap), top: PIPE.top, width: PIPE.col }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full px-2.5 py-1 text-[12px]" style={pill(col.h)}>{col.stage}</span>
            <Muted className="text-[12px]">{col.cards.length}</Muted>
          </div>
          <div className="mt-[18px] rounded-[12px] border border-dashed" style={{ height: PIPE.cardH, borderColor: c.border }} />
          {col.cards.map(([name, city]) => (
            <Card key={name} className="mt-3 px-3.5 py-3">
              <p className="text-[14px]">{name}</p>
              <Muted className="text-[12px]">{city}</Muted>
            </Card>
          ))}
        </div>
      ))}
      {/* The project being followed, sitting on the New Lead slot; the tour slides it column to column. */}
      <div data-pipe-card="" className="absolute flex flex-col justify-between rounded-[12px] border px-3.5 py-3"
        style={{ left: PIPE.left, top: PIPE.top + PIPE.slot, width: PIPE.col, height: PIPE.cardH, background: c.card, borderColor: 'oklch(1 0 0 / 35%)' }}>
        <div className="leading-tight">
          <p className="text-[15px] font-medium">Jose Mercado</p>
          <Muted className="text-[12px]">Molino III, Bacoor · 8 kWp hybrid</Muted>
        </div>
        <div className="flex items-center justify-between">
          <span data-pipe-pill="" className="rounded-full px-2.5 py-1 text-[12px]" style={pill()}>New Lead</span>
          <span data-pipe-quote="" className="rounded-[6px] border px-2 py-0.5 text-[12px]" style={{ borderColor: c.border }}>Quote ₱532,500</span>
        </div>
      </div>
    </div>
  );
}

export const quoteItems: [string, number][] = [
  ['16 × 550W mono panels', 192000], ['8 kW hybrid inverter', 118000], ['10 kWh LiFePO4 battery', 135000],
  ['Mounting rails and clamps', 24500], ['PV cable, breakers and protection', 18000], ['Installation, permits and net-metering', 45000],
];
export const quoteTotal = quoteItems.reduce((sum, [, n]) => sum + n, 0);
const paper = { bg: '#f6f5f1', fg: '#1a1a1a', muted: '#6b6a66', line: '#e2e0da' };

export function QuoteScreen() {
  return (
    <Screen>
      {/* A printed quotation: light paper so it reads as a document lifting out of the dark app. */}
      <div data-q-doc="" className="absolute top-[30px] left-[280px] h-[740px] w-[720px] rounded-[6px] px-12 py-10" style={{ background: paper.bg, color: paper.fg }}>
        <p className="text-[12px] tracking-[0.06em]" style={{ color: paper.muted }}>LAMPARA ELECTRICAL INSTALLATION SERVICES</p>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-[34px] font-semibold tracking-[-0.03em]">Quotation</p>
          <p className="text-[13px]" style={{ color: paper.muted }}>Q-2026-0142 · Oct 9, 2026</p>
        </div>
        <p className="mt-2 text-[14px]" style={{ color: paper.muted }}>Prepared for <b style={{ color: paper.fg }}>Jose Mercado</b> · Blk 4 Lot 12, Molino III, Bacoor</p>
        <div className="mt-7 text-[14px]">
          {quoteItems.map(([item, n]) => (
            <div key={item} data-q-row="" className="flex justify-between py-2.5" style={{ borderBottom: `1px solid ${paper.line}` }}>
              <span>{item}</span><span className="font-mono">{peso(n)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 text-[18px] font-semibold">
            <span>Total</span><span data-q-total="" className="font-mono">{peso(quoteTotal)}</span>
          </div>
        </div>
        <div className="absolute right-12 bottom-12 left-12 flex items-end justify-between">
          <div className="w-[260px]">
            <svg viewBox="0 0 240 64" className="h-[64px] w-[240px]" aria-hidden="true">
              <path data-q-sign="" pathLength={1} strokeDasharray="1" d="M8 44 C 24 8, 40 6, 36 36 S 56 58, 72 30 S 96 10, 106 36 S 130 54, 146 24 S 170 14, 180 38 S 206 46, 232 18" fill="none" stroke="#1f3c88" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <div className="pt-1.5 text-[13px]" style={{ borderTop: `1px solid ${paper.fg}` }}>Conforme · Jose Mercado</div>
          </div>
          <div data-q-stamp="" className="rounded-[8px] border-[3px] px-4 py-2 text-center font-mono text-[15px] font-semibold tracking-[0.08em]" style={{ borderColor: '#7a3fd0', color: '#7a3fd0', transform: 'rotate(-12deg)' }}>
            CONTRACT SIGNED<span className="block text-[11px] font-normal">OCT 10, 2026</span>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ── Beat 4 · Calendar, warehouse, map ──────────────────────────────────── */

const events: Record<number, [string, string?][]> = {
  2: [['Survey · Pedro R.', hue.info]], 6: [['Survey · Maria S.', hue.info]], 9: [['Install · Carmela V.', hue.install]],
  20: [['Payroll cutoff']], 22: [['Survey · Juan D.', hue.info]], 27: [['Install · Ana G.', hue.install]],
};

export function CalendarScreen() {
  // October 2026 starts on a Thursday: the grid opens with Sep 27–30.
  const days = [...[27, 28, 29, 30].map(n => ({ n, out: true })), ...Array.from({ length: 31 }, (_, i) => ({ n: i + 1, out: false }))];
  return (
    <Screen>
      <Sidebar module="CRM" items={crmNav} active="Calendar" />
      <main className="flex-1 px-7 pt-8">
        <div className="flex items-end justify-between">
          <p className="text-[26px] font-semibold tracking-[-0.03em]">October 2026</p>
          <Muted className="text-[13px]">Surveys · Installs · Cutoffs</Muted>
        </div>
        <div className="mt-5 grid grid-cols-7 text-[12px]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <Muted key={day} className="px-2 pb-2">{day}</Muted>)}
        </div>
        <div className="grid grid-cols-7 overflow-hidden rounded-[12px] border" style={{ borderColor: c.border }}>
          {days.map(({ n, out }, i) => (
            <div key={i} {...(!out && n === 14 ? { 'data-cal-day': '' } : {})} className="h-[124px] p-2" style={{ borderTop: i > 6 ? `1px solid ${c.border}` : undefined, borderLeft: i % 7 ? `1px solid ${c.border}` : undefined }}>
              <span className="text-[13px]" style={{ color: out ? 'oklch(0.45 0 0)' : c.fg }}>{n}</span>
              {!out && events[n]?.map(([label, h]) => <div key={label} className="mt-1.5 truncate rounded-[6px] px-1.5 py-1 text-[11px]" style={pill(h)}>{label}</div>)}
              {!out && n === 14 && <div data-cal-chip="" className="mt-1.5 rounded-[6px] px-1.5 py-1 text-[11px] font-medium" style={{ background: hue.install, color: c.primaryFg }}>Install · Jose Mercado</div>}
            </div>
          ))}
        </div>
      </main>
    </Screen>
  );
}

export const stock = [
  { item: '550W mono panel', on: 312, pick: 16 }, { item: '8 kW hybrid inverter', on: 14, pick: 1 },
  { item: '10 kWh LiFePO4 battery', on: 9, pick: 1 }, { item: 'Mounting rail 2.4 m', on: 220, pick: 12 },
  { item: 'PV cable 6 mm² (m)', on: 1500, pick: 120 },
];

function Van({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 110" className={className} aria-hidden="true">
      <rect x="4" y="18" width="140" height="66" rx="6" fill={c.primary} />
      <path d="M144 34h40l30 26v24h-70z" fill={c.primary} />
      <path d="M154 40h26l20 18h-46z" fill={c.bg} />
      <text x="20" y="58" fontSize="17" fontWeight="600" fill={c.primaryFg}>LAMPARA</text>
      {[44, 176].map(x => <g key={x}><circle cx={x} cy="88" r="16" fill="#111" /><circle cx={x} cy="88" r="7" fill={c.mutedFg} /></g>)}
    </svg>
  );
}

export function WarehouseScreen() {
  return (
    <Screen>
      <Sidebar module="Warehouse" items={whNav} active="Pick lists" />
      <main className="flex-1 px-7 pt-10">
        <p className="text-[26px] font-semibold tracking-[-0.03em]">Pick list · Jose Mercado</p>
        <Muted className="mt-1 block text-[14px]">Install Oct 14 · Molino III, Bacoor · L300 van</Muted>
        <div className="mt-7 flex gap-6">
          <Card className="w-[600px] overflow-hidden text-[14px]">
            <div className="grid grid-cols-[1fr_110px_90px] px-5 py-3 font-medium" style={{ background: c.muted }}>
              <span>Item</span><span className="text-right">On hand</span><span className="text-right">Pick</span>
            </div>
            {stock.map(s => (
              <div key={s.item} className="relative grid grid-cols-[1fr_110px_90px] items-center px-5 py-4" style={line}>
                <span>{s.item}</span>
                <span data-wh-count="" className="text-right font-mono">{(s.on - s.pick).toLocaleString('en-PH')}</span>
                <span className="text-right font-mono" style={{ color: hue.install }}>−{s.pick}</span>
                {/* The picked quantity that flies into the van. */}
                <span data-wh-fly="" className="absolute right-5 rounded-full px-2.5 py-1 font-mono text-[13px] opacity-0" style={{ background: hue.install, color: c.primaryFg }}>{s.pick}</span>
              </div>
            ))}
          </Card>
          <Card className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
            <div data-wh-van=""><Van className="w-[230px]" /></div>
            <p className="text-[14px]">L300 van · <span data-wh-loaded="">{stock.length}</span> of {stock.length} loaded</p>
          </Card>
        </div>
      </main>
    </Screen>
  );
}

export const MAP_W = 1400;
export function MapScreen() {
  return (
    <svg viewBox={`0 0 ${MAP_W} 800`} width={MAP_W} height="800" className="block" style={{ background: c.bg }} aria-hidden="true">
      <path d="M0 0H560C510 120 420 210 330 270S120 380 0 400Z" fill="oklch(0.21 0.03 250)" />
      <text x="70" y="120" fontSize="18" fill="oklch(0.45 0.04 250)" fontStyle="italic">Manila Bay</text>
      <g fill="none" stroke="oklch(0.28 0 0)" strokeLinecap="round">
        <path d="M120 700C300 640 520 600 760 520S1160 360 1380 300" strokeWidth="14" />
        <path d="M600 800C620 620 700 460 820 300S1000 60 1060 0" strokeWidth="10" />
        <path d="M200 420C420 440 640 400 900 420S1250 470 1400 460" strokeWidth="8" />
        <path d="M980 800C1000 640 1060 480 1160 360S1300 160 1360 80" strokeWidth="6" />
      </g>
      <path data-map-route="" pathLength={1} strokeDasharray="1" d="M260 560C380 540 430 470 530 455S700 430 770 365S900 300 1000 292S1080 272 1100 260" fill="none" stroke={hue.install} strokeWidth="6" strokeLinecap="round" />
      <g data-map-pin-a=""><circle cx="260" cy="560" r="12" fill={c.primary} /><text x="282" y="596" fontSize="20" fill={c.mutedFg}>Lampara warehouse</text></g>
      <g data-map-pin-b=""><circle cx="1100" cy="260" r="22" fill={hue.install} opacity="0.25" /><circle cx="1100" cy="260" r="12" fill={hue.install} /><text x="1060" y="220" fontSize="20" fill={c.fg}>Molino III, Bacoor</text></g>
      <g data-map-van=""><rect x="-17" y="-10" width="34" height="20" rx="4" fill={c.primary} /><rect x="9" y="-7" width="7" height="14" rx="2" fill={c.bg} /></g>
    </svg>
  );
}

/* ── Beat 5 · Field phone and office ────────────────────────────────────── */

export const crew = [
  { name: 'Engineer, Erwin', time: 'In 6:56 AM', rate: 950, days: 10, ded: 497.52 },
  { name: 'Bautista, Kevin', time: 'In 7:06 AM · 6 min late', late: true, rate: 600, days: 10, ded: 340 },
  { name: 'Cruz, Paolo', time: 'In 6:58 AM', rate: 650, days: 10, ded: 1357.4 },
  { name: 'Dizon, Mark', time: 'In 6:59 AM', rate: 650, days: 9, ded: 857.4 },
  { name: 'Lopez, Ryan', time: 'In 7:00 AM', rate: 700, days: 10, ded: 550.2 },
  { name: 'Ramos, Jayson', time: 'In 7:02 AM', rate: 620, days: 10, ded: 255.96 },
];
export const crewPill = (i: number, isIn: boolean) =>
  isIn ? { text: `✓ ${crew[i].time}`, style: pill(crew[i].late ? hue.warning : hue.success) } : { text: '× Not in', style: pill(hue.danger) };

// The last items of the CRM's QA/QC checklist, with the Tagalog the field app shows under each.
export const checklist = [
  ['Inverter powered on successfully', 'Matagumpay na na-power on ang inverter'],
  ['No fault or alarm displayed', 'Walang fault o alarm na ipinapakita'],
  ['Monitoring system connected', 'Nakakonekta ang monitoring system'],
  ['Voltage and current checked', 'Nasuri ang boltahe at kuryente'],
  ['Final cleaning completed', 'Nakumpleto ang huling paglilinis'],
  ['Photos taken for documentation', 'Kumuha ng mga larawan para sa dokumentasyon'],
];
export const TOTAL_ITEMS = 43;
export const answered = (ticked: number) => TOTAL_ITEMS - checklist.length + ticked;
export const syncState = {
  offline: { text: 'Offline · saved on this phone', style: pill(hue.warning) },
  synced: { text: 'Synced to the office', style: pill(hue.success) },
};
export const officeState = {
  waiting: { text: 'Waiting for site', style: pill() },
  received: { text: '✓ Report received', style: pill(hue.success) },
};
// Final phone position; the tour starts it centred (PHONE.left - PHONE.centred).
export const PHONE = { left: 760, top: 44, w: 346, h: 712, centred: 760 - (640 - 173) };
const solarPhoto: CSSProperties = {
  background: 'repeating-linear-gradient(90deg, transparent 0 17px, #0b1626 17px 19px), repeating-linear-gradient(0deg, #24477a 0 22px, #0b1626 22px 24px)',
};

export function FieldScreen() {
  return (
    <Screen>
      <Card data-f-office-card="" className="absolute top-[250px] left-[80px] w-[440px] px-6 py-5">
        <Muted className="text-[12px]">Lampara CRM · Office</Muted>
        <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">Jose Mercado — QA/QC report</p>
        <span data-f-office="" className="mt-3 inline-block rounded-full px-2.5 py-1 text-[12px]" style={officeState.received.style}>{officeState.received.text}</span>
        <div className="mt-4 space-y-1.5 text-[14px]">
          <p>6 of 6 crew timed in</p><p>{TOTAL_ITEMS} of {TOTAL_ITEMS} checklist items</p><p>3 site photos</p>
        </div>
      </Card>
      {[0, 1, 2, 3, 4].map(i => <span key={i} data-f-dot="" className="absolute size-[12px] rounded-full opacity-0" style={{ left: PHONE.left - 6, top: 394, background: hue.success }} />)}

      <div data-f-phone="" className="absolute" style={{ left: PHONE.left, top: PHONE.top, width: PHONE.w, height: PHONE.h }}>
        <div className="h-full w-full rounded-[44px] border-[8px] border-[#2a2a2a] bg-[#0b0b0b] p-[3px]">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[34px]" style={{ background: c.bg }}>
            <div className="flex items-center justify-between px-7 pt-3 text-[12px] font-medium">
              <span>4:12</span><span className="h-[22px] w-[86px] rounded-full bg-[#000]" /><Muted>4G</Muted>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div data-f-strip="" className="flex h-full [transform:translateX(-200%)]">
                {/* 1 · crew attendance */}
                <div className="h-full w-full shrink-0 px-5 pt-4">
                  <Muted className="text-[12px]">Today · Regular 07:00–16:00</Muted>
                  <p className="mt-1 text-[18px] font-semibold leading-tight tracking-[-0.02em]">Jose Mercado — Bacoor</p>
                  <Muted className="mt-1 block text-[12px]">You’re the leadman · Install, day 1 of 2</Muted>
                  <Card className="mt-4 overflow-hidden">
                    <p className="px-3.5 py-3 text-[13px] font-medium">Your crew · <span data-f-crew-in="">{crew.length}</span> of {crew.length} in</p>
                    {crew.map((p, i) => {
                      const s = crewPill(i, true);
                      return (
                        <div key={p.name} className="flex items-center justify-between gap-2 px-3.5 py-2.5" style={line}>
                          <span className="text-[13px]">{p.name}</span>
                          <span data-f-crew-pill="" className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px]" style={s.style}>{s.text}</span>
                        </div>
                      );
                    })}
                  </Card>
                </div>
                {/* 2 · QA/QC checklist */}
                <div className="h-full w-full shrink-0 px-5 pt-4">
                  <Muted className="text-[12px]">← Jose Mercado · Bacoor</Muted>
                  <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">QA/QC Checklist</p>
                  <Muted className="mt-1 block text-[12px]"><span data-f-answered="">{TOTAL_ITEMS}</span> of {TOTAL_ITEMS} items answered</Muted>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full" style={{ background: c.muted }}>
                    <div data-f-bar="" className="h-full w-full rounded-full" style={{ background: hue.success }} />
                  </div>
                  <Card className="mt-4 overflow-hidden">
                    {checklist.map(([en, tl], i) => (
                      <div key={en} data-f-check="" data-on="true" className="group flex gap-3 px-3.5 py-2.5" style={i ? line : undefined}>
                        <span className="relative mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border border-dashed group-data-[on=true]:border-solid" style={{ borderColor: c.mutedFg }}>
                          <span className="absolute inset-[-1px] grid place-items-center rounded-full opacity-0 group-data-[on=true]:opacity-100" style={{ background: hue.success, color: c.bg }}>
                            <Icon path={d.check} className="size-[12px]" />
                          </span>
                        </span>
                        <span className="leading-tight"><span className="block text-[13px]">{en}</span><Muted className="text-[11px]">{tl}</Muted></span>
                      </div>
                    ))}
                  </Card>
                </div>
                {/* 3 · site photos and sync */}
                <div className="flex h-full w-full shrink-0 flex-col px-5 pt-4">
                  <Muted className="text-[12px]">← Jose Mercado · Bacoor</Muted>
                  <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">Site report</p>
                  <p className="mt-4 text-[13px] font-medium">Site photos</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map(i => <div key={i} data-f-photo="" className="aspect-square rounded-[10px]" style={solarPhoto} />)}
                  </div>
                  <Card className="mt-4 overflow-hidden text-[13px]">
                    {[['Crew', '6 of 6 in'], ['QA/QC checklist', `${TOTAL_ITEMS} of ${TOTAL_ITEMS}`], ['Photos', '3']].map(([k, v], i) => (
                      <div key={k} className="flex justify-between px-3.5 py-2.5" style={i ? line : undefined}><span>{k}</span><Muted>{v}</Muted></div>
                    ))}
                  </Card>
                  <span data-f-sync="" className="mx-auto mt-auto mb-6 rounded-full px-3 py-1.5 text-[12px]" style={syncState.synced.style}>{syncState.synced.text}</span>
                </div>
              </div>
            </div>
            <div data-f-flash="" className="pointer-events-none absolute inset-0 bg-[#fff] opacity-0" />
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ── Beat 6 · Cutoff and payroll ────────────────────────────────────────── */

export const gross = crew.reduce((sum, p) => sum + p.rate * p.days, 0);
export const deductions = crew.reduce((sum, p) => sum + p.ded, 0);
export const payrollStats = [
  { label: 'Employees', value: crew.length, format: (n: number) => String(Math.round(n)) },
  { label: 'Gross', value: gross, format: peso },
  { label: 'Deductions', value: deductions, format: peso },
  { label: 'Net pay', value: gross - deductions, format: peso },
];
export const runState = {
  draft: { text: 'Draft', style: pill(hue.warning) },
  approved: { text: 'Approved', style: pill(hue.success) },
};

export function FlipScreen() {
  return (
    <Screen>
      <div className="absolute top-[170px] left-[450px] w-[380px] overflow-hidden rounded-[18px] border text-center" style={{ background: c.card, borderColor: c.border }}>
        <p className="py-3 font-mono text-[14px] tracking-[0.1em]" style={{ background: hue.danger, color: c.primaryFg }}>OCTOBER 2026</p>
        <div className="[perspective:900px]">
          <p data-flip-num="" className="py-4 text-[180px] leading-none font-semibold tracking-[-0.06em]">20</p>
        </div>
        <p className="pb-2 text-[18px] font-medium">Payroll cutoff</p>
        <Muted className="block pb-6 text-[14px]">Oct 6 – Oct 20 · 6 crew</Muted>
      </div>
    </Screen>
  );
}

const payGrid = 'grid grid-cols-[1.6fr_1fr_.6fr_1.1fr_1.1fr_1.1fr]';

export function PayrollScreen() {
  return (
    <Screen>
      <Sidebar module="HR" items={hrNav} active="Payroll" />
      <main className="flex-1 px-7 pt-10">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-3 text-[24px] font-semibold tracking-[-0.03em]">
            <Muted>‹</Muted> Payroll · Oct 6 – Oct 20
            <span data-pay-run="" className="rounded-full px-2.5 py-1 text-[12px] font-normal tracking-normal" style={runState.approved.style}>{runState.approved.text}</span>
          </p>
          <span data-pay-approve="" className="inline-block rounded-[8px] px-4 py-2 text-[13px] font-medium" style={{ background: c.primary, color: c.primaryFg }}>Approve</span>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {payrollStats.map(s => (
            <Card key={s.label} className="px-4 py-3.5">
              <Muted className="text-[13px]">{s.label}</Muted>
              <p data-pay-count="" className="mt-1 font-mono text-[21px]">{s.format(s.value)}</p>
            </Card>
          ))}
        </div>
        <Card data-pay-table="" className="mt-5 overflow-hidden text-[13px]">
          <div className={`${payGrid} px-4 py-3 font-medium`} style={{ background: c.muted }}>
            <span>Employee</span><span className="text-right">Rate</span><span className="text-right">Days</span><span className="text-right">Gross</span><span className="text-right">Deductions</span><span className="text-right">Net</span>
          </div>
          {crew.map(p => (
            <div key={p.name} data-pay-row="" className={`${payGrid} px-4 py-3`} style={line}>
              <span>{p.name}</span>
              <Muted className="text-right font-mono">{peso(p.rate)}</Muted>
              <span className="text-right font-mono">{p.days}</span>
              <span className="text-right font-mono">{peso(p.rate * p.days)}</span>
              <Muted className="text-right font-mono">{peso(p.ded)}</Muted>
              <span className="text-right font-mono">{peso(p.rate * p.days - p.ded)}</span>
            </div>
          ))}
        </Card>
      </main>
      {/* Payslips fanned out over the run once it is approved. */}
      {crew.map((p, i) => {
        const k = i - (crew.length - 1) / 2;
        return (
          <div key={p.name} data-pay-slip="" className="absolute h-[210px] w-[170px] rounded-[12px] border px-4 py-3.5 text-[12px]"
            style={{ left: 756 - 85 + k * 100, top: 500 + Math.abs(k) * 16, transform: `rotate(${k * 7}deg)`, background: c.card, borderColor: 'oklch(1 0 0 / 25%)', boxShadow: '0 20px 40px -18px rgba(0,0,0,.9)' }}>
            <Muted>Payslip · Oct 6–20</Muted>
            <p className="mt-2 text-[14px] font-medium">{p.name}</p>
            <Muted className="mt-6 block">Net pay</Muted>
            <p className="font-mono text-[16px]">{peso(p.rate * p.days - p.ded)}</p>
          </div>
        );
      })}
    </Screen>
  );
}

/* ── Beat 7 · Recap ─────────────────────────────────────────────────────── */

// Jose's job as five numbers along one line, one per stop of the story.
const whole = (n: number) => String(Math.round(n));
export const recap = [
  { value: 1, format: whole, label: 'message on Messenger' },
  { value: quoteTotal, format: (n: number) => '₱' + Math.round(n).toLocaleString('en-PH'), label: 'quote, signed' },
  { value: stock.length, format: whole, label: 'items picked' },
  { value: TOTAL_ITEMS, format: (n: number) => `${Math.round(n)}/${TOTAL_ITEMS}`, label: 'checks on site' },
  { value: gross - deductions, format: peso, label: 'payroll approved' },
];
const RECAP_W = 1040;

export function RecapScreen() {
  return (
    <Screen>
      <div className="flex w-full flex-col items-center justify-center text-center">
        <p data-r-eyebrow="" className="font-mono text-[15px] tracking-[0.06em]" style={{ color: c.mutedFg }}>JOSE MERCADO · MOLINO III, BACOOR · OCT 8 – OCT 20</p>
        <p data-r-title="" className="mt-5 text-[68px] leading-[1.02] font-semibold tracking-[-0.05em]">one system,<br />inquiry to payday.</p>

        <div className="mt-16" style={{ width: RECAP_W }}>
          <div className="grid grid-cols-5">
            {recap.map(r => (
              <div key={r.label}>
                <p data-r-count="" className="font-mono text-[30px] font-semibold tracking-[-0.03em]">{r.format(r.value)}</p>
                <Muted className="mt-1 block text-[14px]">{r.label}</Muted>
              </div>
            ))}
          </div>
          {/* The journey line: fills left to right and lights a stop under each number. */}
          <div className="relative mt-7 h-[16px]">
            <div className="absolute top-[7px] right-[104px] left-[104px] h-[2px]" style={{ background: c.muted }}>
              <div data-r-line="" className="h-full origin-left" style={{ background: hue.install }} />
            </div>
            {recap.map((r, i) => (
              <span key={r.label} data-r-dot="" className="absolute top-0 size-[16px] rounded-full border-[3px]"
                style={{ left: (i + 0.5) * (RECAP_W / recap.length) - 8, background: hue.install, borderColor: c.bg }} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex gap-2.5">
          {['CRM', 'Warehouse', 'Field app', 'HR and payroll'].map(m => (
            <span key={m} data-r-chip="" className="rounded-full border px-3.5 py-1.5 text-[14px]" style={{ borderColor: c.border, color: c.mutedFg }}>{m}</span>
          ))}
        </div>
        <a data-r-cta="" href="#process" className="mt-9 rounded-full px-8 py-4 text-[19px] font-medium" style={{ background: c.primary, color: c.primaryFg }}>
          Get a system like this →
        </a>
      </div>
    </Screen>
  );
}
