/* engine/renderer.js — רינדור Canvas: רקע, אריחים, ישויות, לני, בוס, אפקטים */
import {RT} from '../game/runtime.js';
import {TILE} from '../game/levels.js';

export const W=960,H=540;
let DPR=1;
const cv=document.getElementById('cv'),cx=cv.getContext('2d');

export function resize(){const r=innerWidth/innerHeight,t=16/9;let w=innerWidth,h=innerHeight;
 if(r>t)w=h*t;else h=w/t;DPR=Math.min(2,devicePixelRatio||1);
 cv.style.width=w+'px';cv.style.height=h+'px';cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',resize);resize();

const starsBg=[];for(let i=0;i<80;i++)starsBg.push({x:Math.random()*2000,y:Math.random()*600,z:.2+Math.random()*.8,r:Math.random()*1.8+.4,p:Math.random()*6});

function hexA(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return 'rgba('+r+','+g+','+b+','+a+')'}
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}

function drawBG(){
 const theme=RT.theme;
 const g=cx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,theme.skyT);g.addColorStop(.55,theme.skyM);g.addColorStop(1,theme.skyB);
 cx.fillStyle=g;cx.fillRect(0,0,W,H);
 starsBg.forEach(s=>{const sx=((s.x-RT.cam.x*s.z)%(W+100)+W+100)%(W+100)-50,sy=((s.y-RT.cam.y*s.z*.5)%(H+100)+H+100)%(H+100)-50;
  const tw=.5+.5*Math.sin(RT.time*.05+s.p);cx.globalAlpha=.3+.6*tw*s.z;cx.fillStyle=theme.accent;
  cx.beginPath();cx.arc(sx,sy,s.r,0,7);cx.fill()});
 cx.globalAlpha=1;
 drawRange(RT.cam.x*.15,H*.62,140,theme.far);drawRange(RT.cam.x*.3,H*.72,110,theme.mid);
 RT.deco.forEach(d=>{const sx=((d.x-RT.cam.x*d.z)%(W+100)+W+100)%(W+100)-50,sy=((d.y-RT.cam.y*d.z*.3)%(H+100)+H+100)%(H+100)-50;
  cx.globalAlpha=.3+.4*Math.sin(RT.time*.06+d.p);cx.fillStyle=RT.theme.accent;
  cx.beginPath();cx.arc(sx,sy,d.s,0,7);cx.fill();cx.globalAlpha=1})}

function drawRange(off,base,amp,col){
 cx.fillStyle=col;cx.beginPath();cx.moveTo(0,H);
 for(let x=0;x<=W;x+=8){const wx=x+off;
  cx.lineTo(x,base+Math.sin(wx*.008)*amp*.5+Math.sin(wx*.02)*amp*.3+Math.sin(wx*.005)*amp*.4)}
 cx.lineTo(W,H);cx.closePath();cx.fill()}

const CC={hair:'#6B4A33',skin:'#F6C39A',dress:'#F7A8C4'};
function drawLenny(g,x,y,s,p){
 g.save();g.translate(x+s/2,y+s);
 if(RT.dying>0)g.rotate(RT.dying*.15);
 g.scale(p.face*s/44,s/44*(1+(p.squash||0)*.4));
 const starOn=RT.powers.star>0;if(starOn){g.shadowColor='#FFD76A';g.shadowBlur=22}
 const run=p.runPhase,air=!p.onGround;
 const legA=Math.sin(run)*6,legB=Math.sin(run+Math.PI)*6;
 g.strokeStyle=CC.skin;g.lineWidth=6;g.lineCap='round';
 g.beginPath();g.moveTo(-6,-12);g.lineTo(air?-9:-6+legA*.5,air?-2:1);g.stroke();
 g.beginPath();g.moveTo(6,-12);g.lineTo(air?9:6+legB*.5,air?-4:1);g.stroke();
 g.fillStyle='#5a4a42';
 g.beginPath();g.ellipse((air?-9:-6+legA*.5)+2,air?-1:2,6,3.5,0,0,7);g.fill();
 g.beginPath();g.ellipse((air?9:6+legB*.5)+2,air?-3:2,6,3.5,0,0,7);g.fill();
 g.fillStyle=CC.dress;
 g.beginPath();g.moveTo(-11,-14);g.lineTo(11,-14);g.lineTo(16,-30);g.lineTo(-16,-30);g.closePath();g.fill();
 g.fillStyle='#ffd7e6';g.globalAlpha=.6;
 g.beginPath();g.moveTo(-13,-16);g.lineTo(13,-16);g.lineTo(17,-12);g.lineTo(-17,-12);g.closePath();g.fill();g.globalAlpha=1;
 g.beginPath();g.moveTo(-8,-30);g.lineTo(8,-30);g.lineTo(7,-38);g.lineTo(-7,-38);g.closePath();g.fill();
 g.strokeStyle=CC.skin;g.lineWidth=5;
 const a1=Math.sin(run+Math.PI)*5,a2=Math.sin(run)*5;
 g.beginPath();g.moveTo(-9,-36);g.lineTo(-13+(air?-2:a1*.4),-26+(air?-6:0));g.stroke();
 g.beginPath();g.moveTo(9,-36);g.lineTo(13+(air?2:a2*.4),-26+(air?-8:0));g.stroke();
 g.fillStyle=CC.hair;
 g.beginPath();g.moveTo(-13,-46);g.quadraticCurveTo(-20,-30,-14,-18);g.quadraticCurveTo(-11,-26,-12,-34);g.closePath();g.fill();
 g.beginPath();g.moveTo(13,-46);g.quadraticCurveTo(20,-30,14,-18);g.quadraticCurveTo(11,-26,12,-34);g.closePath();g.fill();
 g.fillStyle=CC.skin;g.beginPath();g.arc(0,-46,11,0,7);g.fill();
 g.fillStyle=CC.hair;g.beginPath();g.arc(0,-48,11.5,Math.PI*.95,Math.PI*2.05);g.fill();
 g.fillStyle='#F2549A';
 g.beginPath();g.arc(-11,-52,3,0,7);g.fill();g.beginPath();g.arc(-15,-50,3,0,7);g.fill();
 g.fillStyle='#FFD76A';g.beginPath();g.arc(-13,-51,2,0,7);g.fill();
 const blink=p.blink>0;
 g.fillStyle='#fff';
 g.beginPath();g.ellipse(3.5,-46,3.4,blink?.6:3.8,0,0,7);g.fill();
 g.beginPath();g.ellipse(-3.5,-46,3.4,blink?.6:3.8,0,0,7);g.fill();
 if(!blink){g.fillStyle='#4a2b18';
  g.beginPath();g.arc(4.3,-46,1.8,0,7);g.fill();g.beginPath();g.arc(-2.7,-46,1.8,0,7);g.fill()}
 g.fillStyle='rgba(255,120,160,.5)';
 g.beginPath();g.arc(6.5,-42,1.8,0,7);g.fill();g.beginPath();g.arc(-6.5,-42,1.8,0,7);g.fill();
 g.strokeStyle='#c2405e';g.lineWidth=1.4;
 g.beginPath();g.arc(0,-41.5,2.6,.2,Math.PI-.2);g.stroke();
 if(RT.powers.shield){g.strokeStyle='rgba(77,201,255,.75)';g.lineWidth=2.5;
  g.beginPath();g.arc(0,-30,40+Math.sin(RT.time*.15)*3,0,7);g.stroke()}
 g.restore()}

function drawBoss(){
 if(!RT.boss||RT.boss.dead)return;const b=RT.boss;
 cx.save();cx.translate(b.x+b.w/2,b.y+b.h/2);
 const flash=b.flash>0&&Math.floor(RT.time/3)%2===0;
 cx.shadowColor='#b967ff';cx.shadowBlur=20;
 cx.fillStyle=flash?'#fff':'#5a2a9e';rr(-b.w/2,-b.h/2,b.w,b.h,18);cx.fill();
 cx.fillStyle=flash?'#fff':'#7a3cff';rr(-b.w/2+8,-b.h/2+8,b.w-16,b.h-16,14);cx.fill();
 cx.fillStyle='#FFD76A';
 cx.beginPath();cx.moveTo(-24,-b.h/2);cx.lineTo(-16,-b.h/2-16);cx.lineTo(-8,-b.h/2);
 cx.lineTo(0,-b.h/2-18);cx.lineTo(8,-b.h/2);cx.lineTo(16,-b.h/2-16);cx.lineTo(24,-b.h/2);cx.closePath();cx.fill();
 const ed=b.dir*4;
 cx.fillStyle='#fff';
 cx.beginPath();cx.arc(-16+ed,-b.h/6,10,0,7);cx.fill();
 cx.beginPath();cx.arc(16+ed,-b.h/6,10,0,7);cx.fill();
 cx.fillStyle='#ff2e88';
 cx.beginPath();cx.arc(-16+ed+b.dir*3,-b.h/6,4.5,0,7);cx.fill();
 cx.beginPath();cx.arc(16+ed+b.dir*3,-b.h/6,4.5,0,7);cx.fill();
 cx.strokeStyle='#2a1050';cx.lineWidth=4;
 cx.beginPath();cx.arc(0,b.h/6,14,.2,Math.PI-.2);cx.stroke();
 cx.restore();
 const bw=120,bx=b.x+b.w/2-bw/2,by=b.y-26;
 cx.fillStyle='rgba(0,0,0,.5)';rr(bx,by,bw,12,6);cx.fill();
 cx.fillStyle='#ff2e88';rr(bx+2,by+2,(bw-4)*(b.hp/b.maxhp),8,4);cx.fill()}

export function draw(){
 const theme=RT.theme;
 drawBG();
 cx.save();
 const sh=RT.shake>0?RT.shake:0;
 cx.translate(-RT.cam.x+(Math.random()-.5)*sh,-RT.cam.y+(Math.random()-.5)*sh);
 const c0=Math.max(0,Math.floor(RT.cam.x/TILE)),c1=Math.min(RT.cols,Math.ceil((RT.cam.x+W)/TILE));
 const r0=Math.max(0,Math.floor(RT.cam.y/TILE)),r1=Math.min(RT.rows,Math.ceil((RT.cam.y+H)/TILE));
 for(let r=r0;r<r1;r++)for(let c=c0;c<c1;c++){
  if(RT.levelMap[r][c]!==1)continue;
  const x=c*TILE,y=r*TILE,top=(r>0&&RT.levelMap[r-1][c]!==1);
  cx.fillStyle=hexA(theme.tile,1);cx.fillRect(x,y,TILE,TILE);
  cx.fillStyle=hexA(theme.tileTop,.16);cx.fillRect(x+2,y+2,TILE-4,TILE-4);
  if(top){cx.fillStyle=theme.tileTop;cx.fillRect(x,y,TILE,4);
   cx.fillStyle=hexA(theme.tileTop,.25);cx.fillRect(x,y+4,TILE,6)}}
 RT.gates.forEach(g=>{
  const x=g.col*TILE,gy=g.row*TILE;
  if(g.open){if(g.anim>0){cx.globalAlpha=g.anim/30;cx.fillStyle=theme.accent;cx.fillRect(x,gy-TILE,TILE,TILE*2);cx.globalAlpha=1}return}
  const grd=cx.createLinearGradient(0,0,0,gy+TILE);
  grd.addColorStop(0,hexA(theme.accent,0));grd.addColorStop(1,hexA(theme.accent,.35));
  cx.fillStyle=grd;cx.fillRect(x+8,0,TILE-16,gy+TILE);
  const pulse=.6+.4*Math.sin(RT.time*.1);
  cx.shadowColor=theme.accent;cx.shadowBlur=16*pulse;
  cx.fillStyle=hexA(theme.tile,1);rr(x+4,gy-TILE*1.2,TILE-8,TILE*2.2,12);cx.fill();
  cx.strokeStyle=theme.accent;cx.lineWidth=3;rr(x+4,gy-TILE*1.2,TILE-8,TILE*2.2,12);cx.stroke();
  cx.shadowBlur=0;
  cx.fillStyle=theme.accent;cx.font='900 22px Heebo,system-ui';cx.textAlign='center';
  cx.fillText('🔒',x+TILE/2,gy-8);
  cx.fillText('✦'.repeat(g.num),x+TILE/2,gy+22)});
 RT.ents.forEach(e=>{
  if(e.t==='coin'&&!e.got){const bob=Math.sin(e.ph)*3,sc2=.7+.3*Math.abs(Math.cos(e.ph*.7));
   cx.save();cx.translate(e.x+12,e.y+12+bob);cx.scale(sc2,1);
   cx.shadowColor='#FFD76A';cx.shadowBlur=12;cx.fillStyle='#FFD76A';
   cx.beginPath();cx.moveTo(0,-9);cx.lineTo(8,0);cx.lineTo(0,9);cx.lineTo(-8,0);cx.closePath();cx.fill();
   cx.fillStyle='#fff';cx.globalAlpha=.85;
   cx.beginPath();cx.moveTo(0,-4);cx.lineTo(3.5,0);cx.lineTo(0,4);cx.lineTo(-3.5,0);cx.closePath();cx.fill();cx.restore()}
  if(e.t==='heart'&&!e.got){const bob=Math.sin(e.ph)*3;
   cx.save();cx.translate(e.x+14,e.y+14+bob);cx.shadowColor='#ff2e88';cx.shadowBlur=12;cx.fillStyle='#ff2e88';
   cx.beginPath();cx.moveTo(0,8);cx.bezierCurveTo(-12,-2,-8,-12,0,-5);cx.bezierCurveTo(8,-12,12,-2,0,8);cx.fill();cx.restore()}
  if(e.t==='spike'){cx.fillStyle='#ff2e88';cx.shadowColor='#ff2e88';cx.shadowBlur=8;
   for(let i=0;i<3;i++){cx.beginPath();cx.moveTo(e.x+i*(TILE/3),e.y+e.h);
    cx.lineTo(e.x+i*(TILE/3)+TILE/6,e.y);cx.lineTo(e.x+(i+1)*(TILE/3),e.y+e.h);cx.fill()}cx.shadowBlur=0}
  if(e.t==='enemy'&&!e.dead){
   if(e.kind==='walk'){const hop=Math.abs(Math.sin(e.ph))*4;
    cx.save();cx.translate(e.x+e.w/2,e.y+e.h/2-hop);cx.shadowColor='#b967ff';cx.shadowBlur=10;
    cx.fillStyle='#7a3cff';cx.beginPath();cx.arc(0,0,e.w/2,0,7);cx.fill();
    cx.fillStyle='#b967ff';cx.beginPath();cx.arc(0,0,e.w/2-6,0,7);cx.fill();
    cx.fillStyle='#fff';cx.beginPath();cx.arc(e.vx>0?6:-6,-4,5,0,7);cx.fill();
    cx.fillStyle='#20242c';cx.beginPath();cx.arc(e.vx>0?7.5:-7.5,-4,2.4,0,7);cx.fill();cx.restore()}
   else{cx.save();cx.translate(e.x+e.w/2,e.y+e.h/2);cx.shadowColor='#ff2e88';cx.shadowBlur=12;
    const flap=Math.sin(e.ph*3)*8;
    cx.fillStyle='#ff2e88';
    cx.beginPath();cx.ellipse(-14,flap*.4,10,5,-.4,0,7);cx.fill();
    cx.beginPath();cx.ellipse(14,flap*.4,10,5,.4,0,7);cx.fill();
    cx.fillStyle='#ff5ea8';cx.beginPath();cx.arc(0,0,11,0,7);cx.fill();
    cx.fillStyle='#fff';cx.beginPath();cx.arc(-4,-2,3,0,7);cx.fill();cx.beginPath();cx.arc(4,-2,3,0,7);cx.fill();
    cx.fillStyle='#20242c';cx.beginPath();cx.arc(-4,-2,1.4,0,7);cx.fill();cx.beginPath();cx.arc(4,-2,1.4,0,7);cx.fill();cx.restore()}}
  if(e.t==='move'){cx.save();cx.shadowColor=theme.accent;cx.shadowBlur=10;
   cx.fillStyle=theme.tile;cx.fillRect(e.x,e.y,e.w,e.h);
   cx.fillStyle=theme.tileTop;cx.fillRect(e.x,e.y,e.w,4);cx.restore()}
  if(e.t==='flag'){cx.save();cx.shadowColor='#FFD76A';cx.shadowBlur=14;
   cx.strokeStyle='#FFD76A';cx.lineWidth=4;cx.beginPath();cx.moveTo(e.x+8,e.y);cx.lineTo(e.x+8,e.y+e.h);cx.stroke();
   const wav=Math.sin(RT.time*.15)*4;cx.fillStyle='#FFD76A';
   cx.beginPath();cx.moveTo(e.x+8,e.y+4);cx.lineTo(e.x+40,e.y+12+wav);cx.lineTo(e.x+8,e.y+24);cx.closePath();cx.fill();cx.restore()}});
 drawBoss();
 if(!(RT.invuln>0&&Math.floor(RT.time/4)%2===0))drawLenny(cx,RT.player.x-7,RT.player.y+RT.player.h,44,RT.player);
 RT.parts.forEach(q=>{cx.globalAlpha=q.life/q.max;cx.fillStyle=q.c;cx.beginPath();cx.arc(q.x,q.y,q.r,0,7);cx.fill()});
 RT.texts.forEach(t=>{cx.globalAlpha=t.life/t.max;cx.fillStyle=t.c;cx.font='800 18px Heebo,system-ui';cx.textAlign='center';
  cx.shadowColor=t.c;cx.shadowBlur=8;cx.fillText(t.txt,t.x,t.y);cx.shadowBlur=0});
 cx.globalAlpha=1;cx.restore();
 if(RT.hintTimer>0){RT.hintTimer--;cx.globalAlpha=Math.min(1,RT.hintTimer/40);
  cx.font='700 17px Heebo,system-ui';const tw=cx.measureText(RT.curHint).width;
  cx.fillStyle='rgba(10,5,24,.82)';rr(W/2-tw/2-20,H-66,tw+40,38,19);cx.fill();
  cx.fillStyle=RT.theme.accent;cx.textAlign='center';cx.fillText(RT.curHint,W/2,H-41);cx.globalAlpha=1}
 if(RT.combo>1&&RT.comboT>0){cx.textAlign='center';cx.fillStyle='#ff2e88';
  cx.font='900 '+(20+RT.combo*2)+'px Heebo,system-ui';cx.shadowColor='#ff2e88';cx.shadowBlur=12;
  cx.globalAlpha=Math.min(1,RT.comboT/30);cx.fillText('קומבו x'+RT.combo,W/2,110);cx.shadowBlur=0;cx.globalAlpha=1}}
