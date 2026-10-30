"""Generate longer local Kokoro takes for the existing brand-first script.

Candidate output only; this never replaces approved narration assets.
"""
import json
import os
import pathlib
import sys

os.environ['OMP_NUM_THREADS'] = '2'
os.environ['OPENBLAS_NUM_THREADS'] = '2'

import kokoro_onnx
import onnxruntime as ort
import soundfile as sf

repo = pathlib.Path(__file__).resolve().parent.parent
project = repo / 'videos/made-with-hyperframes'
output = project / 'assets/voice/natural-candidate'
output.mkdir(parents=True, exist_ok=True)
cache = pathlib.Path.home() / '.cache/hyperframes/tts'
options = ort.SessionOptions()
options.intra_op_num_threads = 2
options.inter_op_num_threads = 1
session = ort.InferenceSession(str(cache / 'models/kokoro-v1.0.onnx'), sess_options=options, providers=['CPUExecutionProvider'])
model = kokoro_onnx.Kokoro.from_session(session, str(cache / 'voices/voices-v1.0.bin'))

for kind, filename, groups in [
    ('main', 'audio_request_local.json', [[0, 1], [2, 3], [4, 5], [6, 7]]),
    ('cutdown', 'audio_request_local_cutdown.json', [[0, 1], [2, 3]]),
]:
    lines = json.loads((project / filename).read_text())['lines']
    for index, members in enumerate(groups):
        if len(sys.argv) > 1 and f'{kind}-{index}' not in sys.argv[1:]:
            continue
        text = ' '.join(lines[i]['text'] for i in members)
        target = output / f'{kind}-{index}.wav'
        samples, rate = model.create(text, voice='af_bella', speed=0.98, lang='en-us')
        sf.write(target, samples, rate)
        print(f'{target.relative_to(project)} {len(samples)/rate:.3f}s: {text}', flush=True)
