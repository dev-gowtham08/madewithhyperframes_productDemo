"""Cut approved candidate takes at measured inter-sentence silences."""
import json
import pathlib

import soundfile as sf

repo = pathlib.Path(__file__).resolve().parent.parent
project = repo / 'videos/made-with-hyperframes'
base = project / 'assets/voice/natural-candidate'
out = base / 'segments'
out.mkdir(exist_ok=True)
groups = {
    'main-0': (['brandfirst-brand', 'brandfirst-directory'], [1.58]),
    'main-1': (['brandfirst-search', 'brandfirst-filter'], [3.28]),
    'main-2': (['brandfirst-watch', 'brandfirst-copy'], [2.65]),
    'main-3': (['brandfirst-submit', 'brandfirst-cta'], [4.04]),
    'cutdown-0': (['brandfirst-short-brand', 'brandfirst-short-copy'], [3.67]),
    'cutdown-1': (['brandfirst-short-submit', 'brandfirst-short-cta'], [2.00]),
}
alignment = json.loads((base / 'alignment.json').read_text())
for stem, (names, cuts) in groups.items():
    audio, sr = sf.read(base / f'{stem}.wav')
    edges = [0, *cuts, len(audio) / sr]
    words = alignment[stem]
    for i, name in enumerate(names):
        start, end = edges[i:i+2]
        piece = audio[round(start * sr):round(end * sr)]
        if not len(piece):
            raise ValueError(name + ' is empty')
        sf.write(out / f'{name}.wav', piece, sr)
        spoken = [w['text'] for w in words if start <= (w['start'] + w['end']) / 2 < end]
        print(f'{name}: {len(piece)/sr:.3f}s — {" ".join(spoken)}', flush=True)
