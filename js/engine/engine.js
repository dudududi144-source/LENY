/* engine/engine.js — לוגיקת משחק: ניתוח מפה, עדכון, שערי חוכמה, בוס, פגיעה, סיום שלב
   מפיץ אירועים: 'level-done' {first} · 'game-over' · 'win' */
import {$$,later,rnd} from '../core/utils.js';
import {emit} from '../core/bus.js';
import {S,DIFF,save,saveSoon} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {RT,keys} from '../game/runtime.js';
import {TILE,THEMES,WORLDS,LEVELS} from '../game/levels.js';
import {GRAV,MOVE,MAXV,FRIC,JUMP,rectVsMap,aabb} from './physics.js';
import {openPuzzle,pzGate,pzBoss,PZ} from '../game/puzzles.js';
import {tutorialStart,tutorialUpdate,tutorialComplete} from './tutorial.js';
import {DOMAINS} from '../game/skill-model.js';

const isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;

function makePlayer(x,y){return{x,y,w:30,h:42,vx:0,vy:0,onGround:false,face:1,coyote:0,jbuf:0,jumps:0,runPhase:0,squash:0,blink:0}}

export function parseLevel(li){
 RT.theme=THEMES[li];const m=LEVELS[li].map;RT.rows=m.length;RT.cols=Math.max(...m.map(r=>r.length));
 RT.levelMap=[];RT.ents=[];RT.parts=[];RT.texts=[];RT.boss=null;RT.gates=[];
 RT.levelCoins=0;RT.levelCoinsTotal=0;RT.combo=0;RT.gatesSolvedNow=0;let px=80,py=80;
 for(let r=0;r<RT.rows;r++){RT.levelMap[r]=[];
  for(let c=0;c<RT.cols;c++){const ch=m[r][c]||'.';RT.levelMap[r][c]=(ch==='#')?1:0;
   const x=c*TILE,y=r*TILE;
   if(ch==='P'){px=x;py=y}
   else if(ch==='C'){RT.ents.push({t:'coin',x:x+10,y:y+10,w:24,h:24,ph:Math.random()*6,got:false});RT.levelCoinsTotal++}
   else if(ch==='S'){if(S.mode!=='חוקר')RT.ents.push({t:'spike',x,y:y+TILE-18,w:TILE,h:18});}
   else if(ch==='E'){if(S.mode!=='חוקר')RT.ents.push({t:'enemy',kind:'walk',x,y:y+8,w:38,h:36,vx:1.3*(Math.random()<.5?1:-1)*DIFF[S.diff].spd,min:x-90,max:x+90,ph:Math.random()*6,dead:false});}
   else if(ch==='Y'){if(S.mode!=='חוקר')RT.ents.push({t:'enemy',kind:'fly',x,y,w:36,h:30,sx:x,sy:y,ph:Math.random()*6,dead:false});}
   else if(ch==='M')RT.ents.push({t:'move',x,y,w:TILE*2.6,h:16,sx:x,sy:y,ax:(Math.random()<.5?'x':'y'),range:100,ph:Math.random()*6});
   else if(ch==='H')RT.ents.push({t:'heart',x:x+8,y:y+8,w:28,h:28,ph:Math.random()*6,got:false});
   else if(ch==='F')RT.ents.push({t:'flag',x,y:y-TILE,w:TILE,h:TILE*2});
   else if(ch>='1'&&ch<='3'){RT.gates.push({num:+ch,col:c,row:r,open:!!S.gates[li+':'+ch],anim:0});
     RT.levelMap[r][c]=0}
   else if(ch==='B'){if(S.mode==='חוקר'){RT.ents.push({t:'flag',x,y:y-TILE,w:TILE,h:TILE*2})}
    else{RT.boss={x,y:y-TILE*1.2,w:TILE*2.2,h:TILE*1.9,hp:5,maxhp:5,vx:1.5,vy:0,onGround:false,flash:0,dead:false,dir:-1,jumpT:0,hitT:0,ph:0}}}
  }}
 RT.player=makePlayer(px,py);RT.cam={x:0,y:0};RT.powers={shield:false,magnet:0,star:0};RT.dying=0;
 RT.curHint=LEVELS[li].hint;RT.hintTimer=280;buildDeco()}

function buildDeco(){RT.deco=[];for(let i=0;i<22;i++)RT.deco.push({x:Math.random()*RT.cols*TILE,y:Math.random()*RT.rows*TILE,z:.15+Math.random()*.4,s:2+Math.random()*3,p:Math.random()*6})}

function capParts(){if(RT.parts.length>140)RT.parts.splice(0,RT.parts.length-140)}
export function burst(x,y,col,n,sp){capParts();for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=(sp||3)*(.4+Math.random());
 RT.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:26+rnd(18),max:40,c:col,r:2+Math.random()*2.5,g:.12})}}
function dust(x,y){capParts();for(let i=0;i<5;i++)RT.parts.push({x:x+(Math.random()-.5)*16,y,vx:(Math.random()-.5)*1.5,vy:-Math.random()*1.2,life:20,max:20,c:'#b9a6e8',r:2.5,g:.05})}
function addText(x,y,txt,col){RT.texts.push({x,y,txt,c:col||'#7dffb8',life:50,max:50})}

/* ── שערי חוכמה (Power-Learning) ── */
const GATE_POWER=[null,
 {k:'shield',say:'מָגֵן! מְכַסֶּה אוֹתָךְ מִמַּכָּה אַחַת'},
 {k:'magnet',say:'מַגְנֵט! מַפְעִיל מְשִׁיכַת יְהַלּוֹמִים'},
 {k:'star',say:'כּוֹכָב! כֹּחַ בַּל יְנַצְּחוּךָ'}];
function tryGate(){if(RT.puzzleBusy||RT.paused)return;
 for(const g of RT.gates){if(g.open)continue;
  const gr={x:g.col*TILE-8,y:0,w:TILE+16,h:(g.row+1)*TILE};
  if(aabb(RT.player,gr)){AU.sfx('tap');
   tutorialComplete();
   PZ.domain=RT.level<=8?DOMAINS[RT.level]:null;
   openPuzzle('✦ שער חוכמה ✦','עולמן של ה'+WORLDS[RT.level].learn,pzGate,(ok)=>{
    if(ok){g.open=true;g.anim=30;S.gates[RT.level+':'+g.num]=true;RT.gatesSolvedNow++;
     if(RT.review){RT.score+=200;addText(g.col*TILE+22,g.row*TILE-40,'+200 חיזוק ✿','#FFD76A');}
     RT.score+=300;addText(g.col*TILE+22,g.row*TILE,'+300 ✦','#FFD76A');
     const pw=GATE_POWER[g.num];
     if(pw.k==='shield')RT.powers.shield=true;
     if(pw.k==='magnet')RT.powers.magnet=600;
     if(pw.k==='star')RT.powers.star=420;
     AU.sfx('gate');later(()=>AU.sfx('power'),300);
     burst(g.col*TILE+22,g.row*TILE+22,RT.theme.accent,24,5);RT.shake=4;
     TTS.say(pw.say);saveSoon()}});
   return}}}

/* ── בוס ── */
function updateBoss(){
 const b=RT.boss,p=RT.player,starOn=RT.powers.star>0;
 b.ph+=.08;if(b.flash>0)b.flash--;if(b.hitT>0)b.hitT--;
 const dx=(p.x+p.w/2)-(b.x+b.w/2);b.dir=dx>0?1:-1;
 b.vx=b.dir*(1.6+(b.maxhp-b.hp)*.35)*RT.skill;
 b.vy+=GRAV;if(b.vy>16)b.vy=16;b.jumpT++;
 if(b.onGround&&b.jumpT>90&&Math.abs(dx)<260){b.vy=-13;b.jumpT=0}
 const o={x:b.x,y:b.y,w:b.w,h:b.h,vx:b.vx,vy:b.vy,onGround:false};
 rectVsMap(o);b.x=o.x;b.y=o.y;b.vy=o.vy;b.onGround=o.onGround;
 b.x=Math.max(0,Math.min(RT.cols*TILE-b.w,b.x));
 if(aabb(p,b)&&RT.invuln<=0){
  if(p.vy>2&&(p.y+p.h)-b.y<30&&b.hitT<=0&&!RT.puzzleBusy){
   b.hitT=9999;p.vy=JUMP*.85;AU.sfx('stomp');
   openPuzzle('⚔️ מַכַּת חָכְמָה!','עני נכון כדי לפגוע בגנרל',pzBoss,(ok)=>{
    b.hitT=45;if(ok)hitBoss()})}
  else if(!starOn&&b.hitT<=0)hurt();
  else if(starOn&&b.hitT<=0){b.hitT=45;hitBoss()}}}
function hitBoss(){
 const b=RT.boss;b.hp--;b.flash=20;AU.sfx('bosshit');RT.shake=10;RT.score+=300;
 addText(b.x+b.w/2,b.y,'+300','#b967ff');
 burst(b.x+b.w/2,b.y+b.h/3,'#b967ff',20,6);
 if(b.hp<=0){b.dead=true;AU.sfx('bossdie');RT.shake=20;RT.score+=1000;
  addText(b.x+b.w/2,b.y,'+1000 הובס!','#FFD76A');
  for(let i=0;i<5;i++)later(()=>burst(b.x+Math.random()*b.w,b.y+Math.random()*b.h,'#FFD76A',20,7),i*120);
  RT.ents.push({t:'flag',x:b.x+b.w/2,y:b.y,w:TILE,h:TILE*2})}}

/* ── פגיעה ── */
const DPRAISE={animals:'קוֹלוֹת הַחַיּוֹת',shapes:'הַצּוּרוֹת',letters:'הָאוֹתִיּוֹת',music:'הַמּוּזִיקָה',emotions:'הָרְגָשׁוֹת',math:'הַחֶשְׁבּוֹן',colors:'הַצְּבָעִים',sizes:'הַגְּדָלִים',time:'הַשָּׁעוֹת'};
const ENCOURAGE=['אַתְּ מַצְלִיחָה! בּוֹאִי נְנַסֶּה שׁוּב','כִּמְעַט! עוֹד קְצָת','כָּל הַכָּבוֹד שֶׁנִּסִּית!'];
export function hurt(fell){
 if(RT.powers.star>0||RT.dying>0)return;
 if(RT.powers.shield){RT.powers.shield=false;RT.invuln=80;AU.sfx('hurt');RT.shake=8;
  burst(RT.player.x+15,RT.player.y+21,'#4dc9ff',16,5);RT.player.vy=-8;return}
 /* מצב חוקר: נחיתה רכה — חזרה עדינה להתחלה, עידוד קולי, אפס כישלון */
 if(S.mode==='חוקר'){
  AU.sfx('gentle');RT.invuln=90;RT.shake=3;
  burst(RT.player.x+15,RT.player.y+21,'#7dffb8',12,3);
  TTS.say(ENCOURAGE[rnd(ENCOURAGE.length)]);
  const m=LEVELS[RT.level].map;
  for(let r=0;r<RT.rows;r++)for(let c=0;c<(m[r]||'').length;c++)if(m[r][c]==='P'){RT.player.x=c*TILE;RT.player.y=r*TILE;RT.player.vx=0;RT.player.vy=0}
  return}
 RT.lives--;AU.sfx('hurt');RT.shake=12;RT.invuln=90;RT.combo=0;RT.skill=Math.max(.7,RT.skill-.05);
 burst(RT.player.x+15,RT.player.y+21,'#ff2e88',16,5);
 if(RT.lives<=0){RT.dying=1;RT.player.vy=-10;return}
 if(fell){const m=LEVELS[RT.level].map;
  for(let r=0;r<RT.rows;r++)for(let c=0;c<(m[r]||'').length;c++)if(m[r][c]==='P'){RT.player.x=c*TILE;RT.player.y=r*TILE;RT.player.vx=0;RT.player.vy=0}}
 else{RT.player.vy=-8;RT.player.vx=-RT.player.face*4}}

/* ── סיום שלב ── */
function levelDone(){AU.sfx('goal');RT.score+=500;
 if(RT.level<=8&&DPRAISE[DOMAINS[RT.level]])TTS.say('הִתְקַדַּמְתְּ בְּ'+DPRAISE[DOMAINS[RT.level]]+'!');
 const first=!S.items.includes(RT.level);
 if(first)S.items.push(RT.level);
 S.stars[RT.level]=Math.max(S.stars[RT.level]||0,RT.gatesSolvedNow);
 S.best=Math.max(S.best,RT.score);save();
 const allDone=[0,1,2,3,4,5,6,7,8].every(i=>S.items.includes(i))&&RT.level===9;
 if(allDone)emit('win');else emit('level-done',{first})}

function gameOver(){S.best=Math.max(S.best,RT.score);save();emit('game-over')}

/* ── עדכון פריים ── */
export function update(){
 RT.time++;if(RT.shake>0)RT.shake*=.86;if(RT.invuln>0)RT.invuln--;
 if(S.timeLimit>0&&RT.sessionStart){
  const rem=S.timeLimit-(Date.now()-RT.sessionStart)/60000;
  if(rem<=2&&rem>0&&!RT.restWarned){RT.restWarned=true;emit('rest-warn');}
  if(rem<=0&&!RT.rested){RT.rested=true;emit('rest');}}
 if(RT.powers.magnet>0)RT.powers.magnet--;if(RT.powers.star>0)RT.powers.star--;
 if(RT.comboT>0){RT.comboT--;if(RT.comboT===0)RT.combo=0}
 for(let i=RT.parts.length-1;i>=0;i--){const q=RT.parts[i];q.x+=q.vx;q.y+=q.vy;q.vy+=q.g;q.life--;if(q.life<=0)RT.parts.splice(i,1)}
 for(let i=RT.texts.length-1;i>=0;i--){const t=RT.texts[i];t.y-=1;t.life--;if(t.life<=0)RT.texts.splice(i,1)}
 RT.gates.forEach(g=>{if(g.anim>0)g.anim--});
 if(RT.dying>0){RT.dying++;RT.player.vy+=GRAV*.5;RT.player.y+=RT.player.vy;
  if(RT.dying>70)gameOver();return}
 const p=RT.player,starOn=RT.powers.star>0;
 if(keys.l){p.vx-=MOVE;p.face=-1}
 if(keys.r){p.vx+=MOVE;p.face=1}
 if(!keys.l&&!keys.r)p.vx*=FRIC;
 const mv=starOn?MAXV*1.35:MAXV;p.vx=Math.max(-mv,Math.min(mv,p.vx));
 p.vy+=GRAV;if(p.vy>16)p.vy=16;
 if(p.onGround){p.coyote=S.mode==='חוקר'?14:8;p.jumps=0}else if(p.coyote>0)p.coyote--;
 if(p.jbuf>0){p.jbuf--;
  if(p.coyote>0){p.vy=JUMP;p.coyote=0;p.jbuf=0;AU.sfx('jump');dust(p.x+p.w/2,p.y+p.h);p.squash=-.25}
  else if(p.jumps<1){p.vy=JUMP*.92;p.jumps=1;p.jbuf=0;AU.sfx('djump');burst(p.x+p.w/2,p.y+p.h,RT.theme.accent,8,2.5)}}
 const wasAir=!p.onGround;
 rectVsMap(p);
 if(p.onGround&&wasAir){AU.sfx('land');dust(p.x+p.w/2,p.y+p.h);p.squash=.3}
 p.squash*=.85;
 if(Math.abs(p.vx)>.5&&p.onGround)p.runPhase+=Math.abs(p.vx)*.09;else p.runPhase*=.8;
 if(Math.random()<.006)p.blink=8;if(p.blink>0)p.blink--;
 if(RT.tut>0)tutorialUpdate(p);
 tryGate();
 for(let i=0;i<RT.ents.length;i++){const e=RT.ents[i];
  if(e.t==='move'){e.ph+=.02;const off=Math.sin(e.ph)*e.range;
   const nx=e.ax==='x'?e.sx+off:e.sx,ny=e.ax==='y'?e.sy+off:e.sy;
   e.dx=nx-e.x;e.dy=ny-e.y;e.x=nx;e.y=ny;
   if(p.vy>=0&&p.x+p.w>e.x&&p.x<e.x+e.w&&p.y+p.h>e.y-6&&p.y+p.h<e.y+e.h+10){
    p.y=e.y-p.h;p.vy=0;p.onGround=true;p.x+=e.dx;p.coyote=8;p.jumps=0}}
  if(e.t==='enemy'&&!e.dead){
   if(e.kind==='walk'){e.ph+=.1;e.x+=e.vx*RT.skill;if(e.x<e.min||e.x>e.max)e.vx*=-1}
   else{e.ph+=.05;e.x=e.sx+Math.sin(e.ph)*70;e.y=e.sy+Math.cos(e.ph*1.7)*40}
   if(aabb(p,e)&&RT.invuln<=0){
    if(starOn){e.dead=true;RT.score+=200;AU.sfx('stomp');addText(e.x+19,e.y,'+200','#FFD76A');burst(e.x+19,e.y+18,'#FFD76A',16,5);RT.shake=5}
    else if(p.vy>2&&p.y+p.h-e.y<22){e.dead=true;p.vy=JUMP*.7;RT.combo++;RT.comboT=120;
     const pts=150*RT.combo;RT.score+=pts;AU.sfx('stomp');addText(e.x+19,e.y,'+'+pts,'#ff2e88');burst(e.x+19,e.y+18,'#ff2e88',14,4);RT.shake=4}
    else hurt()}}
  if(e.t==='coin'&&!e.got){e.ph+=.08;
   if(RT.powers.magnet>0){const dx2=(p.x+15)-(e.x+12),dy2=(p.y+21)-(e.y+12),d=Math.hypot(dx2,dy2);
    if(d<150&&d>1){e.x+=dx2/d*5;e.y+=dy2/d*5}}
   if(aabb(p,e)){e.got=true;RT.coins++;RT.levelCoins++;RT.score+=50;AU.sfx('coin');
    addText(e.x+12,e.y,'+50');burst(e.x+12,e.y+12,'#FFD76A',10,3)}}
  if(e.t==='heart'&&!e.got){e.ph+=.06;if(aabb(p,e)){e.got=true;RT.lives=Math.min(5,RT.lives+1);AU.sfx('power');
   addText(e.x+14,e.y,'+❤','#ff2e88');burst(e.x+14,e.y+14,'#ff2e88',12,3)}}
  if(e.t==='spike'&&aabb(p,e)&&RT.invuln<=0&&!starOn)hurt();
  if(e.t==='flag'&&aabb(p,e)){RT.ents.splice(i,1);levelDone();return}}
 if(RT.boss&&!RT.boss.dead)updateBoss();
 if(p.y>RT.rows*TILE+200)hurt(true);
 const tx=p.x+p.w/2-480,ty=p.y+p.h/2-270-30;
 RT.cam.x+=(tx-RT.cam.x)*.1;RT.cam.y+=(ty-RT.cam.y)*.1;
 RT.cam.x=Math.max(0,Math.min(Math.max(0,RT.cols*TILE-960),RT.cam.x));
 RT.cam.y=Math.max(0,Math.min(Math.max(0,RT.rows*TILE-540),RT.cam.y))}

/* ── כניסה לעולם ── */
export function startWorld(li){
 RT.level=li;RT.score=0;RT.coins=0;RT.lives=DIFF[S.diff].lives;
 parseLevel(li);RT.screen='play';RT.paused=false;
 $$('.scr').forEach(s=>s.classList.remove('show'));
 document.getElementById('wrap').classList.add('show');
 document.getElementById('touch').style.display=isTouch?'block':'none';
 AU.setScale(li);RT.invuln=60;tutorialStart(li);
 RT.sessionStart=Date.now();RT.restWarned=false;RT.rested=false;
 RT.review=li<=8&&(Array.isArray(S.reviewQueue))&&S.reviewQueue.includes(DOMAINS[li]);
 if(RT.review)emit('review-toast');
 if(li===0&&!S.tutorial){RT.tut=1;
  later(()=>TTS.say('בְּרוּכָה הַבָּאָה! לַחֲצִי עַל הַחִצִּים כְּדֵי לָלֶכֶת'),700)}
 TTS.say(WORLDS[li].name)}

export function setJump(){if(RT.screen==='play'&&!RT.paused&&!RT.dying&&RT.player)RT.player.jbuf=S.mode==='חוקר'?12:8;}

export function togglePause(){if(PZ.open)return;
 const m=document.getElementById('pauseM');
 if(RT.screen==='play'&&!RT.paused){RT.paused=true;m.classList.add('show')}
 else if(RT.paused){RT.paused=false;m.classList.remove('show')}}
