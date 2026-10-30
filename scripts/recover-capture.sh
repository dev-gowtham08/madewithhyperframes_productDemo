#!/usr/bin/env bash
# Run from a normal local terminal with working network and browser access.
# Preserves the existing brief, compositions, and failed capture evidence.
set -euo pipefail

demo_repo="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$demo_repo/videos/made-with-hyperframes"
test -f BRIEF.md
test -f hyperframes.json

node -e 'if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Node 22 or newer is required")'
curl --fail --silent --show-error --location --max-time 30 --output /dev/null https://registry.npmjs.org/hyperframes
curl --fail --silent --show-error --location --max-time 30 --output /dev/null https://www.madewithhyperframes.com/
node --input-type=module <<'NODE'
import http from 'node:http';
const server = http.createServer((req, res) => res.end('ok'));
server.on('error', error => { console.error(error); process.exitCode = 1; });
server.listen(0, '127.0.0.1', () => {
  console.log('Loopback listener available.');
  server.close();
});
NODE

# mktemp gives every attempt an isolated directory; never merge blocked captures.
demo_attempt="$(mktemp -d "$PWD/capture-retry.XXXXXXXX")"
printf 'Capture attempt: %s\n' "$demo_attempt"
npx --yes hyperframes@0.8.196 capture https://www.madewithhyperframes.com/ \
  -o "$demo_attempt/site" --json \
  > "$demo_attempt/result.log" 2> "$demo_attempt/stderr.log" || {
    cat "$demo_attempt/result.log" "$demo_attempt/stderr.log"
    printf 'Capture failed. Stop; retain this attempt for diagnosis.\n' >&2
    exit 1
  }
cat "$demo_attempt/result.log" "$demo_attempt/stderr.log"

node --input-type=module - "$demo_attempt" <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
const attempt = process.argv[2];
const raw = fs.readFileSync(path.join(attempt, 'result.log'), 'utf8');
const objects = [];
try { objects.push(JSON.parse(raw)); } catch {}
for (const line of raw.split('\n')) {
  try { objects.push(JSON.parse(line)); } catch {}
}
if (!objects.some(value => value?.ok === true)) {
  throw new Error('No parseable ok:true capture result. Stop and inspect result.log.');
}
const site = path.join(attempt, 'site');
if (fs.existsSync(path.join(site, 'BLOCKED.md'))) throw new Error('BLOCKED.md exists. Stop.');
for (const relative of ['extracted/tokens.json', 'extracted/visible-text.txt', 'extracted/asset-descriptions.md']) {
  if (!fs.statSync(path.join(site, relative)).size) throw new Error(`Missing or empty: ${relative}`);
}
if (!fs.statSync(path.join(site, 'assets')).isDirectory()) throw new Error('Missing assets directory');
const screenshots = path.join(site, 'screenshots');
if (!fs.existsSync(screenshots) || !fs.readdirSync(screenshots).some(name => /\.(png|jpe?g|webp)$/i.test(name))) {
  throw new Error('No screenshots found. Stop and inspect capture output.');
}
console.log(`Capture passed machine checks: ${site}`);
console.log('Next: visually inspect actual page content, verify interactions and media, then resume the saved brief.');
console.log('This does not certify the pixels, rights, or completeness of the interaction recordings.');
NODE
