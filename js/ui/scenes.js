/* ui/scenes.js — ניהול מסכים: כותרת, רכז, מדבקות, סיום, הפסד, ניצחון
   נרשם לאירועי המנוע דרך ה-bus (צימוד חד-כיווני) */
import {$,$$,el,later,cleanT} from '../core/utils.js';
import {on} from '../core/bus.js';
import {S} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {toast,confetti} from './fx.js';
import {RT,LEN} from '../game/runtime.js';
import {WORLDS} from '../game/levels.js';
import {startWorld,togglePause} from '../engine/engine.js';

function showScreen(id){$$('.scr').forEach(s=>s.classList.remove('show'));
 if(id)$('#scr-'+id).classList.add('show')}

function fadeTo(fn){$('#fade').style.opacity=1;
 setTimeout(()=>{fn();$('#fade').style.opacity=0},330)}

export function goTitle(){RT.screen='title';RT.paused=false;showScreen('title');
 $('#wrap').classList.remove('show');LEN.title.play('wave')}

export function goHub(){RT.screen='hub';RT.paused=false;cleanT();showScreen('hub');
 $('#wrap').classList.remove('show');renderHub()}

function renderHub(){
 LEN.hub.sync(S.items.map(w=>WORLDS[w].reward));LEN.hub.play('idle');
 const n=S.name.trim();
 $('#hubHello').textContent=n?('הַי '+n+'! בְּחֲרִי עוֹלָם'):'הַי לֶנִי! בְּחֲרִי עוֹלָם';
 $('#hubProgress').textContent='⭐ '+S.items.length+'/'+WORLDS.length;
 const box=$('#hubBubbles');box.innerHTML='';
 WORLDS.forEach((w,i)=>{
  const unlocked=i===0||S.items.includes(i-1);
  const done=S.items.includes(i);
  const b=el('button','bubble'+(unlocked?'':' locked'));
  b.style.animationDelay=(i*.08)+'s';
  b.setAttribute('aria-label',w.name);
  b.innerHTML='<span class="bi">'+(unlocked?w.icon:'🔒')+'</span><span class="bl">'+w.name+'</span><span class="bs">'+(done?'⭐'.repeat(Math.max(1,S.stars[i]||1)):'')+'</span>';
  if(done)b.appendChild(el('span','bdone','✓'));
  b.onclick=()=>{AU.ensure();
   if(!unlocked){AU.sfx('wrong');b.classList.add('shake');later(()=>b.classList.remove('shake'),420);
    toast('שַׂחֲקִי קוֹדֶם בָּעוֹלָם הַקּוֹדֵם! 🌟');return}
   AU.sfx('select');LEN.hub.play('cheer');TTS.say(w.learn);
   fadeTo(()=>startWorld(i))};
  box.appendChild(b)})}

/* ── מסך מדבקות (בהשראת "לני הגיבורה") ── */
function renderStickers(){
 const g=$('#stickerGrid');g.innerHTML='';
 WORLDS.forEach((w,i)=>{
  const got=S.items.includes(i);
  const d=el('div','stk-card'+(got?'':' locked'));
  d.style.animationDelay=(i*.07)+'s';
  d.innerHTML='<span class="si">'+(got?w.rIcon:'❔')+'</span><span class="sn">'+w.rName+'</span>';
  g.appendChild(d)});
 const totalStars=Object.values(S.stars).reduce((a,b)=>a+b,0);
 $('#stickerCount').innerHTML='✦ נאספו <b>'+totalStars+'/15</b> כוכבי חוכמה · שיא: <b>'+S.best+'</b>'}

function showStickers(){RT.screen='stickers';RT.paused=false;showScreen('stickers');
 $('#wrap').classList.remove('show');renderStickers();AU.sfx('open')}

/* ── מסכי סיום/הפסד/ניצחון ── */
function showDone(d){const first=d&&d.first;
 RT.screen='done';$('#wrap').classList.remove('show');showScreen('done');
 LEN.done.sync(S.items.map(w=>WORLDS[w].reward));
 const w=WORLDS[RT.level];
 $('#doneReward').textContent=first?w.rIcon:'🏅';
 $('#doneName').textContent=first?('לני קיבלה את '+w.rSay+'!'):'כָּל הַכָּבוֹד! שׁוּב הִשְׁלַמְתְּ אֶת הָעוֹלָם';
 $('#doneStats').innerHTML='ניקוד: <b>'+RT.score+'</b> · יהלומים: <b>'+RT.levelCoins+'/'+RT.levelCoinsTotal+'</b>';
 $('#doneStars').textContent='שערי חוכמה: '+'✦'.repeat(RT.gatesSolvedNow)+' ('+RT.gatesSolvedNow+'/3)';
 LEN.done.play(first?'spin':'cheer');
 if(first){confetti();AU.sfx('goal');TTS.say('לֶנִי קִבְּלָה אֶת '+w.rSay)}else AU.sfx('success')}

function showGameOver(){
 RT.screen='over';$('#wrap').classList.remove('show');showScreen('over');
 $('#overScore').textContent=RT.score;$('#overBest').textContent=S.best;
 AU.sfx('wrong');TTS.say('נְסִי שׁוּב, אַתְּ מְצֻיֶּנֶת!')}

function showWin(){
 RT.screen='win';$('#wrap').classList.remove('show');showScreen('win');
 LEN.win.sync(['hearts','hat','bow','tutu','boots','crown']);LEN.win.play('dance');
 $('#winScore').textContent=RT.score;confetti();AU.sfx('goal');later(confetti,1200);
 TTS.say('כָּל הַכָּבוֹד! לֶנִי נִצְּחָה!')}

/* ── אתחול: מנוי לאירועים + חיבור כפתורים ── */
export function initScenes(){
 on('level-done',showDone);
 on('game-over',showGameOver);
 on('win',showWin);
 $('#btnStart').onclick=()=>{AU.ensure();AU.sfx('success');TTS.say('יַאלְלָה!');goHub()};
 $('#btnDoneHome').onclick=()=>{AU.sfx('tap');goHub()};
 $('#btnRetry').onclick=()=>{AU.sfx('tap');fadeTo(()=>startWorld(RT.level))};
 $('#btnOverHome').onclick=()=>{AU.sfx('tap');goHub()};
 $('#btnWinHome').onclick=()=>{AU.sfx('tap');goHub()};
 $('#btnResume').onclick=()=>{$('#pauseM').classList.remove('show');RT.paused=false;AU.sfx('tap')};
 $('#btnPauseHome').onclick=()=>{$('#pauseM').classList.remove('show');RT.paused=false;goHub()};
 $('#hudPause').onclick=()=>togglePause();
 $('#hubStickers').onclick=()=>{AU.ensure();showStickers()};
 $('#stickersBack').onclick=()=>{AU.sfx('tap');goHub()}}
