"""Measured word timing from local Whisper; no estimated word timestamps."""
import json, pathlib, subprocess, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
project=pathlib.Path(__file__).resolve().parent.parent/'videos/made-with-hyperframes'
model=WhisperModel('small.en',device='cpu',compute_type='int8',cpu_threads=4)
for request_name,output_name in [('audio_request_local.json','audio_meta_local.json'),('audio_request_local_cutdown.json','audio_meta_local_cutdown.json')]:
    request=json.loads((project/request_name).read_text())
    voices=[]
    for line in request['lines']:
        rel='assets/voice/'+line['id']+'.wav'
        info=sf.info(str(project/rel))
        pcm=subprocess.check_output([str(project.parent.parent/'tools/capture/node_modules/ffmpeg-static/ffmpeg'),'-v','error','-i',str(project/rel),'-f','f32le','-ac','1','-ar','16000','-'])
        samples=np.frombuffer(pcm,dtype=np.float32)
        segments,_=model.transcribe(samples,language='en',word_timestamps=True,beam_size=5,initial_prompt=line['text'],vad_filter=False,condition_on_previous_text=False)
        words=[]
        for segment in segments:
            for word in segment.words:
                if word.word.strip(): words.append(dict(id='w'+str(len(words)),text=word.word.strip(),start=round(word.start,3),end=round(word.end,3)))
        if not words: raise RuntimeError('No aligned words: '+line['id'])
        voices.append(dict(id=line['id'],path=rel,duration_s=round(info.duration,3),words=words))
        print(line['id'],info.duration,'seconds,',len(words),'measured words',flush=True)
    target=project/output_name
    if target.exists():
        old=json.loads(target.read_text())
        if not old.get('voices'): (project/(output_name+'.failed')).write_text(target.read_text())
    target.write_text(json.dumps(dict(tts_provider='kokoro',voice_id=request.get('voice','af_heart'),alignment='faster-whisper small.en CPU int8',voices=voices,bgm=None,total_duration_s=sum(v['duration_s'] for v in voices)),indent=2)+'\n')
