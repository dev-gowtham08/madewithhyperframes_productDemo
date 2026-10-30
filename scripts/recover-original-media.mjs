// Run in the normal terminal. Reuses verified UI; never launches a browser or regenerates audio.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const project = path.join(repo, 'videos/made-with-hyperframes');
const take = path.resolve(repo, process.argv[2] || 'videos/made-with-hyperframes/interaction-capture.m20iZP');
if (path.dirname(take) !== project) throw new Error('Capture must be directly inside the existing project.');
const manifestPath = path.join(take, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath));
const requireTool = createRequire(path.join(repo, 'tools/capture/package.json'));
const ffmpeg = process.env.FFMPEG_PATH || requireTool('ffmpeg-static');
const json = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
for (const format of ['portrait', 'landscape']) {
  const e = manifest.formats[format];
  if (!e?.playback?.verified || !e.copy?.clipboardMatchesFullPrompt || e.copy.label !== 'Copied' || !e.filteredCards?.length || e.filteredCards.some(c => !c.fullPrompt)) throw new Error(`${format}: UI evidence gate failed`);
  for (const c of Object.values(e.clips)) if (!fs.statSync(path.join(take, c.file)).size) throw new Error(`Empty clip ${c.file}`);
}
if (manifest.ok && manifest.original?.file && fs.existsSync(path.join(take, manifest.original.file))) {
  console.log('Original already frozen; keeping existing capture.'); process.exit(0);
}
const source = manifest.formats.portrait.detail.structured.flat().find(v => v['@type'] === 'VideoObject')?.contentUrl;
if (!source) throw new Error('Verified detail metadata has no content URL.');
const work = fs.mkdtempSync(path.join(take, 'media-recovery.'));
const report = { source, startedAt: new Date().toISOString(), ok: false, requests: [], processes: [], preservedUI: true };
const ledger = path.join(work, 'report.json');
const output = path.join(work, 'cinematic-ai-future.mp4');
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
let counter = 0;
function safeURL(value, base) {
  const url = new URL(value, base);
  if (url.protocol !== 'https:' || !(url.hostname === 'video.twimg.com' || url.hostname.endsWith('.twimg.com'))) throw new Error(`Unexpected media URL: ${url.origin}`);
  return url.href;
}
async function download(url) {
  url = safeURL(url);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const entry = { url, attempt }; report.requests.push(entry); json(ledger, report);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'error' });
      entry.status = response.status;
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      const data = Buffer.from(await response.arrayBuffer());
      if (!data.length || data.length > 150_000_000) throw new Error(`Unexpected media size ${data.length}`);
      entry.bytes = data.length; json(ledger, report); return data;
    } catch (error) { entry.error = `${error.message}${error.cause ? ': ' + error.cause.message : ''}`; json(ledger, report); if (attempt === 3) throw new Error(`Media fetch failed: ${url}\n${entry.error}`); }
  }
}
async function freezePlaylist(url, depth = 0) {
  if (depth > 4) throw new Error('Unexpected HLS nesting.');
  const text = (await download(url)).toString('utf8');
  if (!text.startsWith('#EXTM3U')) throw new Error('Response is not an HLS playlist.');
  const lines = text.trim().split(/\r?\n/);
  const variants = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith('#EXT-X-STREAM-INF:')) {
    const resolution = lines[i].match(/RESOLUTION=(\d+)x(\d+)/);
    variants.push({ url: safeURL(lines[i + 1], url), pixels: resolution ? Number(resolution[1]) * Number(resolution[2]) : 0, bandwidth: Number(lines[i].match(/(?:^|[:,])BANDWIDTH=(\d+)/)?.[1] || 0) });
  }
  if (variants.length) {
    variants.sort((a, b) => b.pixels - a.pixels || b.bandwidth - a.bandwidth);
    report.selectedVariant = variants[0]; json(ledger, report);
    return freezePlaylist(variants[0].url, depth + 1);
  }
  if (!lines.includes('#EXT-X-ENDLIST')) throw new Error('Expected a finite VOD playlist.');
  if (lines.some(line => line.startsWith('#EXT-X-KEY:') && !line.includes('METHOD=NONE'))) throw new Error('Encrypted HLS is unsupported. Supply the creator-owned source export instead.');
  const cache = new Map();
  async function localURI(uri) {
    const absolute = safeURL(uri, url);
    if (!cache.has(absolute)) {
      const ext = path.extname(new URL(absolute).pathname).match(/^\.[a-z0-9]{1,6}$/i)?.[0] || '.bin';
      const name = `media-${String(counter++).padStart(3, '0')}${ext}`;
      fs.writeFileSync(path.join(work, name), await download(absolute)); cache.set(absolute, name);
    }
    return cache.get(absolute);
  }
  const localLines = [];
  for (const line of lines) {
    if (!line.startsWith('#') && line.trim()) localLines.push(await localURI(line));
    else if (line.includes('URI="')) {
      const uri = line.match(/URI="([^"]+)"/)[1];
      localLines.push(line.replace(`URI="${uri}"`, `URI="${await localURI(uri)}"`));
    } else localLines.push(line);
  }
  const file = path.join(work, 'local.m3u8'); fs.writeFileSync(file, localLines.join('\n') + '\n'); return file;
}
async function run(name, args) {
  const entry = { name, args, executable: ffmpeg }; report.processes.push(entry); json(ledger, report);
  const logfile = path.join(work, `${name}.log`); const log = fs.createWriteStream(logfile);
  const child = spawn(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  const timer = setTimeout(() => { entry.timedOut = true; child.kill('SIGTERM'); }, 180000);
  let tail = '';
  child.stderr.on('data', data => { log.write(data); tail = (tail + data).slice(-5000); });
  const result = await new Promise(resolve => { child.on('error', error => resolve({ error: error.message })); child.on('close', (status, signal) => resolve({ status, signal })); });
  clearTimeout(timer); log.end(); Object.assign(entry, result); json(ledger, report);
  if (result.status !== 0) throw new Error(`${name} failed: ${JSON.stringify(result)}\n${tail}\nLog: ${logfile}`);
  return tail;
}
try {
  console.log(`Reusing both verified layouts in ${take}\nMedia diagnostics: ${work}`);
  // Node downloads HTTPS; FFmpeg reads only frozen local bytes. This runs in the user's normal terminal.
  const playlist = await freezePlaylist(source);
  await run('encode', ['-hide_banner', '-nostdin', '-protocol_whitelist', 'file,crypto,data', '-allowed_extensions', 'ALL', '-i', playlist, '-map', '0:v:0', '-an', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output]);
  const probe = await run('decode-check', ['-hide_banner', '-nostdin', '-v', 'info', '-xerror', '-i', output, '-map', '0:v:0', '-f', 'null', '-']);
  const duration = probe.match(/Duration: (\d+):(\d+):([\d.]+)/);
  const seconds = duration ? Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]) : 0;
  if (seconds < 9 || seconds > 12 || fs.statSync(output).size < 10000) throw new Error(`Unexpected original-video duration/size: ${seconds}s`);
  const destination = path.join(take, 'cinematic-ai-future.mp4');
  if (fs.existsSync(destination)) throw new Error('Existing original found; inspect it before replacing.');
  fs.renameSync(output, destination);
  manifest.original = { file: 'cinematic-ai-future.mp4', source, creator: 'Gowtham', page: manifest.formats.portrait.detail.url, audio: 'omitted; separate score', duration: seconds, sha256: sha(destination), recoveryReport: path.relative(take, ledger) };
  manifest.ok = true; manifest.recoveredAt = new Date().toISOString();
  json(manifestPath, manifest);
  fs.mkdirSync(path.join(project, '.hyperframes'), { recursive: true });
  json(path.join(project, '.hyperframes/interaction-capture.json'), { path: path.relative(project, take), ok: true });
  if (fs.existsSync(path.join(take, 'BLOCKED.md'))) fs.renameSync(path.join(take, 'BLOCKED.md'), path.join(work, 'previous-BLOCKED.md'));
  report.ok = true; report.original = manifest.original; json(ledger, report);
  console.log(`SUCCESS: ${destination}\nDecoded ${seconds}s; original hash ${manifest.original.sha256}\nBoth UI captures preserved. Ready for visual review and composition.`);
} catch (error) {
  report.error = error.stack; json(ledger, report);
  console.error(`STOP: ${error.message}\nDiagnostic report: ${ledger}\nSuccessful UI/audio remain untouched.`); process.exitCode = 1;
}
