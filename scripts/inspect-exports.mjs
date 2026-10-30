import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const project=path.join(repo,'videos/made-with-hyperframes');const ff=createRequire(path.join(repo,'tools/capture/package.json'))('ffmpeg-static');
const batch=path.resolve(process.argv[2]||fs.readFileSync(path.join(project,'qa/latest-render-directory.txt'),'utf8').trim());
const report={ok:false,batch,checkedAt:new Date().toISOString(),exports:[]};
for(const [format,width,height,duration]of [['portrait',1080,1920,36],['landscape',1920,1080,36],['cutdown',1080,1920,15]]){
 const file=path.join(batch,format+'.mp4');if(!fs.existsSync(file))throw Error('Missing export '+file);
 const out=path.join(project,'qa',format,'export');fs.mkdirSync(out,{recursive:true});
 const r=spawnSync(ff,['-hide_banner','-nostdin','-xerror','-i',file,'-map','0:v:0','-map','0:a:0','-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8',maxBuffer:4e6});fs.writeFileSync(path.join(out,'decode-audio.log'),r.stderr);
 const time=r.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);const actualDuration=time?Number(time[1])*3600+Number(time[2])*60+Number(time[3]):0;
 const stream=r.stderr.split('\n').find(x=>x.includes('Stream #0:0')&&x.includes('Video:'))||'';
 const item={format,file,bytes:fs.statSync(file).size,decodeExit:r.status,videoStream:stream,duration:actualDuration,expected:{width,height,duration,fps:30},ok:r.status===0&&stream.includes(`${width}x${height}`)&&stream.includes('30 fps')&&Math.abs(actualDuration-duration)<.12};report.exports.push(item);
 if(!item.ok){fs.writeFileSync(path.join(batch,'inspection.json'),JSON.stringify(report,null,2));throw Error(`Export verification failed for ${format}; see ${out}/decode-audio.log`);}
 for(let offset=0;offset<duration;offset+=9){
  const q=spawnSync(ff,['-v','error','-nostdin','-ss',String(offset),'-i',file,'-t',String(Math.min(9,duration-offset)),'-vf','fps=1,scale=360:-1,tile=3x3:padding=5:margin=5:color=0x808080','-frames:v','1','-update','1',path.join(out,`seconds-${offset}-${Math.min(offset+8,duration-1)}.jpg`),'-y'],{encoding:'utf8'});if(q.status!==0)throw Error(q.stderr);
 }
 const cuts=format==='cutdown'?[4,8,11.5]:[6,9,15,19,25,31];
 const frames=cuts.flatMap(t=>[Math.round((t-.1)*30),Math.round((t+.2)*30)]);
 const select=frames.map(n=>`eq(n\\,${n})`).join('+');
 const boundary=spawnSync(ff,['-v','error','-nostdin','-i',file,'-vf',`select=${select},scale=360:-1,tile=6x3:padding=5:margin=5:color=0x808080`,'-frames:v','1','-update','1',path.join(out,'transition-boundaries.jpg'),'-y'],{encoding:'utf8'});
 if(boundary.status!==0)throw Error(boundary.stderr);
 fs.writeFileSync(path.join(out,'transition-times.json'),JSON.stringify(frames.map(n=>n/30))+'\n');
 console.log(`${format}: ${width}×${height}, 30 fps, ${actualDuration}s, audio present, complete decode passed.`);
}
report.ok=true;report.visualReview='pending agent inspection';report.listeningReview='pending';fs.writeFileSync(path.join(batch,'inspection.json'),JSON.stringify(report,null,2)+'\n');
console.log('Export contact sheets and audio measurements saved under qa/<format>/export.');
