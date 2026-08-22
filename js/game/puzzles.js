/* game/puzzles.js — מערכת חידות חינוכיות
   עולם 1: חיות (צלילים) · 2: צורות · 3: אותיות · 4: מקצבים · 5: רגשות · בוס: מעורב */
import {$,el,shuffle,rnd,later} from '../core/utils.js';
import {animalIcon} from '../ui/icons.js';
import {S,DIFF,save} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {praiseFor,reframe} from './mind.js';
import {RT} from './runtime.js';
import {emit} from '../core/bus.js';
import {getLevel,recordResult} from './skill-model.js';
import {recordAttempt} from '../core/stats.js';
import {WORDS,COLOR_OBJECTS,SIZE_TRIPLES,PATTERN_BANK} from './content-bank.js';

const ANI=[['🐶','dog','כֶּלֶב'],['🐱','cat','חָתוּל'],['🐮','cow','פָּרָה'],['🐷','pig','חֲזִיר'],['🐰','rabbit','אַרְנָב']];
const HEB=['א','ב','ג','ד','ה','ו','כ','פ','ח','ס'];
const EMO=[{sit:'🎁',ans:'😄',say:'שָׂמֵחַ'},{sit:'🌧️',ans:'😢',say:'עָצוּב'},{sit:'👻',ans:'😨',say:'מְפַחֵד'},{sit:'🤗',ans:'😄',say:'שָׂמֵחַ'}];
const SHP=[['circle','עִגּוּל'],['square','רִבּוּעַ'],['triangle','מְשֻׁלָּשׁ']];
const INSTS=[['🥁','drum'],['🎺','trumpet'],['✨','chime']];
function shapeSVG(s,cls){if(s==='circle')return `<svg viewBox="0 0 88 88"><circle class="${cls}" cx="44" cy="44" r="34"/></svg>`;
 if(s==='square')return `<svg viewBox="0 0 88 88"><rect class="${cls}" x="14" y="14" width="60" height="60" rx="10"/></svg>`;
 return `<svg viewBox="0 0 88 88"><polygon class="${cls}" points="44,12 78,76 10,76"/></svg>`}
/* אדפטיביות (M1 #9): הקושי נגזר מרמת התחום של החידה הנוכחית, לא רק מהגדרת ההורה */
function adaptLevel(){return PZ.domain?getLevel(PZ.domain):3}
export function optsCount(){const base=DIFF[S.diff].opts;const l=adaptLevel();
 return Math.max(2,Math.min(4,base+(l>=4?1:l<=1?-1:0)))}
export function roundsFor(base){const l=adaptLevel();return Math.min(3,base+(l>=4?1:0))}

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
 if(dom){recordAttempt(dom,ok);const res=recordResult(dom,ok);if(res&&res.leveledUp)emit('levelup',dom);}
 later(()=>{RT.puzzleBusy=false},250);
 if(ok){RT.skill=Math.min(1.15,RT.skill+.03);AU.sfx('success');TTS.say(praiseFor(wrongCount===0))}
 else{RT.skill=Math.max(.7,RT.skill-.05)}
 if(cb)later(()=>cb(ok),150)}

/* פיגום (סקפולדינג): אחרי סף הטעויות — האפשרות השגויה שנלחצה נפסלת,
   והרמז הטקסטואלי מכוון בלי לחשוף את התשובה. לעולם לא מסמנים את הנכונה. */
function wrongFx(b,hintLine){RT.levelFails=(RT.levelFails||0)+1;AU.sfx('wrong');
 if(b.classList){b.classList.add('shake');later(()=>b.classList.remove('shake'),420);}
 wrongCount++;
 if(wrongCount===2)TTS.say(reframe());
 if(wrongCount>=DIFF[S.diff].hint){
  if(b.classList&&b.classList.contains('pz-opt')&&!b.classList.contains('off')){b.classList.add('off');b.disabled=true;}
  if(hintLine)$('#pzHint').textContent='💡 '+hintLine;}}

function pzAnimals(box){
 const opts=shuffle(ANI).slice(0,Math.max(2,optsCount()));
 const target=opts[rnd(opts.length)];
 const play=el('button','pz-big','🔊');play.onclick=()=>AU.animal(target[1]);box.appendChild(play);
 later(()=>AU.animal(target[1]),450);
 TTS.say('אֵיזוֹ חַיָּה מַשְׁמִיעָה אֶת הַקּוֹל?');
 const row=el('div','pz-row');box.appendChild(row);
 $('#pzHint').textContent='הקשיבי לקול ובחרי את החיה';
 opts.forEach(o=>{const b=el('button','pz-opt','<span class="ai">'+animalIcon(o[1])+'</span><div style="font-size:13px;font-weight:800">'+o[2]+'</div>');
  b.onclick=()=>{
   /* למידה: לחיצה משמיעה את קול החיה כדי לבנות אסוציאציה ברורה */
   AU.animal(o[1]);
   if(o[1]===target[1]){AU.sfx('select');row.querySelectorAll('button').forEach(x=>x.disabled=true);TTS.say('נָכוֹן! זֶה '+o[2]+'!');later(()=>closePuzzle(true),700);}
   else wrongFx(b,'הקשיבי שוב 🔊')};
  row.appendChild(b)})}

function pzShapes(box){let round=0;const R=roundsFor(2);
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';$('#pzHint').textContent='מצאי את הצורה הזהה ('+(round+1)+'/'+R+')';
  const target=SHP[rnd(3)][0];
  const big=el('div','pz-shape',shapeSVG(target,'sh-'+target[0]));big.querySelector('svg').style.width='80px';big.querySelector('svg').style.height='80px';box.appendChild(big);
  const row=el('div','pz-row pz-shape');box.appendChild(row);
  shuffle(SHP).forEach(s=>{const b=el('button','pz-opt pz-shape',shapeSVG(s[0],'sh-'+s[0]));
   b.onclick=()=>{if(s[0]===target){AU.sfx('select');round++;next()}else wrongFx(b,'הסתכלי על הצורה שלמעלה')};
   row.appendChild(b)})}
 next();TTS.say('מִצְאִי אֶת הַצּוּרָה הַזֶּהָה')}

function pzLetters(box){const lvL=adaptLevel();let round=0;
 const rounds=shuffle(WORDS).slice(0,roundsFor(2));
 function next(){if(round>=rounds.length){closePuzzle(true);return}
  box.innerHTML='';const r=rounds[round];
  const row=el('div','pz-row');
  if(lvL<=2){
   $('#pzHint').textContent='מצאי את אותה האות ('+(round+1)+'/'+rounds.length+')';
   box.appendChild(el('div','pz-word',r.a));
   const pool=shuffle(HEB.filter(l=>l!==r.a)).slice(0,Math.max(2,optsCount()-1));
   shuffle([r.a,...pool]).forEach(l=>{const b=el('button','pz-opt letters',l);
    b.onclick=()=>{if(l===r.a){AU.sfx('select');round++;next()}else wrongFx(b,'הסתכלי על האות שלמעלה')};
    row.appendChild(b)});}
  else{
   $('#pzHint').textContent='באיזו אות מתחילה המילה? ('+(round+1)+'/'+rounds.length+')';
   box.appendChild(el('div','pz-word',r.e+' '+r.w));
   const pool=shuffle(HEB.filter(l=>l!==r.a)).slice(0,Math.max(1,optsCount()-1));
   shuffle([r.a,...pool]).forEach(l=>{const b=el('button','pz-opt letters',l);
    b.onclick=()=>{if(l===r.a){AU.sfx('select');
    if(!S.words.some(x=>x.w===r.w)&&S.words.length<40)S.words.push({w:r.w,e:r.e});
    save();round++;next()}else wrongFx(b,'הקשיבי שוב לצליל הראשון')};
    row.appendChild(b)});}
  box.appendChild(row);}
 next();TTS.say(lvL<=2?'מִצְאִי אֶת אוֹתָה אוֹת':'בְּאֵיזוֹ אוֹת מַתְחִילָה הַמִּלָּה')}

function pzMusic(box){
 const seqLen=Math.min(5,(S.diff==='קל'?2:S.diff==='מאתגר'?4:3)+(adaptLevel()>=4?1:0));
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

function pzEmo(box){let round=0;const rounds=shuffle(EMO).slice(0,roundsFor(2));
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

function pzMath(box){const lvM=adaptLevel();let round=0;const R=2;
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';
  const row=el('div','pz-row');
  if(round===0){
   const N=2+rnd(Math.min(6,lvM+2));
   $('#pzHint').textContent='כמה יש? ('+(round+1)+'/'+R+')';
   box.appendChild(el('div','pz-word','🍎'.repeat(N)));
   const pool=shuffle([N-1,N+1,N+2].filter(x=>x>0&&x!==N)).slice(0,Math.max(2,optsCount()-1));
   shuffle([N,...pool]).forEach(n=>{const b=el('button','pz-opt letters',String(n));
    b.onclick=()=>{if(n===N){AU.sfx('select');round++;next()}else wrongFx(b,'ספרי שוב 🧮')};
    row.appendChild(b)});}
  else if(lvM<=2){
   let a=2+rnd(4),b2=2+rnd(4);if(a===b2)b2=a+1;
   const big=Math.max(a,b2);
   $('#pzHint').textContent='איפה יש יותר? ('+(round+1)+'/'+R+')';
   box.appendChild(el('div','pz-word','👀'));
   const mk=n=>{const b=el('button','pz-opt','🍎'.repeat(n));
    b.onclick=()=>{if(n===big){AU.sfx('select');round++;next()}else wrongFx(b,'ספרי ובדקי מי יותר 🧮')};
    row.appendChild(b)};
   if(Math.random()<.5){mk(a);mk(b2)}else{mk(b2);mk(a)}}
  else if(lvM<=4){
   const mx=Math.min(6,lvM+2);const a=1+rnd(mx),b2=1+rnd(mx);const ans=a+b2;
   $('#pzHint').textContent='כמה זה ביחד? ('+(round+1)+'/'+R+')';
   box.appendChild(el('div','pz-word',a+' + '+b2+' = ?'));
   const pool=shuffle([ans-1,ans+1,ans+2].filter(x=>x>0&&x!==ans)).slice(0,Math.max(2,optsCount()-1));
   shuffle([ans,...pool]).forEach(n=>{const b=el('button','pz-opt letters',String(n));
    b.onclick=()=>{if(n===ans){AU.sfx('select');round++;next()}else wrongFx(b,'ספרי שוב 🧮')};
    row.appendChild(b)});}
  else{
   const a=3+rnd(6),b2=1+rnd(a-1),ans=a-b2;
   $('#pzHint').textContent='כמה נשאר? ('+(round+1)+'/'+R+')';
   box.appendChild(el('div','pz-word',a+' − '+b2+' = ?'));
   const pool=shuffle([ans-1,ans+1,ans+2].filter(x=>x>0&&x!==ans)).slice(0,Math.max(2,optsCount()-1));
   shuffle([ans,...pool]).forEach(n=>{const b=el('button','pz-opt letters',String(n));
    b.onclick=()=>{if(n===ans){AU.sfx('select');round++;next()}else wrongFx(b,'ספרי שוב 🧮')};
    row.appendChild(b)});}
  box.appendChild(row);}
 next();TTS.say('בּוֹאִי נַחְשֵׁב')}

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
   const opts=shuffle([target,...shuffle(PAL.filter(c=>c!==target)).slice(0,Math.max(2,optsCount()-1))]);
   opts.forEach(c=>row.appendChild(colorBtn(c,target)));
  }else{
   const pairs=COLOR_OBJECTS;
   const p=pairs[rnd(pairs.length)];
   $('#pzHint').textContent='באיזה צבע זה? ('+(round+1)+'/'+R+')';
   box.appendChild(el('div','pz-word',p[0]));
   const opts=shuffle([p[1],...shuffle(PAL.filter(c=>c!==p[1])).slice(0,Math.max(2,optsCount()-1))]);
   opts.forEach(c=>row.appendChild(colorBtn(c,p[1])));
  }
  box.appendChild(row);}
 next();TTS.say(round===0?'מִצְאִי אֶת הַצֶּבַע הַזֶּהֶה':'בְּאֵיזֶה צֶבַע?')}

function pzSize(box){let round=0;const R=2;
 const TRIPLES=SIZE_TRIPLES;
 const PATTERNS=PATTERN_BANK;
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

function clockSVG(h,minutes=0){const a=((h%12)*30+minutes/2-90)*Math.PI/180;
 const ma=(minutes*6-90)*Math.PI/180;
 const hx=(50+Math.cos(a)*20).toFixed(1),hy=(50+Math.sin(a)*20).toFixed(1);
 const mx=(50+Math.cos(ma)*26).toFixed(1),my=(50+Math.sin(ma)*26).toFixed(1);
 return '<svg viewBox="0 0 100 100" width="110" height="110"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#7c4dff" stroke-width="4"/>'
 +'<line x1="50" y1="8" x2="50" y2="16" stroke="#b967ff" stroke-width="3"/><line x1="92" y1="50" x2="84" y2="50" stroke="#b967ff" stroke-width="3"/>'
 +'<line x1="50" y1="92" x2="50" y2="84" stroke="#b967ff" stroke-width="3"/><line x1="8" y1="50" x2="16" y2="50" stroke="#b967ff" stroke-width="3"/>'
 +'<line x1="50" y1="50" x2="'+hx+'" y2="'+hy+'" stroke="#7c4dff" stroke-width="6" stroke-linecap="round"/>'
 +'<line x1="50" y1="50" x2="'+mx+'" y2="'+my+'" stroke="#F2549A" stroke-width="3" stroke-linecap="round"/>'
 +'<circle cx="50" cy="50" r="4" fill="#7c4dff"/></svg>'}
function pzTime(box){let round=0;const R=2;
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';
  const lvT=adaptLevel();let target,minutes=0;
  if(round===0){target=lvT<=2?[12,3,6,9][rnd(4)]:1+rnd(12)}
  else{if(lvT>=4){target=1+rnd(12);minutes=30}else{target=[1,2,4,5,7,8,10,11][rnd(8)]}}
  $('#pzHint').textContent='כמה השעה בשעון? ('+(round+1)+'/2)';
  box.appendChild(el('div','pz-word',clockSVG(target,minutes)));
  const row=el('div','pz-row');
  const pool=shuffle([1,2,3,4,5,6,7,8,9,10,11,12].filter(x=>x!==target)).slice(0,Math.max(2,optsCount()-1));
  shuffle([target,...pool]).forEach(n=>{const b=el('button','pz-opt letters',String(n));
   b.onclick=()=>{if(n===target){AU.sfx('select');round++;next()}
    else wrongFx(b,'הסתכלי על המחוג הקצר')};
   row.appendChild(b)});
  box.appendChild(row);}
 next();TTS.say('כַּמָּה הַשָּׁעָה?')}

/* חידת ערבוב (עולם הסיום + שדרוג הבוס): בוחרת אקראית מבין כל סוגי החידות */
export function pzMix(box){const pool=[pzAnimals,pzShapes,pzLetters,pzMusic,pzEmo,pzMath,pzColor,pzSize,pzTime];
 pool[rnd(pool.length)](box)}

/* ── מיני-משחקים נוספים (העמקה וגיוון) ── */
function pzOpposite(box){let round=0;const R=3;
 const OPP=[['🔥',''],['🌞',''],['🐘',''],['⬆️','⬇️'],['🥵','🥶'],['️','☀️']];
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';$('#pzHint').textContent='בַּחֲרִי אֶת הַהֶפֶךְ ('+(round+1)+'/'+R+')';
  const pair=OPP[rnd(OPP.length)];
  box.appendChild(el('div','pz-word',pair[0]));
  const row=el('div','pz-row');box.appendChild(row);
  const wrongs=shuffle(OPP.filter(p=>p[1]!==pair[1])).slice(0,2).map(p=>p[1]);
  shuffle([pair[1],...wrongs]).forEach(v=>{const b=el('button','pz-opt',v);
   b.onclick=()=>{if(v===pair[1]){AU.sfx('select');round++;next()}else wrongFx(b,b,'חִשְּׁבִי עַל הַהֶפֶךְ')};
   row.appendChild(b)});}
 next();TTS.say('בַּחֲרִי אֶת הַהֶפֶךְ');}
function pzColorMix(box){let round=0;const R=3;
 const MIX=[['🔴','','#ff8c00'],['🔵','','#22c55e'],['🔴','🔵','#8b5cf6']];
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';$('#pzHint').textContent='אֵיזֶה צֶבַע יוֹצֵא? ('+(round+1)+'/'+R+')';
  const m=MIX[rnd(MIX.length)];
  box.appendChild(el('div','pz-word',m[0]+' + '+m[1]));
  const row=el('div','pz-row');box.appendChild(row);
  const wrongs=['#ff0000','#0000ff','#ffff00'].filter(c=>c!==m[2]).slice(0,2);
  shuffle([m[2],...wrongs]).forEach(c=>{const b=el('button','pz-opt');
   b.innerHTML='<span style="display:block;width:52px;height:52px;border-radius:50%;background:'+c+'"></span>';
   b.onclick=()=>{if(c===m[2]){AU.sfx('select');round++;next()}else wrongFx(b,b,'עַרְבְּבִי בָּרֹאשׁ')};
   row.appendChild(b)});}
 next();TTS.say('אֵיזֶה צֶבַע יוֹצֵא?');}
function pzOddOneOut(box){let round=0;const R=3;
 const GROUPS=[['🐶','','🐶',''],['🍎','','🍎',''],['🚗','','🚗',''],['🌸','','🌸','']];
 function next(){if(round>=R){closePuzzle(true);return}
  box.innerHTML='';$('#pzHint').textContent='מִי שׁוֹנֶה? ('+(round+1)+'/'+R+')';
  const g=GROUPS[rnd(GROUPS.length)];const odd=g[3];
  const row=el('div','pz-row');box.appendChild(row);
  shuffle(g).forEach(v=>{const b=el('button','pz-opt',v);
   b.onclick=()=>{if(v===odd){AU.sfx('select');round++;next()}else wrongFx(b,b,'חַפְּשִׂי אֶת מִי שֶׁלֹּא שַׁיָּךְ')};
   row.appendChild(b)});}
 next();TTS.say('מִי שׁוֹנֶה?');}
function pzMemory(box){
 const faces=shuffle(['🐶','','🐮','🐷']).slice(0,3);
 const cards=shuffle([...faces,...faces]);
 const row=el('div','pz-row');box.appendChild(row);
 let sel=null,matched=0;$('#pzHint').textContent='מִצְאִי זוּגוֹת!';
 cards.forEach(f=>{const b=el('button','pz-opt','❔');
  b.onclick=()=>{if(b.classList.contains('done')||sel===b)return;
   b.textContent=f;
   if(!sel){sel=b;return;}
   if(sel.textContent===f){sel.classList.add('done');b.classList.add('done');sel=null;matched+=2;
    if(matched===cards.length)closePuzzle(true);}
   else{const a=sel;sel=null;setTimeout(()=>{a.textContent='❔';b.textContent='❔';},600);}};
  row.appendChild(b)});}
const GATE_BUILDERS={
 0:[pzAnimals,pzOddOneOut],1:[pzShapes,pzOddOneOut],2:[pzLetters,pzMemory],
 3:[pzMusic],4:[pzEmo,pzMemory],5:[pzMath,pzColorMix],
 6:[pzColor,pzColorMix,pzOddOneOut],7:[pzSize,pzOpposite],8:[pzTime,pzOpposite],
 9:[pzAnimals,pzShapes,pzLetters,pzMusic,pzEmo,pzMath,pzColor,pzSize,pzTime,pzOpposite,pzColorMix,pzOddOneOut,pzMemory]};
export function pzGate(box){const list=GATE_BUILDERS[RT.level]||[pzAnimals];
 list[rnd(list.length)](box)}
export function pzBoss(box){const pool=[pzAnimals,pzShapes,pzLetters,pzMusic,pzEmo,pzMath,pzColor,pzSize,pzTime];pool[rnd(pool.length)](box)}
