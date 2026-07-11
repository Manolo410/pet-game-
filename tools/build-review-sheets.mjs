#!/usr/bin/env node
// Builds one review image per creature: its 3 art phases side by side
// on the game's dark background, saved to art-review/<creature>.png.
// Run after tools/generate-art.mjs. Requires playwright + chromium.

import { readdirSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const artDir = join(root, 'assets', 'creatures');
const outDir = join(root, 'art-review');
mkdirSync(outDir, { recursive: true });

const PHASES = ['baby', 'teen', 'adult'];
const files = readdirSync(artDir).filter(f => f.endsWith('.png'));
const creatures = [...new Set(files.map(f => f.replace(/_(baby|teen|adult)\.png$/, '')))];

if (!creatures.length) {
  console.log('No generated art found in assets/creatures/ yet.');
  process.exit(0);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
  headless: true
});
const page = await browser.newPage({ viewport: { width: 1020, height: 420 } });

for (const c of creatures) {
  const cells = PHASES.map(p => {
    const f = join(artDir, `${c}_${p}.png`);
    if (!existsSync(f)) return `<div class="cell missing"><span>${p}<br>(missing)</span></div>`;
    const b64 = readFileSync(f).toString('base64');
    return `<div class="cell"><img src="data:image/png;base64,${b64}"><span>${p}</span></div>`;
  }).join('');
  await page.setContent(`
    <style>
      body { margin:0; background:radial-gradient(ellipse at 50% 30%, #1e1608, #12100a); font-family:sans-serif; }
      h1 { color:#ede0c8; text-align:center; font-size:22px; margin:10px 0 0; }
      .row { display:flex; justify-content:center; gap:20px; padding:8px 16px; }
      .cell { width:300px; height:330px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
              border:1px solid rgba(190,160,100,0.25); border-radius:14px; background:rgba(255,245,215,0.05); }
      .cell img { max-width:270px; max-height:280px; object-fit:contain; }
      .cell span { color:#b09a78; font-size:14px; text-transform:uppercase; letter-spacing:2px; text-align:center; }
      .missing { opacity:0.4; }
    </style>
    <h1>${c}</h1><div class="row">${cells}</div>
  `);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(outDir, `${c}.png`) });
  console.log(`sheet: art-review/${c}.png`);
}

await browser.close();
console.log(`\n${creatures.length} review sheet(s) written to art-review/`);
