'use client';

import { useEffect, useRef, useState } from 'react';

const links = [['/#work', 'Work'], ['/#services', 'Services'], ['/#process', 'Process']];

export default function Header() {
  // Before hydration the compact nav stays visible and the toggle hidden, as in the static site.
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setReady(true);
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(was => { if (was) toggle.current?.focus(); return false; }); };
    const onClick = (event: MouseEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, []);

  return (
    <header className="items-center bg-surface flex h-16 max-md:h-auto justify-between mb-0 mt-4.5 max-md:mt-3 max-w-[calc(100%_-_48px)] max-md:max-w-none pl-5 max-md:pl-3 pr-3 relative w-max max-xl:md:w-[calc(100%_-_48px)] max-md:w-[calc(100%_-_24px)] z-10 py-2 mx-auto gap-10 border border-line rounded-[6px] max-md:min-h-16 no-js:h-auto no-js:items-start">
      <a className="items-center inline-flex text-[24px] font-bold tracking-[-1.6px] min-h-11 whitespace-nowrap gap-3" href="/#hero" aria-label="Grey Labs home"><span className="items-center inline-flex shrink-0 h-6.5 [transform:skew(-15deg)] w-6.25 gap-0.75" aria-hidden="true"><i className="bg-current h-5.75 w-1.25"></i><i className="bg-current h-4.25 w-1.25"></i><i className="bg-current h-2.75 w-1.25"></i></span>grey labs</a>
      <nav className="flex max-xl:hidden text-[14px] gap-6.5" aria-label="Main navigation">{links.map(([href, label]) => <a className="items-center bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0px_1px] inline-flex min-h-11 min-w-11 no-underline [transition-delay:0s,0s] duration-[320ms,180ms] transition-[background-size,color] ease-[cubic-bezier(0.22,1,0.36,1),ease] bg-[position:0px_calc(50%_+_0.8em)] hover:text-bright hover:no-underline hover:underline-offset-6 hover:bg-[length:100%_1px] focus-visible:underline focus-visible:underline-offset-6" key={href} href={href}>{label}</a>)}</nav>
      <div className="hidden max-xl:block max-xl:relative max-lg:text-[15px] max-lg:z-10" ref={menu}>
        <button className="items-center bg-transparent flex min-h-12 min-w-18 px-3 py-2 gap-4 border border-edge rounded-[4px] max-md:text-[14px] hover:bg-raised" ref={toggle} type="button" aria-expanded={open} aria-controls="compact-navigation" hidden={!ready} onClick={() => setOpen(!open)}>Menu <span aria-hidden="true">+</span></button>
        <nav className="max-xl:bg-raised max-xl:absolute max-xl:right-0 max-xl:top-14 max-xl:w-62.5 max-xl:p-3 max-xl:border max-xl:border-edge max-xl:rounded-[4px] max-md:max-w-[calc(-40px_+_100vw)] no-js:static no-js:w-auto no-js:mt-2" aria-label="Mobile navigation" id="compact-navigation" hidden={ready && !open}>
          {links.map(([href, label]) => <a className="max-xl:items-center max-xl:flex max-xl:min-h-12 max-xl:px-3 max-xl:py-2" key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
