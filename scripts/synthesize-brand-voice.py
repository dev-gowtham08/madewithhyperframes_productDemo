import pathlib,json,os
os.environ['OMP_NUM_THREADS']='2'
os.environ['OPENBLAS_NUM_THREADS']='2'
import onnxruntime as ort
import kokoro_onnx,soundfile as sf
p=pathlib.Path(__file__).resolve().parent.parent/'videos/made-with-hyperframes'
cache=pathlib.Path.home()/'.cache/hyperframes/tts'
opts=ort.SessionOptions();opts.intra_op_num_threads=2;opts.inter_op_num_threads=1
session=ort.InferenceSession(str(cache/'models/kokoro-v1.0.onnx'),sess_options=opts,providers=['CPUExecutionProvider'])
model=kokoro_onnx.Kokoro.from_session(session,str(cache/'voices/voices-v1.0.bin'))
for req in ['audio_request_local.json','audio_request_local_cutdown.json']:
 for line in json.loads((p/req).read_text())['lines']:
  f=p/'assets/voice'/f"{line['id']}.wav"
  if f.exists() and f.stat().st_size>1000:continue
  audio,sr=model.create(line['text'],voice='af_heart',speed=.96,lang='en-us');sf.write(str(f),audio,sr);print(line['id'],len(audio)/sr,flush=True)
