#!/usr/bin/env bash
# Full candidate exports for inspection. Run in the normal terminal.
set -euo pipefail
demo_repo="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
demo_project="$demo_repo/videos/made-with-hyperframes"
export PATH="$demo_repo/tools/capture/node_modules/ffmpeg-static:$PATH"
demo_probe="$(node -e 'process.stdout.write(require(process.argv[1]).path)' "$demo_repo/tools/capture/node_modules/ffprobe-static")"
export PATH="$(dirname "$demo_probe"):$PATH"
ffprobe -version > /dev/null
cd "$demo_project"
node --input-type=module <<'NODE'
import fs from 'node:fs';
for(const [file,n]of [['audio_meta_local.json',8],['audio_meta_local_cutdown.json',4]]){const m=JSON.parse(fs.readFileSync(file));if(m.tts_provider!=='kokoro'||m.voices.length!==n||m.voices.some(v=>!v.words.length))throw Error('Local voice/timing not ready: '+file);}
if(JSON.parse(fs.readFileSync('EDIT_PLAN.json')).audioStatus!=='local-commercial-review')throw Error('Build still references noncommercial audio.');
NODE
if ! test -f node_modules/@hyperframes/core/package.json; then
 npm install --save-dev @hyperframes/core
fi
cp package.json qa/package-before-upgrade.json
npx --yes hyperframes@latest upgrade --project . > qa/cli-upgrade.txt 2>&1
demo_version="$(node -e "const p=require('./package.json');process.stdout.write(p.scripts.render.match(/hyperframes@([0-9.]+)/)[1])")"
# Validate the updated version before adopting it. Preserve dependency install
# if upgrade validation fails, and return to the previously saved pin.
if ! npx --yes "hyperframes@$demo_version" check . --samples 5 --json > qa/upgrade-check.json; then
 cp qa/package-before-upgrade.json package.json
 demo_version="$(node -e "const p=require('./package.json');process.stdout.write(p.scripts.render.match(/hyperframes@([0-9.]+)/)[1])")"
 printf 'Upgrade check failed; restored prior project pin %s.\n' "$demo_version"
fi
npx --yes "hyperframes@$demo_version" usage --json > qa/usage-before-render.json || true
for demo_variant in portrait landscape cutdown; do
 demo_dir="$demo_project"
 if [[ "$demo_variant" != portrait ]]; then demo_dir="$demo_project/$demo_variant"; fi
 node /home/gowtham/.agents/skills/hyperframes-audio/scripts/carve.mjs --comp "$demo_dir/index.html" --core "$demo_project" --bed music-bed > "qa/$demo_variant/carve.log" 2>&1
 npx --yes "hyperframes@$demo_version" check "$demo_dir" --samples 9 --json > "qa/$demo_variant/final-check.json"
 if [[ "$demo_variant" = cutdown ]]; then
  demo_times='0,1,2.5,3.9,4,5.3,7.8,8,9.4,11.5,14.9'
 else
  demo_times='0,1,2.8,5.9,6,7.5,8.9,9,11,13.5,14.9,15,17,18.9,19,21.5,24.9,25,27,30.9,31,32,35.9'
 fi
 npx --yes "hyperframes@$demo_version" snapshot "$demo_dir" --at "$demo_times" --output "$demo_project/qa/$demo_variant/final-frames" --json > "qa/$demo_variant/final-snapshot.json"
done
# The user has explicitly authorized rendering; this opens the editable review
# surface and keeps it alive. It is not publication or deployment.
if ! npx --yes "hyperframes@$demo_version" preview --status > qa/preview.log 2>&1; then
 npx --yes "hyperframes@$demo_version" preview --background --port 3017 >> qa/preview.log 2>&1
 npx --yes "hyperframes@$demo_version" preview --status >> qa/preview.log 2>&1
fi
demo_batch="$(mktemp -d "$demo_project/renders/review.XXXXXX")"
printf '%s\n' "$demo_batch" > qa/latest-render-directory.txt
for demo_variant in portrait landscape cutdown; do
 demo_dir="$demo_project"
 if [[ "$demo_variant" != portrait ]]; then demo_dir="$demo_project/$demo_variant"; fi
 printf '\nRendering %s at 30 fps using HyperFrames %s\n' "$demo_variant" "$demo_version"
 npx --yes "hyperframes@$demo_version" render "$demo_dir" --fps 30 --quality delivery --workers 1 --output "$demo_batch/$demo_variant.mp4" 2>&1 | tee "qa/$demo_variant/render.log"
done
node "$demo_repo/scripts/inspect-exports.mjs" "$demo_batch"
printf '\nSUCCESS: three candidate exports are ready for full inspection in %s\n' "$demo_batch"
printf 'Keep the music attribution in SOURCES_AND_RIGHTS.md with published videos.\n'
