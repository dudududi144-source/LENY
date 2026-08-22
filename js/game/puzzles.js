/* game/puzzles.js — מערכת חידות חינוכיות
   עולם 1: חיות (צלילים) · 2: צורות · 3: אותיות · 4: מקצבים · 5: רגשות · בוס: מעורב */
import {$,el,shuffle,rnd,later} from '../core/utils.js';
import {S,DIFF} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS,praise} from '../core/tts.js';
import {RT} from './runtime.js';
import {recordResult} from './skill-model.js';

const ANI=[['🐶','dog','כֶּלֶב'],['🐱','cat','חָתוּל'],['🐮','cow','פָּרָה'],['🐷','pig','חֲזִיר'],['🐰','rabbit','אַרְנָב']];
const WORDS=[{w:'כֶּלֶב',e:'🐶',a:'כ'},{w:'חָתוּל',e:'🐱',a:'ח'},{w:'סוּס',e:'🐴',a:'ס'},{w:'פֶּרַח',e:'🌸',a:'פ'},{w:'בַּיִת',e:'🏠',a:'ב'},{w:'דָּג',e:'🐟',a:'ד'}];
const HEB=['א','ב','ג','ד','ה','ו','כ','פ','ח','ס'];
const EMO=[{sit:'🎁',ans:'😄',say:'שָׂמֵחַ'},{sit:'🌧️',ans:'😢',say:'עָצוּב'},{sit:'👻',ans:'😨',say:'מְפַחֵד'},{sit:'🤗',ans:'😄',say:'שָׂמֵחַ'}];
const SHP=[['circle','עִגּוּל'],['square','רִבּוּעַ'],['triangle','מְשֻׁלָּשׁ']];
const INSTS=[['🥁','drum'],['🎺','trumpet'],['✨','chime']];
function shapeSVG(s,cls){if(s==='circle')return `<svg viewBox="0 0 88 88"><circle class="${cls}" cx="44" cy="44" r="34"/></svg>`;
 if(s==='square')return `<svg viewBox="0 0 88 88"><rect class="${cls}" x="14" y="14" width="60" height="60" rx="10"/></svg>`;
 return `<svg viewBox="0 0 88 88"><polygon class="${cls}" points="44,12 78,76 10,76"/></svg>`}
const numOpts=()=>DIFF[S.diff].opts;

export const PZ={open:false,cb:null,domain:null};
let wrongCount=0;

export function openPuzzle(title,sub,build,cb){
 PZ.open=true;PZ.cb=cb;RT.paused=true;RT.puzzleBusy=true;wrongCount=0;
 $('#pzTitle').textContent=title;$('#pzSub').textContent=sub;$('#pzHint').textContent='';
 const box=$('#pzBox');box.innerHTML='';build(box);
 $('#puzzle').classList.add('show')}

export function closePuzzle(ok){$('#puzzle').classList.remove('show');PZ.open=false;RT.paused=false;
 const cb=PZ.cb;PZ.cb=null;
 const dom=PZ.domain;PZ.domain=null;
 if(dom)recordResult(dom,ok);
 later(()=>{RT.puzzleBusy=false},250);
 if(ok){RT.skill=Math.min(1.15,RT.skill+.03);praise()}else{RT.skill=Math.max(.7,RT.skill-.05)}
 if(cb)later(()=>cb(ok),150)}

/* פיגום (סקפולדינג): אחרי סף הטעויות — האפשרות השגויה שנלחצה נפסלת,
   והרמז הטקסטואלי מכוון בלי לחשוף את התשובה. לעולם לא מסמנים את הנכונה. */
function wrongFx(b,hintLine){AU.sfx('wrong');
 if(b.classList){b.classList.add('shake');later(()=>b.classList.remove('shake'),420);}
 wrongCount++;
 if(wrongCount>=DIFF[S.diff].hint){
  if(b.classList&&b.classList.contains('pz-opt')&&!b.classList.contains('off')){b.classList.add('off');b.disabled=true;}
  if(hintLine)$('#pzHint').textContent='💡 '+hintLine;}}

function pzAnimals(box){
 const opts=shuffle(ANI).slice(0,Math.max(2,numOpts()));
 const target=opts[rnd(opts.length)];
 const play=el('button','pz-big','🔊');play.onclick=()=>AU.animal(target[1]);box.appendChild(play);
 later(()=>AU.animal(target[1]),450);
 TTS.say('אֵיזוֹ חַיָּה מַשְׁמִיעָה אֶת הַקּוֹל?');
 const row=el('div','pz-row');box.appendChild(row);
 $('#pzHint').textContent='הקשיבי לקול ובחרי את החיה';
 opts.forEach(o=>{const b=el('button','pz-opt',o[0]+'<div style="font-size:13px;font-weight:800">'+o[2]+'</div>');
  b.onclick=()=>{if(o[1]===target[1]){AU.sfx('select');closePuzzle(true)}
   else wrongFx(b,'הקשיבי שוב 🔊')};
  row.appendChild(b)})}

function pzShapes(box){let round=0;const R=2;
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';$('#pzHint').textContent='מצאי את הצורה הזהה ('+(round+1)+'/'+R+')';
  const target=SHP[rnd(3)][0];
  const big=el('div','pz-shape',shapeSVG(target,'sh-'+target[0]));big.querySelector('svg').style.width='80px';big.querySelector('svg').style.height='80px';box.appendChild(big);
  const row=el('div','pz-row pz-shape');box.appendChild(row);
  shuffle(SHP).forEach(s=>{const b=el('button','pz-opt pz-shape',shapeSVG(s[0],'sh-'+s[0]));
   b.onclick=()=>{if(s[0]===target){AU.sfx('select');round++;next()}else wrongFx(b,'הסתכלי על הצורה שלמעלה')};
   row.appendChild(b)})}
 next();TTS.say('מִצְאִי אֶת הַצּוּרָה הַזֶּהָה')}

function pzLetters(box){let round=0;const rounds=shuffle(WORDS).slice(0,2);
 function next(){if(round>=rounds.length){closePuzzle(true);return}
  box.innerHTML='';const r=rounds[round];
  $('#pzHint').textContent='באיזו אות מתחילה המילה? ('+(round+1)+'/2)';
  box.appendChild(el('div','pz-word',r.e+' '+r.w));
  const row=el('div','pz-row');box.appendChild(row);
  const pool=shuffle(HEB.filter(l=>l!==r.a)).slice(0,Math.max(1,numOpts()-1));
  shuffle([r.a,...pool]).forEach(l=>{const b=el('button','pz-opt letters',l);
   b.onclick=()=>{if(l===r.a){AU.sfx('select');round++;next()}else wrongFx(b,'הקשיבי שוב לצליל הראשון')};
   row.appendChild(b)});
  TTS.say('בְּאֵיזוֹ אוֹת מַתְחִילָה הַמִּלָּה '+r.w)}
 next()}

function pzMusic(box){
 const seqLen=S.diff==='קל'?2:S.diff==='מאתגר'?4:3;
 const seq=Array.from({length:seqLen},()=>INSTS[rnd(3)]);
 const row=el('div','pz-row');box.appendChild(row);let phase='show',idx=0;
 $('#pzHint').textContent='הקשיבי למקצב...';
 const pads=INSTS.map(k=>{const p=el('button','pz-pad',k[0]);p.dataset.k=k[1];row.appendChild(p);return p});
 function showSeq(){phase='show';idx=0;$('#pzHint').textContent='הקשיבי למקצב...';
  seq.forEach((k,i)=>later(()=>{AU.inst(k[1]);const p=pads.find(x=>x.dataset.k===k[1]);p.classList.add('flash');later(()=>p.classList.remove('flash'),420)},600*i+400));
  later(()=>{phase='you';$('#pzHint').textContent='עכשיו תורך! נגני את המקצב ✨'},600*seqLen+500)}
 pads.forEach(p=>{p.onclick=()=>{if(phase!=='you')return;AU.inst(p.dataset.k);p.classList.add('flash');later(()=>p.classList.remove('flash'),300);
  if(p.dataset.k===seq[idx][1]){idx++;if(idx===seq.length){closePuzzle(true)}}
  else{wrongFx(p,'הקשיבי שוב למקצב 🎵');showSeq()}}});
 showSeq();TTS.say('חִזְרִי עַל הַמַּקָּצֵב')}

function pzEmo(box){let round=0;const rounds=shuffle(EMO).slice(0,2);
 function next(){if(round>=rounds.length){closePuzzle(true);return}
  box.innerHTML='';const r=rounds[round];
  $('#pzHint').textContent='מה היא מרגישה? ('+(round+1)+'/2)';
  box.appendChild(el('div','pz-word',r.sit));
  const row=el('div','pz-row');box.appendChild(row);
  shuffle(['😄','😢','😨']).forEach(f=>{const b=el('button','pz-opt',f);
   b.onclick=()=>{if(f===r.ans){AU.sfx('select');round++;next()}else wrongFx(b,'מה קורה בתמונה?')};
   row.appendChild(b)});
  TTS.say('מָה הִיא מַרְגִּישָׁה?')}
 next()}

function pzMath(box){let round=0;const R=2;
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';let ans=0,prompt='';
  if(round===0){const N=2+rnd(4);ans=N;prompt='🍎'.repeat(N);
   $('#pzHint').textContent='כמה תפוחים יש? ('+(round+1)+'/'+R+')';}
  else{const a=1+rnd(4),b=1+rnd(4);ans=a+b;prompt=a+' + '+b+' = ?';
   $('#pzHint').textContent='כמה זה ביחד? ('+(round+1)+'/'+R+')';}
  box.appendChild(el('div','pz-word',prompt));
  const row=el('div','pz-row');box.appendChild(row);
  const pool=shuffle([ans-1,ans+1,ans+2].filter(x=>x>0&&x!==ans)).slice(0,Math.max(1,numOpts()-1));
  shuffle([ans,...pool]).forEach(n=>{const b2=el('button','pz-opt letters',String(n));
   b2.onclick=()=>{if(n===ans){AU.sfx('select');round++;next()}
    else wrongFx(b2,'ספרי שוב 🧮')};
   row.appendChild(b2)});}
 next();TTS.say(round===0?'כַּמָּה תַּפּוּחִים יֵשׁ?':'כַּמָּה זֶה בְּיַחַד?')}

function pzColor(box){let round=0;const R=2;
 const PAL=['#ff2e88','#7dffb8','#4dc9ff','#ffd23e','#b967ff','#ff7a3c'];
 function colorBtn(col,ansCol){const b=el('button','pz-opt');
  b.innerHTML='<span style="display:block;width:52px;height:52px;border-radius:50%;background:'+col+'"></span>';
  b.onclick=()=>{if(col===ansCol){AU.sfx('select');round++;next()}
   else wrongFx(b,'הסתכלי טוב על הצבע 🎨')};
  return b}
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';
  const row=el('div','pz-row');
  if(round===0){
   $('#pzHint').textContent='מצאי את הצבע הזהה! ('+(round+1)+'/'+R+')';
   const target=PAL[rnd(PAL.length)];
   const big=el('div','pz-word');
   big.innerHTML='<span style="display:inline-block;width:80px;height:80px;border-radius:50%;background:'+target+';box-shadow:0 0 24px '+target+'"></span>';
   box.appendChild(big);
   const opts=shuffle([target,...shuffle(PAL.filter(c=>c!==target)).slice(0,Math.max(2,numOpts()-1))]);
   opts.forEach(c=>row.appendChild(colorBtn(c,target)));
  }else{
   const pairs=[['🍌','#ffd23e'],['🐸','#7dff5e'],['🍓','#ff2e88'],['🌊','#4dc9ff']];
   const p=pairs[rnd(pairs.length)];
   $('#pzHint').textContent='באיזה צבע זה? ('+(round+1)+'/'+R+')';
   box.appendChild(el('div','pz-word',p[0]));
   const opts=shuffle([p[1],...shuffle(PAL.filter(c=>c!==p[1])).slice(0,Math.max(2,numOpts()-1))]);
   opts.forEach(c=>row.appendChild(colorBtn(c,p[1])));
  }
  box.appendChild(row);}
 next();TTS.say(round===0?'מִצְאִי אֶת הַצֶּבַע הַזֶּהֶה':'בְּאֵיזֶה צֶבַע?')}

function pzSize(box){let round=0;const R=2;
 const TRIPLES=[['🐭','🐰','🐘'],['🐜','🐱','🦁'],['🐟','🐬','🐋']];
 const PATTERNS=[['🔴','🔵','🟢'],['🟡','🟣','🔵']];
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';
  const row=el('div','pz-row');
  if(round===0){
   $('#pzHint').textContent='מי הכי גדול? ('+(round+1)+'/2)';
   box.appendChild(el('div','pz-word','מי הכי גדול?'));
   const t=TRIPLES[rnd(TRIPLES.length)];const ans=t[2];
   shuffle(t).forEach(e2=>{const b=el('button','pz-opt',e2);
    b.onclick=()=>{if(e2===ans){AU.sfx('select');round++;next()}
     else wrongFx(b,'הסתכלי מי הכי גדול 🐘')};
    row.appendChild(b)});}
  else{
   $('#pzHint').textContent='מה ממשיך את הסדרה? ('+(round+1)+'/2)';
   const p=PATTERNS[rnd(PATTERNS.length)];const a=p[0],b2=p[1];
   box.appendChild(el('div','pz-word',a+' '+b2+' '+a+' '+b2+' ❓'));
   shuffle([a,b2,p[2]]).forEach(e2=>{const b=el('button','pz-opt',e2);
    b.onclick=()=>{if(e2===a){AU.sfx('select');round++;next()}
     else wrongFx(b,'הסדרה מתחלפת לסירוגין')};
    row.appendChild(b)});}
  box.appendChild(row);}
 next();TTS.say(round===0?'מִי הַכִּי גָּדוֹל?':'מָה מַמְשִׁיךְ אֶת הַסִּדְרָה?')}

function clockSVG(h){const a=((h%12)*30-90)*Math.PI/180;
 const hx=(50+Math.cos(a)*20).toFixed(1),hy=(50+Math.sin(a)*20).toFixed(1);
 return '<svg viewBox="0 0 100 100" width="110" height="110"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#7c4dff" stroke-width="4"/>'
 +'<line x1="50" y1="8" x2="50" y2="16" stroke="#b967ff" stroke-width="3"/><line x1="92" y1="50" x2="84" y2="50" stroke="#b967ff" stroke-width="3"/>'
 +'<line x1="50" y1="92" x2="50" y2="84" stroke="#b967ff" stroke-width="3"/><line x1="8" y1="50" x2="16" y2="50" stroke="#b967ff" stroke-width="3"/>'
 +'<line x1="50" y1="50" x2="'+hx+'" y2="'+hy+'" stroke="#7c4dff" stroke-width="6" stroke-linecap="round"/>'
 +'<line x1="50" y1="50" x2="50" y2="20" stroke="#F2549A" stroke-width="3" stroke-linecap="round"/>'
 +'<circle cx="50" cy="50" r="4" fill="#7c4dff"/></svg>'}
function pzTime(box){let round=0;const R=2;
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';
  const target=round===0?[12,3,6,9][rnd(4)]:[1,2,4,5,7,8,10,11][rnd(8)];
  $('#pzHint').textContent='כמה השעה בשעון? ('+(round+1)+'/2)';
  box.appendChild(el('div','pz-word',clockSVG(target)));
  const row=el('div','pz-row');
  const pool=shuffle([1,2,3,4,5,6,7,8,9,10,11,12].filter(x=>x!==target)).slice(0,Math.max(2,numOpts()-1));
  shuffle([target,...pool]).forEach(n=>{const b=el('button','pz-opt letters',String(n));
   b.onclick=()=>{if(n===target){AU.sfx('select');round++;next()}
    else wrongFx(b,'הסתכלי על המחוג הקצר')};
   row.appendChild(b)});
  box.appendChild(row);}
 next();TTS.say('כַּמָּה הַשָּׁעָה?')}

/* חידת ערבוב (עולם הסיום + שדרוג הבוס): בוחרת אקראית מבין כל סוגי החידות */
export function pzMix(box){const pool=[pzAnimals,pzShapes,pzLetters,pzMusic,pzEmo,pzMath,pzColor,pzSize,pzTime];
 pool[rnd(pool.length)](box)}

export function pzGate(box){const builders=[pzAnimals,pzShapes,pzLetters,pzMusic,pzEmo,pzMath,pzColor,pzSize,pzTime,pzMix];builders[RT.level](box)}
export function pzBoss(box){const pool=[pzAnimals,pzShapes,pzLetters,pzMusic,pzEmo,pzMath,pzColor,pzSize,pzTime];pool[rnd(pool.length)](box)}
