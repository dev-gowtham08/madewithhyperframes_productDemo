#!/usr/bin/env bash
# Normal-terminal audio preparation. Uses existing HeyGen authentication.
set -euo pipefail
demo_repo="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
demo_project="$demo_repo/videos/made-with-hyperframes"
demo_audio_engine=/home/gowtham/.agents/skills/media-use/audio/scripts/audio.mjs
test -f "$demo_audio_engine"
export PATH="$demo_repo/tools/capture/node_modules/ffmpeg-static:$PATH"
command -v ffmpeg >/dev/null
cd "$demo_project"
if ! npx --yes hyperframes@0.8.196 auth status; then
  printf '\nVoice/music authentication is unavailable. Sign in with HeyGen OAuth, then rerun.\n' >&2
  printf 'OAuth uses the available plan allowance; API keys bill API credits. No fallback voice is silently selected.\n' >&2
  exit 1
fi
if test -f audio_meta.json || test -f audio_meta_cutdown.json; then
  printf 'Audio metadata already exists. Inspect it before regenerating paid or metered audio.\n' >&2
  exit 1
fi
node "$demo_audio_engine" --request ./audio_request.json --hyperframes . --out ./audio_meta.json --only tts,bgm
node "$demo_audio_engine" --request ./audio_request_cutdown.json --hyperframes . --out ./audio_meta_cutdown.json --only tts
node --input-type=module <<'NODE'
import fs from 'node:fs';
for (const [file, expected] of [['audio_meta.json', 7], ['audio_meta_cutdown.json', 1]]) {
  const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (meta.voices?.length !== expected) throw new Error(`${file}: expected ${expected} complete voice clips. Inspect anomalies.`);
  for (const voice of meta.voices) {
    if (!voice.words?.length || !(voice.duration_s > 0) || !fs.existsSync(voice.path)) throw new Error(`${file}: missing audio/timing for ${voice.id}`);
  }
  if (expected === 7 && (!meta.bgm?.path || !fs.existsSync(meta.bgm.path))) throw new Error('Music retrieval did not complete. Do not silently omit the bed.');
  console.log(file, meta.voices.map(v => `${v.id}: ${v.duration_s}s`).join(', '));
}
console.log('Audio generated. Listening review, music license/provenance review and mix/word-timing QA are still required before final render.');
NODE
