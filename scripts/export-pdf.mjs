// Prints the /deck presentation to public/Grey-Labs-Projects.pdf (one 1920×1080 page per slide).
// Run with `npm run pdf` (builds first). Uses your installed Chrome; set CHROME_PATH to use another Chromium.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';

const PORT = 4319;
const OUT = 'public/Grey-Labs-Projects.pdf';
const next = createRequire(import.meta.url).resolve('next/dist/bin/next');
const server = spawn(process.execPath, [next, 'start', '-p', String(PORT)], { stdio: 'ignore' });

try {
  for (let i = 0; ; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/deck`)).ok) break; } catch {}
    if (i > 60) throw new Error('next start did not come up; run `npm run build` first');
    await new Promise(r => setTimeout(r, 500));
  }
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
  // Reduced motion: scroll reveals never hide anything, so every slide prints fully revealed.
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${PORT}/deck`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach(img => { img.loading = 'eager'; });
    await Promise.all(images.map(img => img.decode().catch(() => {})));
    await document.fonts.ready;
  });
  await page.pdf({ path: OUT, width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  console.log(`Saved ${OUT}`);
} finally {
  server.kill();
}
