// Device frames drawn with Tailwind, so any screenshot can be dropped in without image editing.
// To use photographic mockups instead, replace the frame markup here with the mockup PNG and position the
// screenshot over its transparent screen area (see README); every project section picks the change up.

type Shot = { src: string; alt: string };

/** Laptop around a 16:10 desktop screenshot (1600×1000). */
export function Laptop({ src, alt }: Shot) {
  return (
    <div>
      <div className="relative mx-auto w-[90%] rounded-t-[14px] border border-[#3a3a37] bg-[#1b1b1a] p-[2.2%] pb-[3%] max-md:rounded-t-[10px]">
        <span aria-hidden="true" className="absolute top-[1.1%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#3a3a37] max-md:size-1" />
        <img src={src} alt={alt} width={1600} height={1000} loading="lazy" className="block aspect-[16/10] h-auto w-full rounded-[3px] object-cover object-top" />
      </div>
      <div aria-hidden="true" className="relative h-3.5 rounded-b-[14px] bg-linear-to-b from-[#4a4a46] to-[#222221] max-md:h-2 max-md:rounded-b-[8px]">
        <span className="absolute top-0 left-1/2 h-1.5 w-[16%] -translate-x-1/2 rounded-b-md bg-[#1b1b1a] max-md:h-1" />
      </div>
    </div>
  );
}

/** Phone around a portrait screenshot (780×1688). */
export function Phone({ src, alt }: Shot) {
  return (
    <div className="relative rounded-[clamp(18px,2.6vw,38px)] border border-[#3a3a37] bg-[#0b0b0b] p-[4%] shadow-[0_24px_48px_-20px_rgba(0,0,0,.85)]">
      <span aria-hidden="true" className="absolute top-[3.2%] left-1/2 z-10 h-[2.4%] w-[28%] -translate-x-1/2 rounded-full bg-[#000]" />
      <img src={src} alt={alt} width={780} height={1688} loading="lazy" className="block aspect-[780/1688] h-auto w-full rounded-[clamp(12px,2vw,30px)] object-cover object-top" />
    </div>
  );
}

/** Laptop with an optional phone overlapping its lower right corner. */
export function ProjectMockup({ laptop, phone }: { laptop: Shot; phone?: Shot }) {
  return (
    <div className={`relative ${phone ? 'pr-[12%] pb-[6%]' : ''}`}>
      <div data-media-reveal="">
        <Laptop {...laptop} />
      </div>
      {phone && (
        <div data-media-reveal="phone" className="absolute right-0 bottom-0 w-[24%]">
          <Phone {...phone} />
        </div>
      )}
    </div>
  );
}
