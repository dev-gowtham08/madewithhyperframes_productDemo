// Run in the normal terminal. Captures real interactions; never substitutes UI states.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const project = path.join(repo, 'videos/made-with-hyperframes');
const requireTool = createRequire(path.join(repo, 'tools/capture/package.json'));
const { default: puppeteer } = await import(requireTool.resolve('puppeteer-core'));
const ffmpeg = process.env.FFMPEG_PATH || requireTool('ffmpeg-static');
const website = 'https://www.madewithhyperframes.com';
const slug = 'cinematic-ai-future-gowtham';
const title = 'Cinematic AI Future';
const expectedPrompt = 'Create a cinematic AI future video with neon cities, a glowing holographic brain, and connected Earth. Add smooth transitions, purple-blue lighting, animated visuals, and futuristic background music.';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

// Use the successful capture. The old capture/BLOCKED.md is intentionally untouched.
const attempts = fs.readdirSync(project).filter(name => name.startsWith('capture-retry.'));
const successful = attempts.filter(name => {
  try {
    const result = JSON.parse(fs.readFileSync(path.join(project, name, 'result.log'), 'utf8'));
    return result.ok === true && !fs.existsSync(path.join(project, name, 'site/BLOCKED.md'));
  } catch { return false; }
});
if (!successful.length) throw new Error('A successful original capture is required.');
const sourceCapture = successful.at(-1) + '/site';
const candidateBrowsers = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const browserPath = candidateBrowsers.find(file => fs.existsSync(file));
if (!browserPath) throw new Error('Set CHROME_PATH to a working Chromium-compatible browser executable.');
if (!ffmpeg || !fs.existsSync(ffmpeg)) throw new Error('FFmpeg is missing. Reinstall tools/capture or set FFMPEG_PATH.');
const out = fs.mkdtempSync(path.join(project, 'interaction-capture.'));
const manifest = { ok: false, sourceCapture, website, slug, title, capturedAt: new Date().toISOString(), formats: {}, errors: [] };
writeJSON(path.join(out, 'manifest.json'), manifest);
console.log(`Writing real interaction footage to ${out}`);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mwh-capture-profile-'));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: browserPath, headless: true, userDataDir: profile, defaultViewport: null });
  // writeText uses Chrome's sanitized-write permission; clipboard-write alone
  // maps to clipboardReadWrite in Puppeteer and does not grant that permission.
  await browser.defaultBrowserContext().overridePermissions(website, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  for (const [format, viewport] of Object.entries({ portrait: { width: 720, height: 1060, deviceScaleFactor: 2 }, landscape: { width: 1440, height: 900, deviceScaleFactor: 2 } })) {
    const dir = path.join(out, format);
    fs.mkdirSync(dir);
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.bringToFront();
    page.setDefaultTimeout(30000);
    const evidence = { viewport, clips: {}, snapshots: {}, events: [], consoleErrors: [] };
    manifest.formats[format] = evidence;
    page.on('pageerror', error => evidence.consoleErrors.push(error.message));
    let recorder = null, started = 0, activeClip = null;
    const mark = (action, extra = {}) => evidence.events.push({ clip: activeClip, seconds: recorder ? (performance.now() - started) / 1000 : null, action, ...extra });
    async function record(name) {
      activeClip = name;
      recorder = await page.screencast({ path: path.join(dir, `${name}.webm`), fps: 30, quality: 18, ffmpegPath: ffmpeg });
      started = performance.now();
      mark('recording-start');
    }
    async function stop() {
      const duration = (performance.now() - started) / 1000;
      await recorder.stop();
      evidence.clips[activeClip] = { file: `${format}/${activeClip}.webm`, duration, fps: 30 };
      recorder = null;
      activeClip = null;
    }
    async function cursor() {
      // Only the cursor is drawn. Product DOM, labels, clipboard and results are untouched.
      await page.evaluate(() => {
        if (document.getElementById('mwh-capture-cursor')) return;
        const cursor = document.createElement('div');
        cursor.id = 'mwh-capture-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:28px;pointer-events:none;z-index:2147483647;transform:translate(-100px,-100px)';
        cursor.innerHTML = '<svg viewBox="0 0 24 30" width="22" height="28"><path d="M2 2v23l6-6 5 9 5-3-5-8h9Z" fill="#171916" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
        document.body.append(cursor);
        document.addEventListener('mousemove', event => { cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`; });
      });
    }
    async function snap(name, selector) {
      const file = path.join(dir, `${name}.png`);
      if (selector) {
        const element = await page.waitForSelector(selector);
        await element.screenshot({ path: file });
      } else await page.screenshot({ path: file });
      evidence.snapshots[name] = { file: `${format}/${name}.png`, selector: selector ?? 'viewport', url: page.url() };
    }
    async function click(selector, action) {
      const element = await page.waitForSelector(selector, { visible: true });
      const box = await element.boundingBox();
      if (!box) throw new Error(`No click target: ${selector}`);
      const x = box.x + box.width / 2, y = box.y + box.height / 2;
      if (x < 0 || y < 0 || x > viewport.width || y > viewport.height) throw new Error(`Click target outside viewport: ${selector}`);
      await page.mouse.move(x, y, { steps: 24 });
      await delay(250);
      mark(action, { selector, x, y, box });
      await page.mouse.click(x, y);
    }
    try {
      const response = await page.goto(website, { waitUntil: 'networkidle2', timeout: 60000 });
      if (!response?.ok()) throw new Error(`Homepage HTTP ${response?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await cursor();
      await snap('directory-home');
      await page.$eval('#explore', el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'instant' }));
      await delay(700);
      await snap('filters-before');
      await record('discovery');
      await delay(800);
      await click('.tool-tabs button:nth-child(2)', 'choose-Hyperframes');
      await page.waitForFunction(() => new URL(location.href).searchParams.get('tool') === 'Hyperframes');
      await delay(900);
      await snap('tool-selected');
      await click('.prompt-filter', 'enable-Full-prompt');
      await page.waitForFunction(() => document.querySelector('.prompt-filter')?.getAttribute('aria-pressed') === 'true');
      await delay(1100);
      const cards = await page.$$eval('.project-card', nodes => nodes.map(node => ({ title: node.querySelector('h3')?.textContent, fullPrompt: !!node.querySelector('.card-prompt-badge'), creator: node.querySelector('.card-creator')?.textContent })));
      if (!cards.length || cards.some(card => !card.fullPrompt)) throw new Error('Full prompt results did not pass verification.');
      evidence.filteredCards = cards;
      await snap('full-prompt-selected');
      await delay(1200);
      await stop();

      const cardSelector = `.project-card:has(h3 a[href*="${slug}"])`;
      await page.waitForSelector(cardSelector);
      await page.$eval(cardSelector, el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await delay(1000);
      await snap('selected-card-context');
      await snap('selected-card', cardSelector);
      evidence.selectedCardBox = await (await page.$(cardSelector)).boundingBox();
      evidence.selectedVideoBox = await (await page.$(`${cardSelector} .card-image`)).boundingBox();
      await record('open-detail');
      await delay(700);
      await click(`${cardSelector} h3 a`, 'open-Cinematic-AI-Future');
      await page.waitForSelector('.detail-prompt-panel');
      await cursor();
      const detail = await page.evaluate(() => ({
        title: document.querySelector('h1')?.textContent?.trim(),
        creator: document.querySelector('.detail-byline')?.textContent?.trim(),
        facts: document.querySelector('.detail-facts')?.textContent?.trim(),
        prompt: document.querySelector('.prompt-panel-text')?.textContent?.trim(),
        note: document.querySelector('.prompt-panel-note')?.textContent?.trim(),
        structured: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
        url: location.href
      }));
      if (detail.title !== title || !detail.creator?.includes('Gowtham') || detail.note !== 'Prompt shared by the creator.' || detail.prompt !== expectedPrompt) throw new Error('Detail content changed or is not the expected complete prompt; inspect instead of substituting.');
      evidence.detail = detail;
      await page.waitForFunction(() => { const v = document.querySelector('.detail-media video'); return v && v.readyState >= 2 && !v.paused && v.currentTime > 0.1; }, { timeout: 45000 });
      const firstTime = await page.$eval('.detail-media video', el => el.currentTime);
      await delay(1300);
      const lastTime = await page.$eval('.detail-media video', el => el.currentTime);
      if (!(lastTime > firstTime)) throw new Error('Detail video is not advancing.');
      evidence.playback = { firstTime, lastTime, verified: true };
      await snap('detail-playing');
      await delay(2200);
      await stop();
      await snap('detail-full', '.detail-page');

      await page.$eval('.detail-prompt-panel', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await delay(600);
      await snap('prompt-before');
      await snap('prompt-panel-before', '.detail-prompt-panel');
      await record('copy-prompt');
      await delay(1800);
      await click('.prompt-copy', 'click-Copy-prompt');
      await page.waitForFunction(() => ['Copied', 'Try again'].includes(document.querySelector('.prompt-copy')?.textContent.trim()));
      const copyLabel = await page.$eval('.prompt-copy', el => el.textContent.trim());
      if (copyLabel !== 'Copied') {
        await snap('copy-failed');
        evidence.clipboardPermissions = await page.evaluate(async () => {
          const states = {};
          for (const name of ['clipboard-read', 'clipboard-write']) {
            try { states[name] = (await navigator.permissions.query({ name })).state; }
            catch (error) { states[name] = String(error); }
          }
          return { ...states, focused: document.hasFocus(), secureContext: isSecureContext };
        });
        throw new Error(`Copy prompt returned ${copyLabel}; no successful copy footage may be used.`);
      }
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      if (clipboard !== detail.prompt) throw new Error('Clipboard differs from the complete prompt.');
      mark('Copied-visible-and-clipboard-verified');
      evidence.copy = { label: 'Copied', clipboardMatchesFullPrompt: true, buttonBox: await (await page.$('.prompt-copy')).boundingBox() };
      await snap('prompt-copied');
      await snap('prompt-panel-copied', '.detail-prompt-panel');
      await delay(3500);
      await stop();

      for (const category of ['Motion', 'Product Demo', 'Explainer']) {
        await page.goto(`${website}/?category=${encodeURIComponent(category)}#explore`, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('.project-card');
        await delay(700);
        await snap(`category-${category.replaceAll(' ', '-').toLowerCase()}`);
        const first = (await page.$$('.project-card'))[0];
        const data = await first.evaluate(el => ({ title: el.querySelector('h3')?.textContent, creator: el.querySelector('.card-creator')?.textContent, href: el.querySelector('h3 a')?.href, category: el.querySelector('.card-meta span')?.textContent }));
        if (data.category?.toLowerCase() !== category.toLowerCase()) throw new Error(`Wrong category result: ${category}`);
        const name = `montage-${category.replaceAll(' ', '-').toLowerCase()}`;
        await first.screenshot({ path: path.join(dir, `${name}.png`) });
        evidence.snapshots[name] = { file: `${format}/${name}.png`, ...data };
      }
      writeJSON(path.join(dir, 'evidence.json'), evidence);
      console.log(`${format}: filter, detail playback and clipboard checks passed.`);
    } finally {
      if (recorder) await recorder.stop().catch(() => {});
      writeJSON(path.join(dir, 'evidence.json'), evidence);
      await page.close();
    }
  }
  const videoObject = manifest.formats.portrait.detail.structured.flat().find(value => value['@type'] === 'VideoObject');
  if (!videoObject?.contentUrl) throw new Error('No verified video content URL found; cannot freeze the original.');
  const original = path.join(out, 'cinematic-ai-future.mp4');
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-i', videoObject.contentUrl, '-map', '0:v:0', '-an', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', original], { stdio: 'inherit', timeout: 180000 });
  if (result.status !== 0 || !fs.existsSync(original) || !fs.statSync(original).size) throw new Error('Original media freeze failed. Keep successful UI captures, but stop before authoring the opening.');
  manifest.original = { file: 'cinematic-ai-future.mp4', source: videoObject.contentUrl, creator: 'Gowtham', audio: 'omitted; use separate licensed score', page: `${website}/projects/${slug}` };
  manifest.ok = true;
  writeJSON(path.join(out, 'manifest.json'), manifest);
  fs.mkdirSync(path.join(project, '.hyperframes'), { recursive: true });
  writeJSON(path.join(project, '.hyperframes/interaction-capture.json'), { path: path.relative(project, out), ok: true });
  console.log(`SUCCESS: ${out}/manifest.json`);
  console.log('Footage is ready for visual review and composition. No final film has been rendered by this capture script.');
} catch (error) {
  manifest.errors.push(error.message);
  writeJSON(path.join(out, 'manifest.json'), manifest);
  fs.writeFileSync(path.join(out, 'BLOCKED.md'), `# Interaction capture incomplete\n\n${error.stack}\n`);
  console.error(`STOP: ${error.message}\nEvidence retained at ${out}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
  fs.rmSync(profile, { recursive: true, force: true });
}
