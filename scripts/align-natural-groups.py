"""Measure word positions in the longer local narration takes."""
import json
import pathlib
import subprocess

import numpy as np
from faster_whisper import WhisperModel

repo = pathlib.Path(__file__).resolve().parent.parent
base = repo / 'videos/made-with-hyperframes/assets/voice/natural-candidate'
ffmpeg = repo / 'tools/capture/node_modules/ffmpeg-static/ffmpeg'
model = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=4)
result = {}
for file in sorted(base.glob('*.wav')):
    pcm = subprocess.check_output([str(ffmpeg), '-v', 'error', '-i', str(file), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
    samples = np.frombuffer(pcm, dtype=np.float32)
    segments, _ = model.transcribe(samples, language='en', word_timestamps=True, beam_size=5, vad_filter=False, condition_on_previous_text=False)
    result[file.stem] = [dict(text=w.word.strip(), start=round(w.start, 3), end=round(w.end, 3)) for s in segments for w in s.words if w.word.strip()]
    print(file.stem, len(result[file.stem]), 'words', flush=True)
(base / 'alignment.json').write_text(json.dumps(result, indent=2) + '\n')
