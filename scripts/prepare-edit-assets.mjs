import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=path.join(repo,'videos/made-with-hyperframes');
const req=createRequire(path.join(repo,'tools/capture/package.json'));
const ff=req('ffmpeg-static');
const take=path.join(project,'interaction-capture.m20iZP');
const manifest=JSON.parse(fs.readFileSync(path.join(take,'manifest.json')));
if(!manifest.ok||!manifest.original)throw Error('Successful original media freeze is required.');
const out=path.join(project,'assets/edit');fs.mkdirSync(out,{recursive:true});
fs.copyFileSync(path.join(take,manifest.original.file),path.join(out,'hero.mp4'));
const intro=path.join(out,'hero-intro.mp4');
if(!fs.existsSync(intro)){
 const r=spawnSync(ff,['-v','error','-nostdin','-ss','3.6','-i',path.join(out,'hero.mp4'),'-vf','tpad=stop_mode=clone:stop_duration=2.5','-t','8.9','-an','-c:v','libx264','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',intro],{stdio:'inherit'});
 if(r.status!==0)throw Error('Intro excerpt failed');
}
const ledger=[{output:'assets/edit/hero-intro.mp4',source:'assets/edit/hero.mp4',sourceSeconds:[3.6,10],finalFrameHoldSeconds:2.5,reason:'Verified holographic-brain opening; avoids cropping source city title in portrait.'}];
const cuts={portrait:{discovery:[[0,91],[110,175],[196,227]],detail:[[6,117]],copy:[[0,78]]},landscape:{discovery:[[0,111],[155,236],[283,307]],detail:[[12,123]],copy:[[0,83]]}};
for(const [format,clips]of Object.entries(cuts)){
 for(const [name,ranges]of Object.entries(clips)){
  const original={discovery:'discovery',detail:'open-detail',copy:'copy-prompt'}[name];const file=path.join(take,format,original+'.webm');const dest=path.join(out,`${format}-${name}.mp4`);
  const selector=ranges.map(([a,b])=>`between(n,${a},${b-1})`).join('+');
  if(!fs.existsSync(dest)){
   const r=spawnSync(ff,['-v','error','-nostdin','-i',file,'-vf',`select='${selector}',setpts=N/(30*TB)`,'-an','-c:v','libx264','-crf','16','-pix_fmt','yuv420p','-r','30','-movflags','+faststart',dest],{stdio:'inherit'});if(r.status!==0)throw Error(`Failed ${name}`);
  }
  ledger.push({output:path.relative(project,dest),source:path.relative(project,file),sourceFrameRangesEndExclusive:ranges,fps:30,reason:'Remove screenshot-induced scale/crop artifacts; all retained frames are actual recorded UI.'});
 }
 for(const name of ['selected-card-context','selected-card','detail-playing','prompt-before','prompt-copied','prompt-panel-before','prompt-panel-copied','montage-motion','montage-product-demo','montage-explainer'])fs.copyFileSync(path.join(take,format,name+'.png'),path.join(out,`${format}-${name}.png`));
}
fs.writeFileSync(path.join(out,'edit-ledger.json'),JSON.stringify(ledger,null,2)+'\n');
fs.mkdirSync(path.join(project,'assets/vendor'),{recursive:true});
fs.copyFileSync('/home/gowtham/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/vendor/npm/gsap@3.15.0/dist/gsap.min.js',path.join(project,'assets/vendor/gsap.min.js'));
console.log('Frozen hero and six edited UI clips ready; source frame ranges recorded.');
