#!/usr/bin/env node
// =====================================================
// HatchBound — Automated character art generation
// =====================================================
// Generates all 36 creature images (12 creatures x 3 phases) from
// tools/art-prompts.json and saves them into assets/creatures/
// with the exact filenames the game auto-detects.
//
// Providers (pick one, set its API key as an env var):
//   OPENAI_API_KEY      -> OpenAI gpt-image-1, native transparent
//                          background (~$0.50-1.50 for all 36)
//   REPLICATE_API_TOKEN -> FLUX schnell on Replicate, cheapest
//                          (~$0.11 for all 36); images come on a
//                          white background (game still looks fine,
//                          or remove backgrounds afterwards)
//
// Usage:
//   node tools/generate-art.mjs --dry-run          list what would be generated
//   node tools/generate-art.mjs                    generate everything missing
//   node tools/generate-art.mjs --only fire_lion   one creature only
//   node tools/generate-art.mjs --force            regenerate even if file exists
//
// The run is resumable: existing files are skipped unless --force.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'creatures');
const jobs = JSON.parse(readFileSync(join(root, 'tools', 'art-prompts.json'), 'utf8'));

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

const openaiKey = process.env.OPENAI_API_KEY;
const replicateKey = process.env.REPLICATE_API_TOKEN;
const provider = openaiKey ? 'openai' : replicateKey ? 'replicate' : null;

const queue = jobs.filter(j =>
  (!only || j.creature === only) &&
  (force || !existsSync(join(outDir, j.file)))
);

console.log(`Provider: ${provider || 'NONE (set OPENAI_API_KEY or REPLICATE_API_TOKEN)'}`);
console.log(`Jobs: ${queue.length} to generate, ${jobs.length - queue.length} already done/filtered\n`);

if (dryRun) {
  queue.forEach(j => console.log(`  would generate ${j.file}`));
  process.exit(0);
}
if (!provider) {
  console.error('No API key found. Set OPENAI_API_KEY or REPLICATE_API_TOKEN and rerun.');
  process.exit(1);
}
if (!queue.length) { console.log('Nothing to do.'); process.exit(0); }
mkdirSync(outDir, { recursive: true });

async function generateOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      quality: 'medium',
      background: 'transparent',
      n: 1
    })
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, 'base64');
}

async function generateReplicate(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateKey}`,
      'Content-Type': 'application/json',
      Prefer: 'wait'
    },
    body: JSON.stringify({
      input: { prompt, aspect_ratio: '1:1', output_format: 'png', output_quality: 95 }
    })
  });
  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);
  let pred = await res.json();
  // Poll if not finished despite Prefer: wait
  while (pred.status === 'starting' || pred.status === 'processing') {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${replicateKey}` }
    });
    pred = await poll.json();
  }
  if (pred.status !== 'succeeded') throw new Error(`Replicate prediction ${pred.status}: ${JSON.stringify(pred.error)}`);
  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

const generate = provider === 'openai' ? generateOpenAI : generateReplicate;

let done = 0, failed = 0;
for (const job of queue) {
  const dest = join(outDir, job.file);
  process.stdout.write(`[${done + failed + 1}/${queue.length}] ${job.file} ... `);
  try {
    const buf = await generate(job.prompt);
    writeFileSync(dest, buf);
    done++;
    console.log(`ok (${Math.round(buf.length / 1024)} KB)`);
  } catch (e) {
    failed++;
    console.log(`FAILED: ${e.message.slice(0, 200)}`);
  }
}

console.log(`\nDone: ${done} generated, ${failed} failed.`);
if (failed) console.log('Rerun the same command — completed files are skipped automatically.');
