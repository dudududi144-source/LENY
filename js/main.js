/* main.js — אתחול המשחק ולולאת ראשית
   סדר אתחול: רקע → דמויות → מסכים → הורים → קלט → לולאה */
import {$} from './core/utils.js';
import {S} from './core/state.js';
import {AU} from './core/audio.js';
import {RT,LEN} from './game/runtime.js';
import {makeLenny} from './ui/lenny.js';
import {initScenes,goTitle} from './ui/scenes.js';
import {initParent} from './ui/parent.js';
import {initInput} from './ui/input.js';
import {update} from './engine/engine.js';
import {draw} from './engine/renderer.js';
import {hudSync} from './ui/hud.js';

/* לכידת שגיאות גלובלית (דיאגנוסטיקה בפלייטסטים ובדיקות) */
window.addEventListener('error',e=>{try{(window.__lenyErrors=window.__lenyErrors||[]).push(String(e.message));}catch(_){/* noop */}});

function boot(){
 /* כוכבים ברקע הרכז */
 const st=$('#stars');
 for(let i=0;i<26;i++){const s=document.createElement('span');
  s.style.left=Math.random()*100+'%';s.style.top=Math.random()*55+'%';
  s.style.animationDelay=Math.random()*3+'s';st.appendChild(s)}

 /* מופעי דמות */
 LEN.title=makeLenny($('#titleLenny'));
 LEN.hub=makeLenny($('#hubLennyBox'));
 LEN.done=makeLenny($('#doneLenny'));
 LEN.win=makeLenny($('#winLenny'));
 LEN.title.play('wave');
 document.body.classList.toggle('night',S.night);

 /* חוטים (מנוי אירועים + כפתורים + קלט) */
 initScenes();initParent();initInput();
 document.addEventListener('pointerdown',()=>{AU.ensure();AU.refresh()},{passive:true});

 /* לולאת משחק */
 /* לולאת משחק + משמר פריימים (#23): ממוצע נע של זמן פריים;
   מעל 34ms בממוצע — מעבר למצב חסכון שמקל על הרינדור */
let ftAvg=16,lastT=performance.now();
function loop(){requestAnimationFrame(loop);
  const now=performance.now();const dt=Math.min(100,now-lastT);lastT=now;
  ftAvg=ftAvg*.92+dt*.08;
  RT.perf=ftAvg>34?0:1;
  if(RT.screen==='play'){
   if(!RT.paused)update();
   draw();hudSync()}}
 requestAnimationFrame(loop);
 goTitle()}

boot();
