import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Website chrome: skip link, header, main landmark and footer. The /deck presentation renders without it.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="bg-cream [clip-path:none] text-ink h-auto left-3 min-h-11 min-w-11 fixed top-3 [transform:translateY(calc(-100%_-_24px))] w-auto z-100 p-3.5 overflow-visible focus:[transform:none]" href="#main">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
