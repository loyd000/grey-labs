import type { Metadata, Viewport } from 'next';
import SiteScripts from '@/components/SiteScripts';
import MediaReveals from '@/components/MediaReveals';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grey Labs | Custom business systems',
  description: 'Custom CRM, warehouse and HR systems for Philippine businesses, designed around how you already work.',
  icons: { icon: { url: '/assets/favicon.svg', type: 'image/svg+xml' } },
};

export const viewport: Viewport = { themeColor: '#131313' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/fonts/instrumentsans/InstrumentSans-Variable.ttf" as="font" type="font/ttf" crossOrigin="" />
      </head>
      <body>
        {children}
        <SiteScripts />
        <MediaReveals />
      </body>
    </html>
  );
}
