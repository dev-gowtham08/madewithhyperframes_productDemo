#!/usr/bin/env bash
# User-selected local voice + CC BY 4.0 music. Run in the normal terminal.
set -euo pipefail
demo_repo="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
demo_project="$demo_repo/videos/made-with-hyperframes"
export HYPERFRAMES_TTS_CONCURRENCY=1
export PATH="$demo_repo/tools/capture/node_modules/ffmpeg-static:$PATH"
cd "$demo_project"
# Isolated local speech dependencies; no system Python packages are changed.
if ! test -x "$demo_repo/tools/audio-venv/bin/python"; then
 python3 -m venv "$demo_repo/tools/audio-venv"
fi
"$demo_repo/tools/audio-venv/bin/python" -m pip install kokoro-onnx soundfile faster-whisper
export HYPERFRAMES_PYTHON="$demo_repo/tools/audio-venv/bin/python"
"$HYPERFRAMES_PYTHON" "$demo_repo/scripts/synthesize-natural-voice.py"
"$HYPERFRAMES_PYTHON" "$demo_repo/scripts/align-natural-groups.py"
"$HYPERFRAMES_PYTHON" "$demo_repo/scripts/split-natural-voice.py"
cp assets/voice/natural-candidate/segments/*.wav assets/voice/
"$HYPERFRAMES_PYTHON" "$demo_repo/scripts/align-local-voice.py"
mkdir -p assets/licenses
if ! test -s assets/bgm/origami.mp3; then
 curl --fail --location --retry 2 --max-time 180 'https://www.scottbuckley.com.au/library/wp-content/uploads/2025/10/Origami.mp3' --output assets/bgm/origami.download.mp3
 ffmpeg -v error -xerror -i assets/bgm/origami.download.mp3 -f null -
 mv assets/bgm/origami.download.mp3 assets/bgm/origami.mp3
fi
curl --fail --location --max-time 60 'https://www.scottbuckley.com.au/library/origami/' --output assets/licenses/origami-source.html
curl --fail --location --max-time 60 'https://raw.githubusercontent.com/hexgrad/kokoro/main/LICENSE' --output assets/licenses/kokoro-LICENSE.txt
node --input-type=module <<'NODE'
import fs from 'node:fs'; import crypto from 'node:crypto';
for (const [file,count] of [['audio_meta_local.json',8],['audio_meta_local_cutdown.json',4]]) {
 const m=JSON.parse(fs.readFileSync(file)); if(m.tts_provider!=='kokoro'||m.voices?.length!==count)throw Error(`${file}: incomplete local synthesis; inspect anomalies before retry.`);
 for (const v of m.voices)if(!v.words?.length||!fs.existsSync(v.path))throw Error(`${v.id}: missing local audio or word alignment.`);
 console.log(file,m.voices.map(v=>`${v.id}: ${v.duration_s}s`).join(', '));
}
fs.writeFileSync('assets/licenses/music.json',JSON.stringify({title:'Origami',creator:'Scott Buckley',source:'https://www.scottbuckley.com.au/library/origami/',license:'CC BY 4.0',licenseURL:'https://creativecommons.org/licenses/by/4.0/',credit:"'Origami' by Scott Buckley — released under CC-BY 4.0. www.scottbuckley.com.au",modifications:'Excerpted, faded and mixed under narration.',sha256:crypto.createHash('sha256').update(fs.readFileSync('assets/bgm/origami.mp3')).digest('hex')},null,2));
console.log('SUCCESS: local narration, word timing and licensed music are ready.');
NODE
# The installed audio finishing skill requires this analysis package.
npm install --save-dev @hyperframes/core
