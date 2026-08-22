/* ui/parent.js — פינת הורים (מוגנת בהחזקה), מצב לילה, איפוס */
import {$,el} from '../core/utils.js';
import {toast} from './fx.js';
import {S,save,saveSoon,resetState} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {goTitle} from './scenes.js';

function attachHold(elm,dur,onDone,onTick){
 const fill=elm.querySelector('.holdfill');let act=false,done=false,raf=0,t0=0;
 elm.addEventListener('pointerdown',e=>{act=true;done=false;t0=performance.now();
  try{elm.setPointerCapture(e.pointerId)}catch(_){}
  const loop=t=>{if(!act)return;const p=(t-t0)/dur;
   if(fill)fill.style.width=Math.min(1,p)*100+'%';
   if(p>=1){done=true;setTimeout(()=>{if(fill)fill.style.width='0'},400);onDone();return}
   raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);e.preventDefault()});
 ['pointerup','pointercancel'].forEach(ev=>elm.addEventListener(ev,()=>{
  if(act&&!done&&onTick)onTick();
  act=false;cancelAnimationFrame(raf);if(fill)fill.style.width='0'}));
 elm.addEventListener('contextmenu',e=>e.preventDefault())}

export function setNight(v){S.night=v;document.body.classList.toggle('night',v);
 $('#tNight').checked=v;saveSoon();
 if(AU.ctx){AU.stopMusic();if(S.sound)AU.startMusic()}}

function renderParent(){
 $('#parName').value=S.name;$('#tSound').checked=S.sound;$('#tNight').checked=S.night;
 const mseg=$('#modeSeg');if(mseg){mseg.innerHTML='';
  ['חוקר','הרפתקן'].forEach(md=>{const b=el('button',S.mode===md?'on':'',md+(md==='חוקר'?' · גיל 3-5':' · גיל 6-8'));
   b.onclick=()=>{S.mode=md;save();renderParent();AU.sfx('tap');toast('המצב ישתנה מהשלב הבא 🌟')};
   mseg.appendChild(b)});}
 const lseg=$('#limitSeg');if(lseg){lseg.innerHTML='';
  [[0,'כבוי'],[10,'10 דק'],[15,'15 דק'],[20,'20 דק']].forEach(([v,l])=>{
   const b=el('button',S.timeLimit===v?'on':'',l);
   b.onclick=()=>{S.timeLimit=v;save();renderParent();AU.sfx('tap');toast(v?('מגבלת זמן: '+v+' דקות'):'מגבלת הזמן כבויה')};
   lseg.appendChild(b)});}
 const seg=$('#diffSeg');seg.innerHTML='';
 ['קל','רגיל','מאתגר'].forEach(d=>{const b=el('button',S.diff===d?'on':'',d);
  b.onclick=()=>{S.diff=d;save();renderParent();AU.sfx('tap')};seg.appendChild(b)});
 const stars=Object.values(S.stars).reduce((a,b)=>a+b,0);
 $('#parStats').textContent='התקדמות: '+S.items.length+'/5 עולמות · '+stars+'✦ שערי חוכמה · שיא '+S.best}

export function initParent(){
 attachHold($('#hubGear'),1200,()=>{renderParent();$('#parent').classList.add('show');AU.sfx('open')},
  ()=>toast('כְּדֵי לִפְתֹּחַ — לַחֲצִי וְהַחֲזִיקִי 🔒'));
 $('#hubNight').onclick=()=>{AU.ensure();setNight(!S.night);AU.sfx('tap')};
 $('#parClose').onclick=()=>{$('#parent').classList.remove('show');AU.sfx('tap')};
 $('#parent').addEventListener('click',e=>{if(e.target.id==='parent')$('#parent').classList.remove('show')});
 $('#parName').addEventListener('input',e=>{S.name=e.target.value.slice(0,16);saveSoon()});
 $('#tSound').addEventListener('change',e=>{S.sound=e.target.checked;save();AU.ensure();AU.refresh();
  if(!S.sound)AU.stopMusic();else AU.startMusic();if(S.sound)AU.sfx('tap')});
 $('#tNight').addEventListener('change',e=>setNight(e.target.checked));
 $('#btnSoundTest').onclick=()=>{AU.ensure();AU.sfx('success');AU.animal('dog');
  setTimeout(()=>AU.animal('cat'),400);setTimeout(()=>AU.inst('trumpet'),800);
  TTS.say('בְּדִיקַת צְלִילִים. כָּל הַכָּבוֹד!');toast('הצלילים נבדקים 🔊')};
 attachHold($('#btnReset'),1600,()=>{
  resetState();$('#parent').classList.remove('show');
  document.body.classList.remove('night');toast('ההתקדמות אופסה');AU.sfx('wrong');goTitle()},
  ()=>toast('הָאִיפּוּס בֻּטַּל'))}
