import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const project = path.resolve('videos/made-with-hyperframes');
const batch = fs.readFileSync(path.join(project, 'qa/latest-render-directory.txt'), 'utf8').trim();
const inspection = JSON.parse(fs.readFileSync(path.join(batch, 'inspection.json'), 'utf8'));
if (!inspection.ok || inspection.exports?.length !== 3 || inspection.exports.some(entry => !entry.ok)) {
  throw new Error('Candidate export inspection did not pass.');
}
const names = [
  ['portrait', 'main-portrait.mp4'],
  ['landscape', 'main-landscape.mp4'],
  ['cutdown', 'cutdown-portrait.mp4'],
];
for (const [variant] of names) {
  const check = JSON.parse(fs.readFileSync(path.join(project, 'qa', variant, 'final-check.json'), 'utf8'));
  if (!check.ok) throw new Error(`${variant} source check did not pass.`);
}
const exports = names.map(([variant, target]) => {
  const inspected = inspection.exports.find(entry => entry.format === variant);
  const source = path.join(batch, `${variant}.mp4`);
  if (!inspected || path.resolve(inspected.file) !== source) throw new Error(`${variant} was not inspected in this batch.`);
  const bytes = fs.readFileSync(source);
  if (bytes.length !== inspected.bytes) throw new Error(`${variant} size changed after inspection.`);
  const destination = path.join(project, 'renders', target);
  fs.copyFileSync(source, destination);
  return {
    file: target,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    duration: inspected.duration,
    fps: inspected.expected.fps,
    width: inspected.expected.width,
    height: inspected.expected.height,
  };
});
const manifest = {
  cli: JSON.parse(fs.readFileSync(path.join(project, 'package.json'), 'utf8')).scripts.render.match(/hyperframes@([0-9.]+)/)?.[1] ?? 'unknown',
  revision: 'x-transition-polish-2026-10-29',
  exports,
  cover: 'cover.png',
  editableProjects: ['../index.html', '../landscape/index.html', '../cutdown/index.html'],
  qa: '../qa/DELIVERY_REVIEW.md',
};
fs.writeFileSync(path.join(project, 'renders/delivery-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Delivered ${exports.length} checked MP4s from ${batch}`);
