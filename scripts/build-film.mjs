// Editable HyperFrames source builder. Sources are frozen website recordings and captures.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=path.join(repo,'videos/made-with-hyperframes');
const take=JSON.parse(fs.readFileSync(path.join(project,'interaction-capture.m20iZP/manifest.json')));
if(!take.ok)throw Error('Successful authentic capture required.');
const localFile=path.join(project,'audio_meta_local.json');
const hasLocal=fs.existsSync(localFile)&&JSON.parse(fs.readFileSync(localFile)).voices?.length===7;
const mainAudio=JSON.parse(fs.readFileSync(path.join(project,hasLocal?'audio_meta_local.json':'audio_meta.json')));
const shortAudio=JSON.parse(fs.readFileSync(path.join(project,hasLocal?'audio_meta_local_cutdown.json':'audio_meta_cutdown.json')));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const attr=x=>esc(JSON.stringify(x));
const stamp=(s,d,t=0)=>`data-start="${s}" data-duration="${d}" data-track-index="${t}"`;
const img=(src,style='',id='')=>`<img ${id?`id="${id}"`:''} src="assets/edit/${src}" style="${style}" alt="Authentic directory capture"/>`;
const video=(id,src,start,duration,style='',extra='')=>`<video id="${id}" class="clip" src="assets/edit/${src}" muted playsinline ${stamp(start,duration)} style="${style}" ${extra}></video>`;
const fonts=`@font-face{font-family:Demo;src:url('assets/fonts/LiberationSans-Regular.ttf')}@font-face{font-family:Demo;src:url('assets/fonts/LiberationSans-Bold.ttf');font-weight:700}`;
const shared=`${fonts}*{box-sizing:border-box;margin:0}#root{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#0c0d12;color:#f6f5f1;font-family:Demo,sans-serif}.clip{position:absolute;inset:0;width:100%;height:100%}img,video{display:block;object-fit:cover}.scene{position:absolute;inset:0;overflow:hidden;background:#0c0d12}.scene:before{content:"";position:absolute;left:-140px;top:-220px;width:740px;height:740px;background:radial-gradient(circle,#4f3a8d44,transparent 68%);pointer-events:none}.eyebrow{font-size:28px;font-weight:700;letter-spacing:3px;color:#d8ff63;text-transform:uppercase}.headline{font-weight:700;line-height:1.04;letter-spacing:-3px}.note{font-size:32px;line-height:1.35;color:#bab9c7}.brand{display:flex;align-items:center;gap:18px;font-size:42px;font-weight:700;line-height:1.02}.brand img{width:78px;height:78px}.brand small{display:block;font-size:28px;letter-spacing:1.5px;margin-bottom:5px}.ui-frame{position:absolute;overflow:hidden;border:3px solid #4b4568;border-radius:24px;background:#fbfaf7;box-shadow:0 30px 85px #0009}.world{position:absolute;left:0;top:0;transform-origin:0 0}.world>img,.world>video{position:absolute;left:0;top:0;width:100%;height:100%}.credit{font-size:28px;line-height:1.4}.pill{display:inline-flex;padding:18px 30px;background:#d8ff63;border-radius:999px;font-size:32px;font-weight:700;color:#171916}.caption{position:absolute;left:80px;right:130px;top:1590px;text-align:center;z-index:50;font:700 42px/1.24 Demo,sans-serif}.caption span{display:inline-block;background:#171916;color:#fbfaf7;padding:15px 24px;border-radius:14px;max-width:100%}`;
const brand=(id,style='')=>`<div id="${id}" class="brand" style="position:absolute;${style}"><img src="assets/brand/icon.svg" alt="Made With Hyperframes logo"/><div><small>MADE WITH</small>Hyperframes</div></div>`;
const sceneSlots=[['intro',0,8.9],['discovery',8.9,6.5],['detail',15.4,3.7],['prompt',19.1,6.3],['explore',25.4,5.5],['cta',30.9,5.1]];
const plan={fps:30,mainDuration:36,cutdownDuration:15,audioStatus:hasLocal?'local-commercial-review':'internal-preview-only-awaiting-local-voice',variants:[]};
function writeScene(dir,id,w,h,duration,markup,css='',animation=''){
 const html=`<!doctype html><html><head><meta charset="utf-8"/></head><body><template><style>${shared}${css}</style><div id="root" data-composition-id="${id}" data-width="${w}" data-height="${h}" data-duration="${duration}"><div class="scene">${markup}</div></div><script>{const tl=gsap.timeline({paused:true});${animation}window.__timelines[${JSON.stringify(id)}]=tl;}</script></template></body></html>`;
 fs.writeFileSync(path.join(dir,'compositions',`${id}.html`),html);
}
function build(format,short=false){
 const p=format==='portrait',w=p?1080:1920,h=p?1920:1080;const tag=short?'short':format;const dur=short?15:36;
 const dir=short?path.join(project,'cutdown'):p?project:path.join(project,'landscape');fs.mkdirSync(path.join(dir,'compositions'),{recursive:true});
 if(dir!==project){fs.mkdirSync(path.join(dir,'assets'),{recursive:true});for(const name of ['edit','brand','fonts','vendor','voice','bgm','sfx'])if(fs.existsSync(path.join(project,'assets',name)))fs.cpSync(path.join(project,'assets',name),path.join(dir,'assets',name),{recursive:true});fs.copyFileSync(path.join(project,'hyperframes.json'),path.join(dir,'hyperframes.json'));}
 const S=short?[['intro',0,5],['prompt',5,5],['cta',10,5]]:sceneSlots;
 for(const [kind,start,length]of S){
 const id=`${tag}-${kind}`;let m='',css='',a='';
 if(kind==='intro'){
  const e=take.formats[format],b=e.selectedVideoBox;const initialScale=Math.max(w/b.width,h/b.height);const ix=w/2-(b.x+b.width/2)*initialScale,iy=h/2-(b.y+b.height/2)*initialScale;
  const pushScale=initialScale*1.045,px=w/2-(b.x+b.width/2)*pushScale,py=h/2-(b.y+b.height/2)*pushScale;
  const finalScale=p?2.48:1.78;const fx=(p?130:950)-b.x*finalScale,fy=(p?710:205)-b.y*finalScale;
  const cardX=p?90:1020,cardY=p?735:220,cardW=p?900:800;
  const context=short?'':`<div id="${id}-context" class="ui-frame" style="left:${p?60:840}px;top:${p?735:200}px;width:${p?960:1000}px;height:${p?780:625}px;opacity:0">${img(`${format}-selected-card-context.png`,`width:100%;height:100%;object-fit:cover;object-position:${p?'50% 35%':'center'}`)}</div>`;
  m=`<div id="${id}-world" class="world" data-layout-allow-overflow style="width:${e.viewport.width}px;height:${e.viewport.height}px;background:#0c0d12">${video(`${id}-video`,'hero-intro.mp4',0,length,`left:${b.x}px;top:${b.y}px;width:${b.width}px;height:${b.height}px;object-fit:cover`)}</div><div id="${id}-stage" style="position:absolute;inset:0;background:#0c0d12;opacity:0"><div style="position:absolute;right:-180px;top:-220px;width:800px;height:800px;background:radial-gradient(circle,#47338188,transparent 66%)"></div><div style="position:absolute;left:${p?74:90}px;top:${p?620:180}px;width:${p?930:750}px;border-top:3px solid #d8ff63"></div></div><div id="${id}-card" style="position:absolute;left:${cardX}px;top:${cardY}px;width:${cardW}px;opacity:0;border:3px solid #5d4e88;border-radius:28px;overflow:hidden;box-shadow:0 35px 95px #000b">${img(`${format}-selected-card.png`,'width:100%;height:auto')}</div>${context}<div id="${id}-hook" class="headline" style="position:absolute;left:${p?70:100}px;top:${p?225:140}px;width:${p?940:780}px;color:#fbfaf7;font-size:${p?118:108}px;text-shadow:0 5px 35px #000b;opacity:${p?1:0};${p?'':'background:#07080f;padding:26px;border-radius:20px;'}"><div id="${id}-hook-a">Great video.</div><div id="${id}-hook-b" style="color:#d8ff63">What was</div><div id="${id}-hook-c" style="color:#d8ff63">the prompt?</div></div><div id="${id}-credit" class="credit" style="position:absolute;left:${p?76:100}px;top:${p?1430:895}px;color:#fbfaf7;background:#0c0d12eb;padding:12px 20px;border-left:5px solid #d8ff63">Cinematic AI Future · Gowtham</div>${brand(`${id}-brand`,p?'left:76px;top:140px':'left:90px;top:90px')}<div id="${id}-reveal" style="position:absolute;left:${p?76:90}px;top:${p?355:365}px;width:${p?920:800}px"><div class="eyebrow">DISCOVER / 01</div><div class="headline" style="font-size:${p?84:80}px;margin-top:28px">Community videos.</div><div class="headline" style="font-size:${p?84:80}px;color:#a790ff;margin-top:12px">Creative starting points.</div></div>`;
  a=`gsap.set('#${id}-world',{x:${ix},y:${iy},scale:${initialScale}});gsap.set(['#${id}-stage','#${id}-card','#${id}-brand','#${id}-reveal'],{opacity:0});tl.fromTo('#${id}-hook-a',{y:22,opacity:0},{y:0,opacity:1,duration:.28,ease:'power3.out'},.04);tl.fromTo('#${id}-hook-b',{y:28,opacity:0},{y:0,opacity:1,duration:.32,ease:'power3.out'},.48);tl.fromTo('#${id}-hook-c',{y:30,opacity:0},{y:0,opacity:1,duration:.34,ease:'power3.out'},.95);tl.to('#${id}-world',{x:${px},y:${py},scale:${pushScale},duration:${short?1.32:2.22},ease:'none'},0);tl.to('#${id}-world',{x:${fx},y:${fy},scale:${finalScale},duration:.75,ease:'power3.inOut'},2.22);tl.to(['#${id}-hook','#${id}-credit'],{opacity:0,duration:.25},2.45);tl.to('#${id}-stage',{opacity:1,duration:.16},2.45);tl.to('#${id}-world',{opacity:0,duration:.16},2.45);tl.fromTo('#${id}-card',{opacity:0,scale:1.06,y:26},{opacity:1,scale:1,y:0,duration:.38,ease:'power3.out'},2.52);tl.to('#${id}-brand',{opacity:1,duration:.3},2.6);tl.fromTo('#${id}-reveal',{opacity:0,y:22},{opacity:1,y:0,duration:.45,ease:'power3.out'},2.95);`;
  if(!p)a+=`tl.to('#${id}-hook',{opacity:1,duration:.16,ease:'power2.out'},.04);`;
  if(!short)a+=`gsap.set('#${id}-context',{opacity:0});tl.to('#${id}-card',{x:${p?155:-320},y:${p?55:-115},scale:${p?.5:.4},opacity:0,duration:.2,ease:'power3.inOut'},4.2);tl.fromTo('#${id}-context',{opacity:0,y:22,scale:.98},{opacity:1,y:0,scale:1,duration:.36,ease:'power3.out'},4.4);`;
 }
 if(kind==='discovery'){
  const vw=p?720:1440,vh=p?1060:900;const rate=p?1:7.2/6.5;
  m=`${brand(`${id}-brand`,p?'left:72px;top:130px':'left:80px;top:75px')}<div style="position:absolute;left:${p?72:80}px;top:${p?270:250}px;width:${p?900:570}px"><div class="eyebrow">Discover</div><div class="headline" style="font-size:${p?88:88}px;margin-top:24px">Find a style worth exploring.</div><div class="note" style="margin-top:28px">Choose a tool.<div>Then select Full prompt.</div></div></div><div class="ui-frame" style="left:${p?60:710}px;top:${p?650:160}px;width:${p?960:1130}px;height:${p?860:700}px"><div id="${id}-world" class="world" data-layout-allow-overflow style="width:${vw}px;height:${vh}px">${video(`${id}-video`,`${format}-discovery.mp4`,0,p?6.23:6.5,'',`data-playback-rate="${rate}"`)}${p?`<div id="${id}-result-hold" class="clip" ${stamp(6.23,.27)}>${img('portrait-selected-card-context.png','width:720px;height:1060px')}</div>`:''}</div></div>`;
  // Camera keeps the actual clicked target in frame; captured cursor remains untouched.
  if(p)a=`gsap.set('#${id}-world',{scale:2.2,x:-180,y:-225});tl.to('#${id}-world',{scale:2.2,x:-610,y:-225,duration:.6,ease:'power3.inOut'},2.58);tl.to('#${id}-world',{scale:1.34,x:-3,y:-70,duration:.6,ease:'power3.inOut'},5.1);`;
  else a=`gsap.set('#${id}-world',{scale:2.65,x:-950,y:-170});tl.to('#${id}-world',{x:-2600,duration:.85,ease:'power3.inOut'},2.6);tl.to('#${id}-world',{scale:.79,x:0,y:0,duration:.65,ease:'power3.inOut'},5.3);`;
 }
 if(kind==='detail'){
  m=`${brand(`${id}-brand`,p?'left:72px;top:130px':'left:80px;top:75px')}<div style="position:absolute;left:${p?72:80}px;top:${p?270:270}px;width:${p?900:550}px"><div class="eyebrow">Meet the maker</div><div class="headline" style="font-size:${p?82:86}px;margin-top:24px">Watch the result.<div style="color:#a790ff">Discover its creator.</div></div></div><div class="ui-frame" style="left:${p?60:710}px;top:${p?640:165}px;width:${p?960:1130}px;height:${p?870:700}px"><div id="${id}-world" class="world" data-layout-allow-overflow style="width:${p?720:1440}px;height:${p?1060:900}px">${video(`${id}-video`,`${format}-detail.mp4`,0,3.7)}</div></div>`;
  a=p?`gsap.set('#${id}-world',{scale:1.34,x:0,y:-70});tl.to('#${id}-world',{scale:1.42,x:-30,y:-72,duration:.65,ease:'power3.inOut'},1.6);`:`gsap.set('#${id}-world',{scale:.79,x:0,y:0});tl.to('#${id}-world',{scale:1.12,x:-240,y:-80,duration:.7,ease:'power3.inOut'},1.75);`;
 }
 if(kind==='prompt'){
  const copyDur=p?2.6:83/30;const vw=p?720:1440,vh=p?1060:900;
  m=`${brand(`${id}-brand`,p?'left:72px;top:130px':'left:80px;top:75px')}<div style="position:absolute;left:${p?72:80}px;top:${p?270:240}px;width:${p?900:600}px"><div class="eyebrow">The starting point</div><div class="headline" style="font-size:${p?80:82}px;margin-top:22px">A shared prompt.<div style="color:#a790ff">Your next starting point.</div></div><div class="eyebrow" style="font-size:28px;margin-top:32px">Prompt excerpt</div><div class="note" style="font-size:${p?42:34}px;margin-top:14px">“Create a cinematic AI future video with neon cities…”</div></div><div class="ui-frame" style="left:${p?60:750}px;top:${p?900:230}px;width:${p?960:1090}px;height:${p?590:590}px"><div id="${id}-world" class="world" data-layout-allow-overflow style="width:${vw}px;height:${vh}px">${video(`${id}-video`,`${format}-copy.mp4`,0,copyDur)}<div id="${id}-copied-hold" class="clip" ${stamp(copyDur,length-copyDur)}>${img(`${format}-prompt-copied.png`, `width:${vw}px;height:${vh}px`)}</div></div></div>`;
  if(p)a=`gsap.set('#${id}-world',{scale:1.42,x:-30,y:-525});tl.to('#${id}-world',{scale:2.08,x:-450,y:-805,duration:.75,ease:'power3.inOut'},1.0);`;
  else a=`gsap.set('#${id}-world',{scale:1.1,x:-250,y:-300});tl.to('#${id}-world',{scale:1.85,x:-1100,y:-605,duration:.75,ease:'power3.inOut'},1.05);`;
 }
 if(kind==='explore'){
  m=`${brand(`${id}-brand`,p?'left:72px;top:130px':'left:80px;top:75px')}<div class="headline" style="position:absolute;left:${p?72:80}px;top:${p?280:200}px;width:${p?900:1300}px;font-size:${p?88:82}px">Explore what others<div style="color:#a790ff">are making.</div></div>`;
  const categories=['motion','product-demo','explainer'];const names=['Motion graphics','Product demos','Explainers'];
  categories.forEach((category,i)=>{
   const item=`${id}-card-${i}`;const evidence=take.formats[format].snapshots[`montage-${category}`];
   const x=p?105:80+i*590,y=p?640:400,width=p?820:450;
   m+=`<div id="${item}" class="clip" ${stamp(p?i*1.8:0,p?(i===2?1.9:1.8):length)} style="left:${x}px;top:${y}px;width:${width}px;height:${p?850:470}px"><div id="${item}-inner"><div class="pill" style="font-size:32px;margin-bottom:22px">${names[i]}</div>${img(`${format}-montage-${category}.png`,`width:${width}px;height:auto;border-radius:18px`)}<div class="credit" style="font-size:29px;margin-top:20px">${esc(evidence.creator.replace(/^By/,'Creator · '))}</div></div></div>`;
   a+=`tl.fromTo('#${item}-inner',{y:28,opacity:1},{y:0,opacity:1,duration:.4,ease:'power3.out'},${p?i*1.8:i*.12});`;
  });
 }
 if(kind==='cta'){
  m=`<div style="position:absolute;inset:0;background:#171916"></div>${brand(`${id}-brand`,p?'left:76px;top:220px;color:#fbfaf7':'left:110px;top:145px;color:#fbfaf7')}<div id="${id}-message" style="position:absolute;left:${p?76:110}px;top:${p?530:320}px;width:${p?900:1640}px;color:#fbfaf7"><div id="${id}-head" class="headline" style="font-size:${p?116:118}px">Find your next<div style="color:#d8ff63">video idea.</div></div><div id="${id}-url" style="font-weight:700;letter-spacing:-1.6px;font-size:${p?57:72}px;margin-top:${p?80:52}px">madewithhyperframes.com</div><div id="${id}-action" class="pill" style="margin-top:${p?65:42}px;font-size:${p?38:34}px">Explore the directory <span style="margin-left:28px">↗</span></div></div><div style="position:absolute;left:${p?76:110}px;top:${p?1500:900}px;color:#b6b9b0;font-size:28px;line-height:1.4">Music: “Origami” · Scott Buckley · CC BY 4.0<div>scottbuckley.com.au · excerpted &amp; mixed</div></div>`;
  a=`tl.fromTo('#${id}-head',{opacity:0,y:34},{opacity:1,y:0,duration:.55,ease:'power3.out'},.12);tl.fromTo('#${id}-url',{opacity:0,y:22},{opacity:1,y:0,duration:.42,ease:'power2.out'},.9);tl.fromTo('#${id}-action',{opacity:0,y:18,scale:.96},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.3)'},1.2);`;
 }
 if(short&&kind==='intro')a=a.replaceAll('},2.22)', '},1.32)').replaceAll('},2.45)', '},1.5)').replaceAll('},2.52)', '},1.6)').replaceAll('},2.6)', '},1.82)').replaceAll('},2.95)', '},2.1)');
 writeScene(dir,id,w,h,length,m,css,a);
 }
 // Audio and captions are independent editable tracks on the root timeline.
 const voiceList=short?shortAudio.voices:mainAudio.voices;const starts=short?[.15]:[0,2.8,8.9,15.4,19.3,25.45,31];const limits=short?[9.7]:[2.8,6.05,6.4,3.6,5.7,5.3,4.9];let audio='',captions='';const captionItems=[];
 voiceList.forEach((v,i)=>{
  const rate=Math.max(1,v.duration_s/limits[i]);const length=short?6.8:v.duration_s/rate;const st=starts[i];
  audio+=`<audio id="voice-${i}" src="${v.path}" ${stamp(st,length,3)} data-volume="1" data-playback-rate="${rate}"/>`;
  if(short)audio+=`<audio id="voice-cta" src="${v.path}" ${stamp(10.2,v.duration_s-7.02,3)} data-media-start="7.02" data-volume="1"></audio>`;
  const words=v.words||[];let chunk=[];let n=0;
  const emit=()=>{if(!chunk.length)return;const offset=short&&chunk[0].start>=7?10.2-7.02:st;const begin=offset+chunk[0].start/rate,end=Math.min(dur,offset+chunk.at(-1).end/rate+.12);let txt=chunk.map(x=>x.text).join(' ').replace(/hyper\s*frames/gi,'Hyperframes').replace(/\s+-shared/g,'-shared');if(end>begin&&!(i===0&&!short)&&!(short&&chunk[0].start<2))captionItems.push({id:`caption-${i}-${n++}`,start:begin,end,text:txt});chunk=[];};
  for(const word of words){chunk.push(word);if((chunk.length>=5&&!(i===4&&!short)&&!(i===6&&n>0&&!short))||/[.!?]$/.test(word.text))emit();}emit();
 });
 captionItems.sort((a,b)=>a.start-b.start);captionItems.forEach((c,i)=>{const next=captionItems[i+1]?.start??dur;const end=Math.min(next,Math.max(c.end,Math.min(next,c.start+1.6)));captions+=`<div id="${c.id}" class="clip caption" ${stamp(c.start,Math.max(.01,end-c.start),2)}><span>${esc(c.text)}</span></div>`;});
 audio=`<hf-audio-group id="narration" data-label="Narration" data-volume="1"></hf-audio-group>${audio.replaceAll('<audio id="voice-','<audio data-audio-group="narration" id="voice-')}`;
 const music=fs.existsSync(path.join(project,'assets/bgm/music-main.wav'))?(short?'music-short.wav':'music-main.wav'):null;
 if(music)audio+=`<audio id="music-bed" src="assets/bgm/${music}" ${stamp(0,dur,4)} data-volume="0.16" data-automation="${attr({version:1,lanes:[{target:'volume',points:[{t:0,v:0},{t:.2,v:.16},{t:dur-1.4,v:.16},{t:dur,v:0}]}]})}"/>`;
 if(fs.existsSync(path.join(project,'assets/sfx/chime.mp3')))audio+=`<audio id="sfx-copy" src="assets/sfx/chime.mp3" ${stamp((short?5:19.1)+(p?2.5:2.64),2.5,5)} data-volume="0.7"/>`;
 if(!short)for(const [i,t]of (p?[10.71,12.78]:[11.01,13.31]).entries())audio+=`<audio id="sfx-click-${i}" src="assets/sfx/click-soft.mp3" ${stamp(t,.37,5)} data-volume="0.35"></audio>`;
 const hosts=S.map(([kind,st,length])=>`<div id="${tag}-${kind}" class="clip" data-composition-id="${tag}-${kind}" data-composition-src="compositions/${tag}-${kind}.html" ${stamp(st,length,0)} data-width="${w}" data-height="${h}"></div>`).join('\n');
 const root=`<!doctype html><html lang="en"><head><meta charset="utf-8"/><script src="assets/vendor/gsap.min.js"></script><style>${shared}html,body{width:${w}px;height:${h}px;overflow:hidden;background:#0c0d12}.caption{height:auto;bottom:auto;inset:auto;left:${p?70:260}px;right:${p?130:260}px;top:${p?1610:960}px;width:auto;font-size:${p?42:34}px;z-index:30}</style></head><body><div id="root" data-composition-id="main-${tag}" data-width="${w}" data-height="${h}" data-duration="${dur}" data-fps="30">${hosts}${captions}${audio}</div><script>{const tl=gsap.timeline({paused:true});window.__timelines['main-${tag}']=tl;}</script></body></html>`;
 fs.writeFileSync(path.join(dir,'index.html'),root.replace(/(<audio\b[^>]*?)\/>/g,'$1></audio>'));
 plan.variants.push({id:tag,project:path.relative(repo,dir),width:w,height:h,duration:dur,scenes:S.map(([id,start,duration])=>({id:`${tag}-${id}`,start,duration})),audio:hasLocal?'kokoro':'heygen-internal-preview-only'});
}
build('portrait');build('landscape');build('portrait',true);
fs.writeFileSync(path.join(project,'EDIT_PLAN.json'),JSON.stringify(plan,null,2)+'\n');
console.log(`Three editable compositions built. ${plan.audioStatus}. Browser QA required.`);
