// Tailwind class sets for elements repeated across pages. One-off styles stay inline on the element.

/** Small mono label above headings, in meta lists and on cards. */
export const eyebrow = 'font-mono text-[11px] font-normal tracking-[0.08em] leading-[1.6] text-muted';
export const eyebrowTerm = `${eyebrow} not-italic`;

/** Page section: centered wrap with the site's side margins and vertical rhythm. */
export const section = 'mx-auto w-[calc(100%_-_112px)] max-w-360 max-lg:md:w-[calc(100%_-_64px)] max-md:w-[calc(100%_-_40px)] py-28 max-md:py-19';

// Screenshot frames. `zoom*` variants sit inside an a[data-zoom] (group/zoom) and react to its hover.
const frame = 'overflow-hidden border border-line bg-raised';
const frameMotion = 'transition-[transform,box-shadow,border-color,background-color,color] duration-[260ms,260ms,180ms,180ms,180ms] ease-[cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),ease,ease,ease] motion-safe:group-hover/zoom:border-edge';
export const shotFrame = `${frame} p-2.5 rounded-[8px]`;
export const zoomFrame = `${frame} ${frameMotion} p-2.5 rounded-[8px]`;
export const zoomFrameTight = `${frame} ${frameMotion} p-1.5 rounded-[8px]`;
export const zoomFramePhone = `${frame} ${frameMotion} p-2 rounded-[22px]`;
const shot = 'block h-auto w-full';
const shotZoom = 'transition-[transform] duration-500 ease-glide motion-safe:group-hover/zoom:[transform:scale(1.025)]';
export const zoomShot = `${shot} ${shotZoom} rounded-[4px]`;
export const zoomShotPhone = `${shot} ${shotZoom} rounded-[16px]`;

/** Arrow inside a .button-style link; nudges on the button's hover. */
export const buttonArrow = 'inline-block text-[21px] transition-[transform] duration-180 ease-[ease] motion-reduce:group-hover/button:[transform:translateX(3px)] motion-safe:group-hover/button:[transform:translateX(4px)] motion-reduce:group-disabled/button:[transform:none] motion-safe:group-disabled/button:[transform:none]';

// Case-study pages.
/** Two-column block: heading on the left, content on the right. */
export const caseSplit = 'grid grid-cols-[38%_1fr] max-lg:grid-cols-[1fr] gap-12 max-lg:gap-7 border-t border-t-line pt-12';
export const caseSplitTitle = 'text-[length:clamp(44px,4.4vw,64px)]';
/** Feature row: screenshot and text side by side; the flipped row puts the screenshot on the right. */
export const featureRow = 'grid grid-cols-[62%_1fr] max-lg:grid-cols-[1fr] items-center gap-12 max-lg:gap-6';
export const featureRowFlipped = 'grid grid-cols-[1fr_62%] max-lg:grid-cols-[1fr] items-center gap-12 max-lg:gap-6';
export const featureTitle = 'mt-3 text-[length:clamp(28px,2.6vw,38px)]';
export const featureBullets = 'mx-0 mt-4.5 mb-0 pl-4.5 text-[15px] text-muted';
/** "Under the hood" list item and its label. */
export const stackItem = 'border-t border-t-line px-0 py-4 text-[15px] text-muted';
export const stackLabel = 'block text-[17px] font-medium text-cream';
/** Previous/next project title with the underline sweep. */
export const caseNextTitle = 'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0px_1px] bg-[position:0px_100%] bg-no-repeat text-[length:clamp(24px,2.4vw,34px)] font-medium tracking-[-0.035em] no-underline transition-[background-size,color] duration-[320ms,180ms] ease-[cubic-bezier(0.22,1,0.36,1),ease] group-hover/next:no-underline group-hover/next:bg-[length:100%_1px]';

/** Filled and outline call-to-action links (pair with ui.buttonArrow on the ↗ span). */
const buttonBase = 'inline-flex min-h-13.5 items-center justify-between gap-9 rounded-[4px] border px-6.5 py-3.5 text-[15px] font-medium transition-[transform,box-shadow,border-color,background-color,color] duration-[260ms,260ms,180ms,180ms,180ms] ease-[cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),ease,ease,ease] group/button not-disabled:hover:bg-bright not-disabled:hover:border-bright not-disabled:hover:text-ink motion-safe:not-disabled:hover:[transform:translateY(-2px)] motion-safe:not-disabled:active:[transform:translateY(0)_scale(.97)] motion-safe:not-disabled:active:duration-80';
export const button = `${buttonBase} border-cream bg-cream text-ink`;
export const buttonOutline = `${buttonBase} border-edge bg-transparent text-cream`;
