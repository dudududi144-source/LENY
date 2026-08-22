/* ui/garden.js — גינת היצירה: השמת מדבקות חופשית (הנשמה שחוזרת מהמקור)
   הפעלה פתוחה ללא "נכון/לא נכון" — יצירה, שליטה ובחירה (עפ"י מודל הילדים המוביל) */
import {$,el} from '../core/utils.js';
import {S,save} from '../core/state.js';
import {AU} from '../core/audio.js';

const GST=['🌸','🌷','🌻','⭐','🦋','🐞','🌈','☀️','🍄','🎀'];
let picked='🌸';

export function renderGarden(){
 const pal=$('#gardenPalette'),stage=$('#gardenStage');
 if(!pal||!stage)return;
 pal.innerHTML='';
 GST.forEach(e2=>{const b=el('button','pal-btn'+(e2===picked?' sel':''),e2);
  b.setAttribute('aria-label','בחירת מדבקה '+e2);
  b.onclick=()=>{picked=e2;AU.sfx('tap');renderGarden()};
  pal.appendChild(b);});
 const clear=el('button','pal-btn','🗑️');
 clear.onclick=()=>{S.garden=[];save();AU.sfx('wrong');renderGarden()};
 pal.appendChild(clear);
 stage.innerHTML='';
 (S.garden||[]).forEach((it,idx)=>{const s=el('div','gsticker',it.e);
  s.setAttribute('role','button');s.setAttribute('aria-label','מדבקה בגינה — לחיצה מסירה');
  s.style.left=it.x+'%';s.style.top=it.y+'%';
  s.onclick=ev=>{ev.stopPropagation();S.garden.splice(idx,1);save();AU.sfx('tap');renderGarden()};
  stage.appendChild(s);});
 const cnt=$('#gardenCount');
 if(cnt)cnt.textContent=(S.garden||[]).length+' מדבקות בגינה ✿';}

export function initGarden(){
 const stage=$('#gardenStage');
 if(!stage||stage.dataset.ready)return;
 stage.dataset.ready='1';
 stage.addEventListener('pointerdown',e=>{
  if(e.target!==stage)return;
  const r=stage.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;
  if(!Array.isArray(S.garden))S.garden=[];
  S.garden.push({e:picked,x:+x.toFixed(1),y:+y.toFixed(1)});
  save();AU.sfx('select');renderGarden();});}
