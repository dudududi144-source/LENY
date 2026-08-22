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

/* ── כלי פלייטסט (#1,#27): הקלטת מדדי מפגש + דוח לחוקר ── */
function ensureLevels(){ensure();if(typeof S.stats.levels!=='object'||S.stats.levels===null)S.stats.levels={};}
export function recordLevel(level,info){ensureLevels();
 const key=String(level);const cur=S.stats.levels[key]||(S.stats.levels[key]={plays:0,deaths:0,fails:0,sec:0,wins:0});
 cur.plays++;cur.deaths+=info.deaths||0;cur.fails+=info.puzzleFails||0;cur.sec+=info.sec||0;cur.wins+=info.wins||0;save();}
export function buildReport(){ensure();
 return {generatedAt:new Date().toISOString(),
  sessions:S.stats.sessions, totalPlaySec:S.stats.playSec,
  domains:S.stats.domains, levels:S.stats.levels};}
export function reportJSON(){return JSON.stringify(buildReport(),null,2);}
