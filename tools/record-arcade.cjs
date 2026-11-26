#!/usr/bin/env node
/**
 * Arcade portfolio reel — records the 3D driving portfolio.
 *
 * Folio is a driving game, not a scroll page: the scene only comes alive when
 * the vehicle moves. So instead of scrolling, this drives with keyboard input,
 * which is what a visitor actually does.
 *
 * Usage: node tools/record-arcade.cjs [seconds]
 */

const { chromium } = require('playwright-core');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve(
  '/Users/felipelondonohumar/Documents/WEB PROJECTS/AGENCY/CGWTOCT2025/CGMWTOCT2025/polite-chaos/public/cases/arcade-portfolio'
);
const RAW_DIR = path.resolve(__dirname, '..', '.arcade-raw');
const URL = 'http://localhost:5174/';
const SECONDS = Number(process.argv[2]) || 30;

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(RAW_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-unsafe-swiftshader', '--enable-gpu'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: RAW_DIR, size: { width: 1920, height: 1080 } },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log(`▶ arcade — ${URL} (${SECONDS}s)`);
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);

  // The intro gates input until the world is ready. Click to focus, then wait
  // for the loading sequence to finish.
  await page.mouse.click(960, 540);
  await page.waitForTimeout(9000);

  // Drive. W accelerates, A/D steer; the folio reveals zones as you approach.
  const legMs = Math.floor((SECONDS * 1000) / 5);
  const script = [
    ['KeyW', ['KeyA']],   // accelerate + steer left
    ['KeyW', []],         // straight
    ['KeyW', ['KeyD']],   // accelerate + steer right
    ['KeyW', []],         // straight
    ['KeyS', ['KeyA']],   // brake + turn
  ];

  for (const [throttle, turns] of script) {
    await page.keyboard.down(throttle);
    for (const t of turns) await page.keyboard.down(t);

    // Small steering corrections keep the view alive without hitting scenery.
    const slices = 6;
    for (let i = 0; i < slices; i++) {
      await page.waitForTimeout(Math.floor(legMs / slices));
      const key = i % 2 === 0 ? 'KeyA' : 'KeyD';
      if (!turns.includes(key)) {
        await page.keyboard.down(key);
        await page.waitForTimeout(120);
        await page.keyboard.up(key);
      }
    }

    for (const t of turns) await page.keyboard.up(t);
    await page.keyboard.up(throttle);
  }

  await page.waitForTimeout(1200);
  await context.close();
  const video = page.video();
  const webm = video ? await video.path() : null;
  await browser.close();

  if (!webm || !fs.existsSync(webm)) throw new Error('No video produced');

  const mp4 = path.join(OUT_DIR, 'showcase.mp4');
  execFileSync('ffmpeg', [
    '-y', '-i', webm,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    mp4,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  fs.rmSync(webm, { force: true });
  fs.rmSync(RAW_DIR, { force: true, recursive: true });
  const mb = (fs.statSync(mp4).size / 1024 / 1024).toFixed(1);
  console.log(`  ✓ ${mp4} (${mb} MB)`);
})().catch((e) => {
  console.error('✗', e.message);
  process.exit(1);
});
