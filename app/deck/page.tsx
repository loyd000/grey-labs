import type { Metadata } from 'next';
import { Laptop, ProjectMockup } from '@/components/DeviceMockup';
import { problems, projectDetails, projects, services, steps } from '@/lib/content';

// 16:9 presentation of the site for clients who prefer a PDF. Every <Slide> is one 1920×1080 page;
// `npm run pdf` prints this route to public/Grey-Labs-Projects.pdf.
export const metadata: Metadata = {
  title: 'Grey Labs | Project showcase',
  robots: { index: false, follow: false },
};

const TOTAL = 6 + projects.length * 2;
const pad = (n: number) => String(n).padStart(2, '0');
const label = 'font-mono text-[18px] tracking-[0.08em] text-muted';

function Brand({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 font-bold tracking-[-1.6px] whitespace-nowrap ${className}`}>
      <span aria-hidden="true" className="inline-flex h-[1.05em] w-[1em] shrink-0 [transform:skew(-15deg)] items-center gap-[0.12em]">
        <i className="h-[0.92em] w-[0.2em] bg-current" /><i className="h-[0.68em] w-[0.2em] bg-current" /><i className="h-[0.44em] w-[0.2em] bg-current" />
      </span>
      grey labs
    </span>
  );
}

function Slide({ page, section, tone = 'dark', children }: { page: number; section?: string; tone?: 'dark' | 'light'; children: React.ReactNode }) {
  const light = tone === 'light';
  return (
    <section className={`relative flex h-[1080px] w-[1920px] shrink-0 flex-col overflow-hidden break-after-page last:break-after-auto px-28 pt-24 pb-44 ${light ? 'bg-cream text-ink' : 'bg-ink text-cream'}`}>
      {children}
      {section && (
        <footer className={`absolute right-28 bottom-14 left-28 flex items-center justify-between border-t pt-6 text-[20px] ${light ? 'border-[#d1cec4] text-[#4f4d46]' : 'border-line text-muted'}`}>
          <span className="flex items-center gap-6"><Brand className="text-[24px] text-current" /><span className="font-mono text-[16px] tracking-[0.08em]">{section}</span></span>
          <span className="font-mono text-[16px] tracking-[0.08em]">{pad(page)} / {pad(TOTAL)}</span>
        </footer>
      )}
    </section>
  );
}

export default function Deck() {
  let page = 3;
  return (
    <main className="flex flex-col items-center gap-10 bg-[#0a0a0a] py-10 print:gap-0 print:bg-ink print:py-0">
      {/* 1 · Cover */}
      <Slide page={1}>
        <Brand className="text-[40px]" />
        <div className="mt-auto grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-end gap-20">
          <div>
            <p className="text-[26px]">Custom business systems · Philippines</p>
            <h1 className="mt-8 text-[124px] leading-[0.98] font-semibold tracking-[-0.06em]">your business, running on software built for it.</h1>
            <p className="mt-10 max-w-[620px] text-[28px] leading-[1.45] text-muted">Grey Labs builds custom CRM, warehouse and HR systems for Philippine businesses, designed around how you already work.</p>
          </div>
          <Laptop src="/assets/work/crm/dashboard.webp" alt="Lampara CRM dashboard" />
        </div>
        <p className={`${label} mt-16`}>PROJECT SHOWCASE · {new Date().getFullYear()}</p>
      </Slide>

      {/* 2 · Problem */}
      <Slide page={2} section="THE PROBLEM">
        <p className={label}>THE PROBLEM</p>
        <h2 className="mt-6 text-[140px] leading-[1] font-semibold tracking-[-0.06em]">sound familiar?</h2>
        <ol className="mb-0 list-none p-0 mt-auto grid grid-cols-4">
          {problems.map(([title, text], i) => (
            <li key={title} className={`pr-10 ${i ? 'border-l border-line pl-10' : ''}`}>
              <p className={label}>{pad(i + 1)}</p>
              <h3 className="mt-8 text-[38px] leading-[1.15] font-medium tracking-[-0.035em]">{title}</h3>
              <p className="mt-6 text-[24px] leading-[1.5] text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Slide>

      {/* 3 · Work index */}
      <Slide page={3} section="SELECTED WORK">
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-24">
          <div className="flex flex-col">
            <p className={label}>SELECTED WORK</p>
            <h2 className="mt-6 text-[140px] leading-[1] font-semibold tracking-[-0.06em]">selected work.</h2>
            <p className="mt-auto text-[30px] leading-[1.45] text-muted">Lampara Electrical Installation Services, a Philippine solar installer, ran sales, stock and staff on paper and spreadsheets. Now it all runs in one system its whole team uses every day, plus a website that brings new customers in.</p>
          </div>
          <ol className="m-0 list-none self-end p-0">
            {projects.map((p, i) => (
              <li key={p.slug} className="grid grid-cols-[80px_1fr] items-baseline gap-6 border-t border-line py-8 last:border-b">
                <span className={label}>{pad(i + 1)}</span>
                <span>
                  <span className="block text-[44px] leading-[1.1] font-medium tracking-[-0.035em]">{p.title}</span>
                  <span className="mt-3 block text-[22px] text-muted">{p.eyebrow}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Slide>

      {projects.map((p, i) => {
        const d = projectDetails[p.slug];
        const overview = ++page, highlights = ++page;
        const section = `${pad(i + 1)} · ${p.eyebrow.replace('Lampara · ', '').toUpperCase()}`;
        return [
          /* Project overview */
          <Slide key={`${p.slug}-overview`} page={overview} section={section}>
            <div className="grid flex-1 grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-center gap-24">
              <ProjectMockup laptop={p.laptop} phone={p.phone} />
              <div>
                <p className={label}>{pad(i + 1)} / {pad(projects.length)} · {p.eyebrow.toUpperCase()}</p>
                <h2 className="mt-6 text-[84px] leading-[1.02] font-semibold tracking-[-0.05em]">{p.title}</h2>
                <p className="mt-8 text-[26px] leading-[1.5] text-muted">{d.intro}</p>
                <dl className="mt-12 grid grid-cols-2 gap-x-10 gap-y-7 border-t border-line pt-8">
                  {d.meta.map(([term, value]) => (
                    <div key={term}>
                      <dt className="font-mono text-[15px] tracking-[0.08em] text-muted">{term.toUpperCase()}</dt>
                      <dd className="mt-2 ml-0 text-[22px] leading-[1.35]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Slide>,
          /* Project highlights */
          <Slide key={`${p.slug}-highlights`} page={highlights} section={section}>
            <div className="flex items-end justify-between gap-16">
              <h2 className="text-[72px] leading-[1.02] font-semibold tracking-[-0.05em]">{p.title.toLowerCase()}<span className="text-muted">, in four screens.</span></h2>
              <p className="max-w-[440px] pb-3 text-[22px] leading-[1.45] text-muted">{p.roles}</p>
            </div>
            <ul className="mb-0 list-none p-0 mt-14 grid flex-1 grid-cols-2 gap-x-16 gap-y-12">
              {d.highlights.map((h, n) => (
                <li key={h.src} className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-9">
                  <div className="overflow-hidden rounded-[10px] border border-line bg-raised p-2.5">
                    <img src={h.src} alt={h.title} width={1600} height={1000} className="block aspect-[16/10] h-auto w-full rounded-[5px] object-cover object-top" />
                  </div>
                  <div>
                    <p className={label}>{pad(n + 1)}</p>
                    <h3 className="mt-4 text-[32px] leading-[1.15] font-medium tracking-[-0.035em]">{h.title}</h3>
                    <p className="mt-4 text-[20px] leading-[1.5] text-muted">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Slide>,
        ];
      })}

      {/* Services */}
      <Slide page={TOTAL - 2} section="SERVICES" tone="light">
        <div className="flex items-end justify-between gap-16">
          <div>
            <p className="font-mono text-[18px] tracking-[0.08em] text-[#4f4d46]">SERVICES</p>
            <h2 className="mt-6 text-[120px] leading-[1] font-semibold tracking-[-0.06em]">software that fits.</h2>
          </div>
          <p className="max-w-[460px] pb-4 text-[26px] leading-[1.45] text-[#4f4d46]">If your team runs it on paper or Excel, it can be a system.</p>
        </div>
        <ol className="mb-0 list-none p-0 mt-auto">
          {services.map(([title, text], i) => (
            <li key={title} className="grid grid-cols-[90px_minmax(0,1fr)_minmax(0,1.3fr)] items-baseline gap-8 border-t border-[#d1cec4] py-6">
              <span className="font-mono text-[18px] tracking-[0.08em] text-[#4f4d46]">{pad(i + 1)}</span>
              <span className="text-[40px] leading-[1.1] font-medium tracking-[-0.035em]">{title}</span>
              <span className="text-[22px] leading-[1.5] text-[#4f4d46]">{text}</span>
            </li>
          ))}
        </ol>
      </Slide>

      {/* Process */}
      <Slide page={TOTAL - 1} section="PROCESS">
        <p className={label}>PROCESS</p>
        <h2 className="mt-6 max-w-[11em] text-[120px] leading-[1] font-semibold tracking-[-0.06em]">four steps, no surprises.</h2>
        <ol className="mb-0 list-none p-0 mt-auto grid grid-cols-4">
          {steps.map(([title, text], i) => (
            <li key={title} className={`pr-10 ${i ? 'border-l border-line pl-10' : ''}`}>
              <span className="block text-[96px] leading-[1] font-semibold tracking-[-0.06em]">{pad(i + 1)}</span>
              <h3 className="mt-8 text-[36px] leading-[1.15] font-medium tracking-[-0.035em]">{title}</h3>
              <p className="mt-5 text-[23px] leading-[1.5] text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Slide>

      {/* Closing */}
      <Slide page={TOTAL}>
        <p className="text-[34px] leading-[1.4] text-muted">Custom business systems.<br />Built around how you work.</p>
        <p className={`${label} mt-8`}>THANK YOU FOR YOUR TIME</p>
        <Brand className="mt-auto text-[330px] leading-[1] tracking-[-0.075em] text-cream" />
      </Slide>
    </main>
  );
}
