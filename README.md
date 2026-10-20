# Grey Labs landing page

## Next.js (2026-10-20)

The site is now a Next.js App Router project (`npm run dev`, `npm run build`); every page is prerendered static. Routes: `app/page.tsx` (home) and `app/work/{crm,warehouse,hr,website}/page.tsx`. Shared pieces live in `components/`: `Header` (mobile menu state), `Footer`, and `SiteScripts` (the old `script.js`: reveals, hero entrance, disclosures, inquiry form, screenshot viewer), re-run per route. The case-study viewer markup is in `app/work/layout.tsx`. Styles are Tailwind CSS v4 classes on the elements; there is no hand-written component CSS any more. `app/globals.css` holds the theme (colors `ink`, `cream`, `muted`, `line`, `surface`, `raised`, `bright`, `edge`; fonts `font-sans`/`font-mono`; easing `ease-glide`), the site's desktop-first breakpoints (`xs` 381, `ph` 431, `md` 768, `lg` 1100, `xl` 1200 — mostly used as `max-md:` etc., and `max-xl:md:` for a range), a `hover:` variant limited to fine pointers, a `no-js:` variant, and a small base layer of element defaults (Tailwind Preflight is not used). Class sets repeated across pages live in `lib/ui.ts` (`ui.eyebrow`, `ui.zoomFrame`, `ui.featureRow`, …). The conversion was checked against the previous CSS by comparing every element's computed box and styles on all pages at ten widths plus hover states: no element moved or resized. Scroll text reveals use the React Bits `components/ScrollReveal.tsx` (GSAP ScrollTrigger, scrub word fade with blur) on section headings and body text; hero, project cards, FAQ answers, form, captions and mono labels are left out. Images and fonts moved to `public/assets/`, so `/assets/...` paths are unchanged. The original static files are kept in `legacy/` for reference; the `.taste/check-*.cjs` scripts still point at the old static layout and no longer apply.

## Current (2026-10-20): real screenshots and project pages

The generated app mockups, proof stats, "built like a real product" and pricing sections are gone. Work is a grid of four project cards plus a "Need a custom tool?" card, each linking to a case study page in `work/` (crm, warehouse, hr, website). Every screenshot is a real capture with demo data, stored as WebP in `assets/work/<project>/` (`name.webp` full size, `name-thumb.webp` for grids). Any `a[data-zoom]` on a page opens in the shared viewer (`<dialog class="lightbox">`, arrow keys to page, Esc to close); without JS the link opens the full image. The sections below describe earlier builds; some of the CSS they mention is now unused.

Dependency-free static HTML, CSS, and JavaScript. Keep the existing static hosting setup; no install or build step is required. TasteCode owns the next Preview phase.

## Implemented

Seven substantive sections plus footer, local Instrument Sans and Azeret Mono fonts, and the existing three-bar identity. Operations workspace and Connected workflows are native HTML/CSS concept studies. Overview and detail variants share the same representative records. The old concept SVG files remain preserved but are not referenced by the page.

Navigation, compact menu, native disclosures, project scroller, project filters, and workflow configuration selection are keyboard accessible. Entrance and scroll animations use Web Animations and IntersectionObserver. Content defaults to visible, reveals run once, and reduced-motion changes finish owned motion.

## Verify before publishing

Operations workspace and Connected workflows are concept studies, not delivered client projects. Representative records are Customer portal (In progress), Order sync (Review), Operations dashboard (Planning), Review navigation (In review), Confirm required fields (To do), and Prepare handover notes (To do). Workflow steps are New order received, Validate order details, Update business system, and Notify the team. Required fields are Order reference and Email; destination is Business system; notification channel is Team updates. These are local demonstration values, with no real integration, client affiliation, or measured outcome claim.

INQUIRY_ENDPOINT in script.js is empty. Sending remains disabled and honestly disclosed. Configure an HTTPS service accepting JSON name, email, and description and returning {"ok":true} only after accepting delivery. Configure server-side validation, CORS and delivery credentials at that service. Never put secrets in browser code. No real delivery was tested.

Local Chromium verification uses direct file rendering, without starting a preview server. Evidence and scripts are in .taste/build-evidence and .taste/check-*.cjs. The project has no package.json, typecheck, lint, test, or bundling pipeline to run. JavaScript syntax and browser runtime were checked.

## Historical reference adaptations (previous build)

Hero retains centered monumental type, paired actions, and broad media. The approved longer headline uses two expanded lines and three compact lines. One native operations view replaces the reference's four photographic strips, as specified by the Page plan. The compact top void is reduced.

Work retains two tall media stories and overlapping ivory title panels. Native controls and complete representative records require content-driven panel heights, especially on compact screens. Controls move below the stories at medium and compact widths.

Services retains the asymmetric header, fine rules, and four open editorial rows. Supplied descriptions occupy the right-hand column. No portrait or invented identity was added; there is no selected mobile source for this section.

About retains the dominant left statement and isolated right media/prose group on ivory. The shorter supplied headline uses three lines. The validation detail grows beyond nominal 3:2 when required to fit its complete text. The unsupported client-logo strip is omitted.

Process retains the right-weighted heading, unequal media pair, and four ordered indices. Panels stack below 431px because required field names and task states become too narrow in the 60:40 split. The steps remain 2 by 2 there. No reference metrics or Read more action were imported.

FAQ retains the centered two-line heading and five distinct disclosure surfaces. Contact retains the inset two-column panel and contrasting form, with compact stacking. Removing the unsupported portrait, promises and scheduling fields shortens the contact section. Footer retains top rules, upper navigation groups, large lower identity and adjacent copyright, with unused newsletter and policy groups omitted.

## Historical evidence (previous build)

Verified loaded FontFace entries and document.fonts.check for Instrument Sans 400/500/600/700 and Azeret Mono 400/500. Checked widths 320, 390, 768, 1024 and 1440: no document overflow and no rendered interactive target below 44 by 44 pixels. Checked CSS 200% zoom reflow, email validation, unique IDs, fragment destinations, keyboard focus, compact-menu Escape, native disclosures, project filtering, workflow selection and project scrolling.

Observed a running hero entrance, work rise, separate studio horizontal reveal and process color emphasis through browser animation keyframes. Verified reduced-motion initialization and mid-playback preference changes; rapid down/up scrolling twice, restored middle-position reload, and resize leave content visible without replay.

Mocked inquiry responses verified unavailable, sending, accepted, rejected, malformed JSON and network failure. Duplicate sending is prevented. Failures preserve content and only accepted delivery produces success. Live service delivery and real-device testing remain publishing checks.

## Current blueprint implementation

The supplied current Page blueprint has now been applied to the existing site. Its reference mappings differ from the historical mappings above. See [.taste/build-evidence/current/summary.md](.taste/build-evidence/current/summary.md) for the actual composition adaptations, publishing verification note, fresh browser checks, and paired desktop/compact reference captures. Run `node --check script.js` and `node .taste/check-current.cjs`. Both pass without a server or dependency installation.

## Project mockups

Each project on the home page is its own section (`projects` array at the top of `app/page.tsx`): a `ProjectMockup` (laptop, plus a phone when a portrait screenshot exists) beside the details. The frames are drawn with Tailwind in `components/DeviceMockup.tsx`. Screenshots: laptop 1600×1000 (16:10), phone 780×1688.

To use photographic mockups instead: export the device image as a PNG with a transparent screen, put it in `public/assets/mockups/`, and in `Laptop`/`Phone` replace the frame `div`s with a `relative` wrapper holding the PNG (`w-full`) and the screenshot `absolute`-positioned over the screen hole using percentage `top/left/width/height` measured from the PNG. Every project section picks it up. Add a phone to a project by giving it a `phone: { src, alt }` entry.

Scroll reveals finish when text reaches about mid-screen (`wordAnimationEnd`/`rotationEnd` default `'bottom 55%'` in `ScrollReveal`), and cover all body text except the hero (own entrance animation), FAQ answers, the form, links and buttons.

Screenshots reveal on scroll too (`components/MediaReveals.tsx`, GSAP ScrollTrigger scrub): every `a[data-zoom]` and anything marked `data-media-reveal` rises, scales up from 92% and un-clips by the time it reaches mid-screen; `data-media-reveal="phone"` rises from lower with a small tilt. Screenshots already on screen at load are left as is, and nothing animates with reduced motion. Don't put a CSS transform transition on a revealed element (it lags the scrub); animate a wrapper instead, as `ProjectMockup` does.

## PDF presentation

`/deck` is a 14-slide, 16:9 version of the site for clients who prefer a PDF (not linked from the site, `noindex`). `npm run pdf` builds the site and prints it with your installed Chrome to `public/Grey-Labs-Projects.pdf` (also downloadable at `/Grey-Labs-Projects.pdf`). Slide content comes from `lib/content.ts`, which the home page shares, so re-run `npm run pdf` after editing projects. Each project gets an overview slide (mockup, intro, client details) and a highlights slide (four case-study screenshots, picked in `lib/content.ts`). Website pages live in `app/(site)/` with the header and footer; `/deck` renders without them.
