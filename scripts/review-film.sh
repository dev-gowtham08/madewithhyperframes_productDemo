#!/usr/bin/env bash
# Run from the normal terminal: browser-backed visual QA; does not publish.
set -euo pipefail
demo_repo="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
demo_project="$demo_repo/videos/made-with-hyperframes"
export PATH="$demo_repo/tools/capture/node_modules/ffmpeg-static:$PATH"
cd "$demo_project"
mkdir -p qa/portrait qa/landscape qa/cutdown
# Read-only freshness probe; use the installed project pin for this review.
npx --yes hyperframes@latest upgrade --project . --check > qa/cli-freshness.txt 2>&1
for demo_variant in portrait landscape cutdown; do
 demo_dir="$demo_project"
 if [[ "$demo_variant" != portrait ]]; then demo_dir="$demo_project/$demo_variant"; fi
 printf '\nChecking %s\n' "$demo_variant"
 npx --yes hyperframes@0.8.196 check "$demo_dir" --samples 9 --json > "qa/$demo_variant/check.json" || true
 if [[ "$demo_variant" = cutdown ]]; then
  demo_times='0,0.5,2.75,3.5,4.5,5,6.5,7.55,7.7,9.5,10,10.6,12,14.9'
 else
  demo_times='0,0.5,2.75,3.5,4.5,7.5,8.85,8.9,10.8,13,15.35,15.4,17.5,19.05,19.1,21.5,21.75,23.5,25.35,25.4,27.3,29.3,30.85,30.9,31.6,33.5,35.9'
 fi
 npx --yes hyperframes@0.8.196 snapshot "$demo_dir" --at "$demo_times" --output "$demo_project/qa/$demo_variant/frames" --json > "qa/$demo_variant/snapshot.json"
done
printf '\nSUCCESS: scene and transition snapshots saved under %s/qa\n' "$demo_project"
printf 'These are review frames; final MP4s follow after visual fixes and audio finishing.\n'
