/* game/skill-model.js — מוח הלמידה של המשחק (M1)
   מודל מיומנות פר-תחום: 9 תחומים × רמות 1–5.
   נפרד לחלוטין מ-"skill" של מהירות האויבים — כאן מודדים ידע, לא קושי מוטורי.

   אלגוריתם:
   - לכל תחום ניקוד פנימי 0..10 (מתחיל ב-0)
   - תשובה נכונה: +1 · תשובה שגויה: −2 (נפילה כואבת יותר מעלייה — מניעת ניחוש)
   - רמה = 1 + floor(ניקוד/2), חסום ב-1..5
*/
import {S,save} from '../core/state.js';

export const DOMAINS=['animals','shapes','letters','music','emotions','math','colors','sizes','time'];

function ensure(){if(!S.skillModel||typeof S.skillModel!=='object')S.skillModel={};}

export function getScore(domain){ensure();return S.skillModel[domain]||0;}

export function getLevel(domain){return Math.min(5,1+Math.floor(getScore(domain)/2));}

/* מחזיר {level, leveledUp} כדי שהמשחק יוכל לחגוג עליית רמה */
export function recordResult(domain,correct){
 if(!DOMAINS.includes(domain))return{level:getLevel(domain||'animals'),leveledUp:false};
 ensure();
 const before=getLevel(domain);
 const cur=S.skillModel[domain]||0;
 const next=Math.max(0,Math.min(10,cur+(correct?1:-2)));
 S.skillModel[domain]=next;
 save();
 const level=getLevel(domain);
 return{level,leveledUp:level>before};}

export function resetModel(){S.skillModel={};save();}

/* ספייסינג v1 (M1 #10): התחום עם הניקוד הנמוך ביותר שנוסה — מועמד לחזרה */
export function weakestDomain(){ensure();
 const q=(S.reviewQueue||[])[0];if(q&&DOMAINS.includes(q))return q;
 let w=null,min=11;
 for(const d of DOMAINS){const s=S.skillModel[d];
  if(s===undefined)continue;
  if(s<min){min=s;w=d;}}
 return(w!==null&&min<=3)?w:null;}

export function summary(){ensure();
 return DOMAINS.map(d=>({domain:d,score:getScore(d),level:getLevel(d)}));}
