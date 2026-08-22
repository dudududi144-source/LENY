/* ui/parent.js — פינת ההורים: הגנה, הגדרות, דשבורד (#18), נגישות (#22) */
import {$,el} from '../core/utils.js';
import {toast} from './fx.js';
import {S,save,saveSoon,resetState} from '../core/state.js';
import {summaryStats} from '../core/stats.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {goTitle} from './scenes.js';

function attachHold(elm,dur,onDone,onTick){
 const fill=elm.querySelector('.hold-fill');let act=false,done=false,raf=0,t0=0,x0=0,y0=0;
 const setP=p=>{if(fill)fill.style.width=(Math.min(1,Math.max(0,p))*100)+'%'};
 const reset=()=>{act=false;done=false;cancelAnimationFrame(raf);setP(0)};
 const loop=t=>{if(!act)return;const p=(t-t0)/dur;setP(p);
  if(p>=1){done=true;setP(1);if(onDone)onDone();setTimeout(reset,420);return}
  raf=requestAnimationFrame(loop)};
 elm.addEventListener('pointerdown',e=>{if(act)return;act=true;done=false;x0=e.clientX;y0=e.clientY;t0=performance.now();
  try{elm.setPointerCapture(e.pointerId)}catch(_){/*noop*/}
  raf=requestAnimationFrame(loop);e.preventDefault()});
 elm.addEventListener('pointermove',e=>{if(!act||done)return;
  if(Math.hypot(e.clientX-x0,e.clientY-y0)>12){reset();if(onTick)onTick()}});
 ['pointerup','pointercancel'].forEach(ev=>elm.addEventListener(ev,()=>{if(!act||done)return;
  const held=performance.now()-t0;reset();if(onTick&&held>180)onTick()}));
 elm.addEventListener('contextmenu',e=>e.preventDefault());}

export function setNight(v){S.night=v;document.body.classList.toggle('night',v);
 const t=$('#tNight');if(t)t.checked=v;saveSoon();
 if(AU.ctx){AU.stopMusic();if(S.sound)AU.startMusic();}}

function renderParent(){
 $('#parName').value=S.name;
 const tS=$('#tSound');if(tS)tS.checked=S.sound;
 const tN=$('#tNight');if(tN)tN.checked=S.night;
 const mseg=$('#modeSeg');if(mseg){mseg.innerHTML='';
  ['חוקר','הרפתקן'].forEach(md=>{const b=el('button',S.mode===md?'on':'',md+(md==='חוקר'?' · גיל 3-5':' · גיל 6-8'));
   b.onclick=()=>{S.mode=md;save();renderParent();AU.sfx('tap');toast('המצב ישתנה מהשלב הבא 🌟')};
   mseg.appendChild(b)});}
 const lseg=$('#limitSeg');if(lseg){lseg.innerHTML='';
  [[0,'כבוי'],[10,'10 דק'],[15,'15 דק'],[20,'20 דק']].forEach(([v,l])=>{
   const b=el('button',S.timeLimit===v?'on':'',l);
   b.onclick=()=>{S.timeLimit=v;save();renderParent();AU.sfx('tap');toast(v?('מגבלת זמן: '+v+' דקות'):'מגבלת הזמן כבויה')};
   lseg.appendChild(b)});}
 const seg=$('#diffSeg');if(seg){seg.innerHTML='';
  ['קל','רגיל','מאתגר'].forEach(d=>{const b=el('button',S.diff===d?'on':'',d);
   b.onclick=()=>{S.diff=d;save();renderParent();AU.sfx('tap')};seg.appendChild(b)});}
 /* דשבורד הורים (#18) — שליטה בתחומים + זמן + המלצה */
 const sum=summaryStats();
 let dash=$('#parDash');
 if(!dash){dash=el('div');dash.id='parDash';dash.className='dash';
  const card=$('#parent .overlay__card')||$('#parent');if(card)card.appendChild(dash);}
 dash.innerHTML='';
 const mins=Math.round(sum.playSec/60);
 dash.appendChild(el('div','dash-line','זמן משחק: '+mins+' דק · מפגשים: '+sum.sessions));
 const DN={animals:'חיות',shapes:'צורות',letters:'אותיות',music:'מוזיקה',emotions:'רגשות',math:'חשבון',colors:'צבעים',sizes:'גדלים',time:'שעות'};
 for(const k in DN){const mm=sum.domains[k];const row=el('div','dash-row');
  row.innerHTML='<span class="dl">'+DN[k]+'</span><div class="bar"><i style="width:'+(mm?mm.pct:0)+'%"></i></div><span class="dp">'+(mm?mm.pct+'%':'—')+'</span>';
  dash.appendChild(row);}
 let weak=null,wp=101;for(const k in sum.domains){if(sum.domains[k].pct<wp){wp=sum.domains[k].pct;weak=k;}}
 if(weak&&wp<70)dash.appendChild(el('div','dash-rec','המלצה: כדאי לתרגל '+DN[weak]+' ('+wp+'%)'));
 /* נגישות מוטורית (#22) */
 let acc=$('#parAcc');
 if(!acc){acc=el('div');acc.id='parAcc';acc.className='seg';
  const f=el('div','field');f.appendChild(el('span','','נגישות'));f.appendChild(acc);dash.appendChild(f);}
 acc.innerHTML='';
 [[0.7,'איטי'],[1,'רגיל']].forEach(([v,l])=>{const b=el('button',(S.access&&S.access.speed===v)?'on':'',l);
  b.onclick=()=>{S.access.speed=v;save();renderParent();AU.sfx('tap')};acc.appendChild(b)});
 const nf=el('button',(S.access&&S.access.noFail)?'on':'','ללא כישלון');
 nf.onclick=()=>{S.access.noFail=!(S.access.noFail);save();renderParent();AU.sfx('tap')};acc.appendChild(nf);
 const stars=Object.values(S.stars).reduce((a,b)=>a+b,0);
 const ps=$('#parStats');if(ps)ps.textContent='התקדמות: '+S.items.length+'/10 עולמות · '+stars+'✦ שערי חוכמה · שיא '+S.best;}

export function initParent(){
 attachHold($('#hubGear'),1200,()=>{renderParent();$('#parent').classList.add('show');AU.sfx('open')},
  ()=>toast('כְּדֵי לִפְתֹּחַ — לַחֲצִי וְהַחֲזִיקִי 🔒'));
 const hn=$('#hubNight');if(hn)hn.onclick=()=>{AU.ensure();setNight(!S.night);AU.sfx('tap')};
 const pc=$('#parClose');if(pc)pc.onclick=()=>{$('#parent').classList.remove('show');AU.sfx('close')};
 const pn=$('#parName');if(pn)pn.addEventListener('input',e=>{S.name=e.target.value.slice(0,16);saveSoon()});
 const tS=$('#tSound');if(tS)tS.addEventListener('change',e=>{S.sound=e.target.checked;save();AU.ensure();AU.refresh();if(S.sound)AU.sfx('tap')});
 const tN=$('#tNight');if(tN)tN.addEventListener('change',e=>setNight(e.target.checked));
 const st=$('#soundTest');if(st)st.onclick=()=>{AU.ensure();AU.refresh();AU.sfx('success');AU.animal('dog');
  setTimeout(()=>AU.animal('cat'),350);TTS.say('בְּדִיקַת צְלִילִים. כָּל הַכָּבוֹד!')};
 const rh=$('#resetHold');if(rh)attachHold(rh,1600,()=>{resetState();$('#parent').classList.remove('show');toast('ההתקדמות אופסה');goTitle()},
  ()=>toast('הָאִפּוּס בֻּטַּל'));}
