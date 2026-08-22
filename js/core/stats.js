/* core/stats.js — אנליטיקס מקומית בלבד (#26)
   מונים אגרגטיביים ב-localStorage, אפס רשת, אפס PII.
   מזין את דשבורד ההורים (#18) ואת איזון הקושי. */
import {S,save} from './state.js';

function ensure(){if(typeof S.stats!=='object'||S.stats===null)S.stats={domains:{},playSec:0,sessions:0};
 if(typeof S.stats.domains!=='object')S.stats.domains={};
 if(typeof S.stats.playSec!=='number')S.stats.playSec=0;
 if(typeof S.stats.sessions!=='number')S.stats.sessions=0;}

export function recordAttempt(domain,correct){ensure();
 const d=S.stats.domains[domain]||(S.stats.domains[domain]={a:0,s:0});
 d.a++;if(correct)d.s++;save();}
export function addPlaySec(sec){ensure();S.stats.playSec+=sec;save();}
export function newSession(){ensure();S.stats.sessions++;save();}
export function mastery(domain){ensure();const d=S.stats.domains[domain];
 if(!d||d.a===0)return null;return Math.round(100*d.s/d.a);}
export function summaryStats(){ensure();
 const out={domains:{},playSec:S.stats.playSec,sessions:S.stats.sessions};
 for(const k in S.stats.domains){const d=S.stats.domains[k];
  out.domains[k]={attempts:d.a,success:d.s,pct:d.a?Math.round(100*d.s/d.a):0};}
 return out;}
export function resetStats(){ensure();S.stats={domains:{},playSec:0,sessions:0};save();}
