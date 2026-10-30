import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../videos/made-with-hyperframes');
for(const name of ['audio_request_local.json','audio_request_local_cutdown.json']){
 const req=JSON.parse(fs.readFileSync(path.join(project,name)));
 for(const line of req.lines){
  const output=`assets/voice/${line.id}.wav`;
  if(fs.existsSync(path.join(project,output))&&fs.statSync(path.join(project,output)).size>1000){console.log(`Keep ${output}`);continue;}
  console.log(`Local voice: ${line.id}`);
  const r=spawnSync('npx',['--yes','hyperframes@0.8.214','tts',line.text,'--voice','af_heart','--speed','0.96','--output',output],{cwd:project,stdio:'inherit'});
  if(r.status!==0)throw Error(`${line.id}: TTS exited ${r.status}, signal ${r.signal}. See error above.`);
 }
}
