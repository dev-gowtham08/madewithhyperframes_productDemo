"""Check final mixed-audio intelligibility using the already cached local model.

This is a transcription check, not a human listening review.
"""
import json
import pathlib
import subprocess
import sys
import numpy as np
from faster_whisper import WhisperModel

repo = pathlib.Path(__file__).resolve().parent.parent
project = repo / 'videos/made-with-hyperframes'
batch = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(
    (project / 'qa/latest-render-directory.txt').read_text().strip())
model = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=2)
report = {'method': 'Local Whisper small.en on final mixed audio; no initial script prompt',
          'listeningReview': 'Not performed; machine transcription does not replace listening.',
          'exports': {}}
for name in ['portrait', 'landscape', 'cutdown']:
    pcm = subprocess.check_output([
        str(repo / 'tools/capture/node_modules/ffmpeg-static/ffmpeg'),
        '-v', 'error', '-i', str(batch / (name + '.mp4')),
        '-vn', '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
    segments, _ = model.transcribe(np.frombuffer(pcm, dtype=np.float32),
                                   language='en', beam_size=5,
                                   condition_on_previous_text=False)
    rows = [{'start': s.start, 'end': s.end, 'text': s.text} for s in segments]
    report['exports'][name] = rows
    print(name + ': ' + ' '.join(s['text'].strip() for s in rows), flush=True)
    (project / 'qa/export-transcription.json').write_text(json.dumps(report, indent=2) + '\n')
