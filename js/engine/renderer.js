/* engine/renderer.js — רינדור Canvas (שדרוג ויזואלי מאסיבי — M2)
   שכבות: רקע מדורג → כוכבים → רכסי פרלקס → דקורציית עולם → חלקיקי אווירה
          → אריחים (ניצוצות) → ישויות → לני → בוס → אפקטי מסך */
import {RT} from '../game/runtime.js';
import {S} from '../core/state.js';
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

/* ── דקורציית עולם (פרלקס אמצעי): אובייקטי נושא לכל תמה ── */
function themeDeco(type){
 const z=.55,t=RT.time,ac=RT.theme.accent;
 const count=RT.perf===0?8:18; /* מצב חסכון: פחות אובייקטים */
 for(let i=0;i<count;i++){
  const wx=i*263+((i*i*53)%140);
  const sx=((wx-RT.cam.x*z)%(W+240)+(W+240))%(W+240)-120;
  const sway=Math.sin(t*.03+i)*3;
  const hgt=26+((i*37)%34);
  cx.save();cx.globalAlpha=.4;
  if(type==='meadow'){
   cx.strokeStyle=hexA(ac,.8);cx.lineWidth=3;
   cx.beginPath();cx.moveTo(sx,H-52);cx.quadraticCurveTo(sx+sway,H-70,sx+sway,H-84);cx.stroke();
   cx.fillStyle=i%3===0?'#ff8bd4':hexA(ac,1);
   for(let p2=0;p2<5;p2++){const a=p2/5*Math.PI*2;
    cx.beginPath();cx.arc(sx+sway+Math.cos(a)*7,H-88+Math.sin(a)*7,5,0,7);cx.fill();}
   cx.fillStyle='#FFD76A';cx.beginPath();cx.arc(sx+sway,H-88,4,0,7);cx.fill();}
  else if(type==='crystal'){
   cx.fillStyle=hexA(ac,.55);
   cx.beginPath();cx.moveTo(sx-14,H-50);cx.lineTo(sx,H-50-hgt);cx.lineTo(sx+14,H-50);cx.closePath();cx.fill();
   cx.fillStyle=hexA('#ffffff',.25);
   cx.beginPath();cx.moveTo(sx-4,H-50);cx.lineTo(sx,H-50-hgt);cx.lineTo(sx+3,H-50);cx.closePath();cx.fill();}
  else if(type==='flame'){
   cx.fillStyle=hexA('#2a0a0e',.8);
   cx.beginPath();cx.ellipse(sx,H-50,30,14,0,Math.PI,0);cx.fill();
   const fl=Math.sin(t*.2+i)*3;
   cx.fillStyle=hexA('#ff7a3c',.6);
   cx.beginPath();cx.arc(sx,H-64-hgt*.3+fl,5+((i*13)%4),0,7);cx.fill();}
  else if(type==='notes'){
   cx.fillStyle=hexA(ac,.5);cx.font='700 '+(22+hgt*.3)+'px system-ui';cx.textAlign='center';
   cx.fillText(i%2===0?'♪':'♫',sx+sway,H-70-hgt*.4);}
  else if(type==='castle'){
   cx.fillStyle=hexA('#1a0822',.75);
   cx.fillRect(sx-20,H-60-hgt,40,hgt+10);
   for(let c2=0;c2<3;c2++)cx.fillRect(sx-20+c2*14,H-66-hgt,10,8);
   cx.fillStyle=hexA('#FFD76A',.5+Math.sin(t*.05+i)*.3);
   cx.fillRect(sx-5,H-46-hgt*.5,10,12);}
  else if(type==='numbers'){
   cx.fillStyle=hexA(ac,.16);
   cx.font='900 '+(30+hgt*.6)+'px Heebo,system-ui';cx.textAlign='center';
   cx.fillText(String(1+((i*7)%9)),sx,H-70-hgt*.5+sway);}
  else if(type==='flowers'){
   cx.strokeStyle=hexA('#7dff5e',.7);cx.lineWidth=3;
   cx.beginPath();cx.moveTo(sx,H-50);cx.quadraticCurveTo(sx+sway,H-66,sx+sway,H-80);cx.stroke();
   const col=['#ff8bd4','#ffd23e','#b967ff','#4dc9ff'][i%4];
   cx.fillStyle=col;
   for(let p2=0;p2<6;p2++){const a=p2/6*Math.PI*2+t*.01;
    cx.beginPath();cx.arc(sx+sway+Math.cos(a)*8,H-84+Math.sin(a)*8,6,0,7);cx.fill();}
   cx.fillStyle='#fff';cx.beginPath();cx.arc(sx+sway,H-84,4,0,7);cx.fill();}
  else if(type==='ice'){
   cx.fillStyle=hexA('#a0f0ff',.35);
   for(let k=0;k<3;k++){const ix=sx+k*22-22;
    cx.beginPath();cx.moveTo(ix-8,0);cx.lineTo(ix+8,0);cx.lineTo(ix,30+((i*17+k*29)%36));cx.closePath();cx.fill();}
   cx.fillStyle=hexA('#ffffff',.5);
   cx.beginPath();cx.ellipse(sx,H-52,34,12,0,Math.PI,0);cx.fill();}
  else if(type==='clocks'){
   cx.strokeStyle=hexA(ac,.4);cx.lineWidth=3;
   cx.beginPath();cx.arc(sx,H-90-hgt*.4,20,0,7);cx.stroke();
   const a1=t*.01+i,a2=t*.08+i;
   cx.beginPath();cx.moveTo(sx,H-90-hgt*.4);cx.lineTo(sx+Math.cos(a1)*12,H-90-hgt*.4+Math.sin(a1)*12);cx.stroke();
   cx.beginPath();cx.moveTo(sx,H-90-hgt*.4);cx.lineTo(sx+Math.cos(a2)*16,H-90-hgt*.4+Math.sin(a2)*16);cx.stroke();}
  else if(type==='fireworks'){
   const ph=(t*.02+i)%3,bx=sx,by=H*.25+((i*67)%140);
   if(ph<1){cx.strokeStyle=hexA(['#FFD76A','#ff2e88','#7dffb8'][i%3],1-ph);cx.lineWidth=2;
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2;
     cx.beginPath();cx.moveTo(bx+Math.cos(a)*ph*26,by+Math.sin(a)*ph*26);
     cx.lineTo(bx+Math.cos(a)*(ph*26+8),by+Math.sin(a)*(ph*26+8));cx.stroke();}}}
  cx.restore();}}

/* ── חלקיקי אווירה (ללא מצב — מבוסס זמן) ── */
function ambient(type){
 const t=RT.time,ac=RT.theme.accent;
 for(let i=0;i<14;i++){
  const seed=i*137.5,spd=.25+((i*29)%10)/16;
  const x=((seed-RT.cam.x*.35+t*spd)%(W+80)+(W+80))%(W+80)-40;
  cx.save();
  if(type==='meadow'||type==='flowers'){
   const y=((seed*3+t*(.5+spd))%(H+40))-20;
   cx.globalAlpha=.5;cx.fillStyle=i%2===0?'#ff8bd4':hexA(ac,1);
   cx.beginPath();cx.arc(x+Math.sin(t*.02+i)*8,y,2.4,0,7);cx.fill();}
  else if(type==='crystal'||type==='fireworks'){
   const y=H-((seed*2+t*(.6+spd))%(H+40));
   cx.globalAlpha=.5+.3*Math.sin(t*.1+i);cx.fillStyle=type==='fireworks'?['#FFD76A','#ff2e88','#7dffb8'][i%3]:hexA(ac,1);
   cx.beginPath();cx.arc(x,y,2,0,7);cx.fill();}
  else if(type==='flame'){
   const y=H-((seed+t*(1+spd))%(H+60));
   cx.globalAlpha=.45;cx.fillStyle='#ff9a5c';
   cx.beginPath();cx.arc(x+Math.sin(t*.04+i)*6,y,2.6,0,7);cx.fill();}
  else if(type==='notes'){
   const y=H-((seed*2+t*(.4+spd))%(H+60));
   cx.globalAlpha=.4;cx.fillStyle=hexA(ac,1);cx.font='16px system-ui';cx.textAlign='center';
   cx.fillText(i%2===0?'♪':'♬',x+Math.sin(t*.03+i)*10,y);}
  else if(type==='castle'){
   const y=((seed*2+t*.3)%(H+40))-20;
   cx.globalAlpha=.3;cx.fillStyle='#b967ff';
   cx.beginPath();cx.arc(x,y,2,0,7);cx.fill();}
  else if(type==='numbers'){
   const y=H-((seed*3+t*(.3+spd))%(H+60));
   cx.globalAlpha=.14;cx.fillStyle=hexA(ac,1);cx.font='700 18px Heebo,system-ui';cx.textAlign='center';
   cx.fillText(String(1+((i*3)%9)),x,y);}
  else if(type==='ice'){
   const y=((seed*2+t*(.7+spd))%(H+30))-15;
   cx.globalAlpha=.7;cx.fillStyle='#fff';
   cx.beginPath();cx.arc(x+Math.sin(t*.02+i)*12,y,2,0,7);cx.fill();}
  else if(type==='clocks'){
   const y=((seed*2+t*.25)%(H+40))-20;
   cx.globalAlpha=.25;cx.strokeStyle=hexA(ac,1);cx.lineWidth=1.5;
   cx.beginPath();cx.arc(x,y,5,0,7);cx.moveTo(x,y);cx.lineTo(x+3,y-2);cx.stroke();}
  cx.restore();}}

function drawBG(){
 const theme=RT.theme;
 const g=cx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,theme.skyT);g.addColorStop(.55,theme.skyM);g.addColorStop(1,theme.skyB);
 cx.fillStyle=g;cx.fillRect(0,0,W,H);
 starsBg.forEach(s=>{const sx=((s.x-RT.cam.x*s.z)%(W+100)+W+100)%(W+100)-50,sy=((s.y-RT.cam.y*s.z*.5)%(H+100)+H+100)%(H+100)-50;
  const tw=.5+.5*Math.sin(RT.time*.05+s.p);cx.globalAlpha=.3+.6*tw*s.z;cx.fillStyle=theme.accent;
  cx.beginPath();cx.arc(sx,sy,s.r,0,7);cx.fill()});
 cx.globalAlpha=1;
 drawRange(RT.cam.x*.15,H*.62,140,theme.far);
 drawRange(RT.cam.x*.3,H*.72,110,theme.mid);
 themeDeco(theme.deco||'meadow');
 if(RT.perf!==0)ambient(theme.deco||'meadow');}

function drawRange(off,base,amp,col){
 cx.fillStyle=col;cx.beginPath();cx.moveTo(0,H);
 for(let x=0;x<=W;x+=8){const wx=x+off;
  cx.lineTo(x,base+Math.sin(wx*.008)*amp*.5+Math.sin(wx*.02)*amp*.3+Math.sin(wx*.005)*amp*.4)}
 cx.lineTo(W,H);cx.closePath();cx.fill()}

const CC={hair:'#6B4A33',skin:'#F6C39A',dress:'#F7A8C4'};
/* מטמון תמונת האווטר (נטענת פעם אחת מ-dataURL) */
let avatarImg=null,avatarSrc=null;
function getAvatar(){
 if(S.avatar&&avatarSrc!==S.avatar){avatarImg=new Image();avatarImg.src=S.avatar;avatarSrc=S.avatar;}
 return(S.avatar&&avatarImg&&avatarImg.complete&&avatarImg.naturalWidth>0)?avatarImg:null;}
function drawLenny(g,x,y,s,p){
 g.save();g.translate(x+s/2,y-5); /* תיקון יישור: הנעליים נוחתות בדיוק על קו האריח */
 if(RT.dying>0)g.rotate(RT.dying*.15);
 g.scale(p.face*s/44,s/44*(1+(p.squash||0)*.4));
 const run=p.runPhase,air=!p.onGround;
 const starOn=RT.powers.star>0;
 if(starOn){g.shadowColor='#FFD76A';g.shadowBlur=18}
 const legA=Math.sin(run)*7,legB=Math.sin(run+Math.PI)*7;
 const bob=air?0:Math.abs(Math.sin(run))*1.5;
 const flare=Math.min(3,Math.abs(p.vx||0)*.5)+(air?2:0);
 /* רגליים */
 g.strokeStyle=CC.skin;g.lineWidth=6;g.lineCap='round';
 g.beginPath();g.moveTo(-6,-12);g.quadraticCurveTo(-7+legA*.2,-6,(air?-10:-6+legA*.6),(air?-3:1));g.stroke();
 g.beginPath();g.moveTo(6,-12);g.quadraticCurveTo(7+legB*.2,-6,(air?10:6+legB*.6),(air?-5:1));g.stroke();
 g.fillStyle='#F2549A';
 g.beginPath();g.ellipse((air?-10:-6+legA*.6)+2,(air?-2:2),6,3.5,0,0,7);g.fill();
 g.beginPath();g.ellipse((air?10:6+legB*.6)+2,(air?-4:2),6,3.5,0,0,7);g.fill();
 /* שמלה עם התנופפות */
 g.fillStyle=CC.dress;
 g.beginPath();g.moveTo(-11,-14-bob);g.lineTo(11,-14-bob);g.lineTo(16+flare,-30-bob);g.lineTo(-16-flare,-30-bob);g.closePath();g.fill();
 g.fillStyle='#ffd7e6';g.globalAlpha=.6;
 g.beginPath();g.moveTo(-13-flare,-16-bob);g.lineTo(13+flare,-16-bob);g.lineTo(14+flare,-12-bob);g.lineTo(-14-flare,-12-bob);g.closePath();g.fill();g.globalAlpha=1;
 g.beginPath();g.moveTo(-8,-30-bob);g.lineTo(8,-30-bob);g.lineTo(7,-38-bob);g.lineTo(-7,-38-bob);g.closePath();g.fill();
 /* ידיים מתנועעות */
 g.strokeStyle=CC.skin;g.lineWidth=5;
 const a1=Math.sin(run+Math.PI)*6,a2=Math.sin(run)*6;
 g.beginPath();g.moveTo(-9,-36-bob);g.lineTo(-14+(air?-3:a1*.5),-26+(air?-9:0)-bob);g.stroke();
 g.beginPath();g.moveTo(9,-36-bob);g.lineTo(14+(air?3:a2*.5),-26+(air?-11:0)-bob);g.stroke();
 /* שיער מאחור עם תנועה */
 const hb=Math.sin(run*.9)*2+(air?-2:0);
 g.fillStyle=CC.hair;
 g.beginPath();g.moveTo(-13,-46);g.quadraticCurveTo(-21,-30+hb,-15,-16+hb);g.quadraticCurveTo(-11,-26,-12,-34);g.closePath();g.fill();
 g.beginPath();g.moveTo(13,-46);g.quadraticCurveTo(21,-30+hb,15,-16+hb);g.quadraticCurveTo(11,-26,12,-34);g.closePath();g.fill();
 /* ראש — האווטר הוא התמונה האמיתית של הילד (אם נבחרה), אחרת פנים מצוירות */
 const av=getAvatar();
 if(av){
  g.save();g.beginPath();g.arc(0,-46-bob,13,0,7);g.clip();
  g.drawImage(av,-13,-59-bob,26,26);
  g.restore();
  g.strokeStyle='#fff';g.lineWidth=2.2;
  g.beginPath();g.arc(0,-46-bob,13,0,7);g.stroke();
  g.strokeStyle='rgba(255,215,106,.85)';g.lineWidth=1.2;
  g.beginPath();g.arc(0,-46-bob,15,0,7);g.stroke();
 }else{
 g.fillStyle=CC.skin;g.beginPath();g.arc(0,-46-bob,11,0,7);g.fill();
 g.fillStyle=CC.hair;g.beginPath();g.arc(0,-48-bob,11.5,Math.PI*.95,Math.PI*2.05);g.fill();
 g.beginPath();g.moveTo(-11,-48-bob);g.quadraticCurveTo(-4,-42-bob,-9,-40-bob);g.quadraticCurveTo(-12,-44-bob,-11,-48-bob);g.closePath();g.fill();
 g.beginPath();g.moveTo(11,-48-bob);g.quadraticCurveTo(4,-42-bob,9,-40-bob);g.quadraticCurveTo(12,-44-bob,11,-48-bob);g.closePath();g.fill();
 /* פרח בשיער */
 g.fillStyle='#F26B4E';
 for(let k=0;k<5;k++){const a=k/5*Math.PI*2;
  g.beginPath();g.arc(-11+Math.cos(a)*3.4,-55-bob+Math.sin(a)*3.4,2.2,0,7);g.fill();}
 g.fillStyle='#FFD76A';g.beginPath();g.arc(-11,-55-bob,1.8,0,7);g.fill();
 /* עיניים עם מבט לכיוון התנועה + מצמוץ */
 const blink=p.blink>0;
 g.fillStyle='#fff';
 g.beginPath();g.ellipse(3.5,-46-bob,3.4,blink?.6:3.8,0,0,7);g.fill();
 g.beginPath();g.ellipse(-3.5,-46-bob,3.4,blink?.6:3.8,0,0,7);g.fill();
 if(!blink){g.fillStyle='#4a2b18';
  g.beginPath();g.arc(4.6,-46-bob,1.8,0,7);g.fill();
  g.beginPath();g.arc(-2.4,-46-bob,1.8,0,7);g.fill();
  g.fillStyle='#fff';
  g.beginPath();g.arc(5.1,-46.6-bob,.6,0,7);g.fill();
  g.beginPath();g.arc(-1.9,-46.6-bob,.6,0,7);g.fill();}
 g.fillStyle='rgba(255,120,160,.5)';
 g.beginPath();g.arc(6.5,-42-bob,1.8,0,7);g.fill();
 g.beginPath();g.arc(-6.5,-42-bob,1.8,0,7);g.fill();
 g.strokeStyle='#c2405e';g.lineWidth=1.4;
 g.beginPath();g.arc(0,-41.5-bob,2.6,.2,Math.PI-.2);g.stroke();
 }
 /* הילת כוכב */
 if(starOn){g.strokeStyle='rgba(255,210,62,.8)';g.lineWidth=2;
  for(let k=0;k<3;k++){const a=RT.time*.12+k*2.1;
   g.beginPath();g.arc(Math.cos(a)*26,-32+Math.sin(a)*22,2.4,0,7);g.stroke();}}
 if(RT.powers.shield){g.strokeStyle='rgba(77,201,255,.75)';g.lineWidth=2.5;
  g.beginPath();g.arc(0,-30,40+Math.sin(RT.time*.15)*3,0,7);g.stroke()}
 g.restore()}

function drawBoss(){
 if(!RT.boss||RT.boss.dead)return;const b=RT.boss;
 cx.save();cx.translate(b.x+b.w/2,b.y+b.h/2+Math.sin(RT.time*.08)*3);
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
  if(top){
   const gl=cx.createLinearGradient(0,y,0,y+12);
   gl.addColorStop(0,hexA(theme.tileTop,.95));gl.addColorStop(1,hexA(theme.tileTop,0));
   cx.fillStyle=theme.tileTop;cx.fillRect(x,y,TILE,4);
   cx.fillStyle=gl;cx.fillRect(x,y+4,TILE,8);
   if((c*7+Math.floor(RT.time/24))%13===0){
    const p2=(RT.time%48)/48;
    cx.globalAlpha=Math.sin(p2*Math.PI)*.9;cx.fillStyle='#fff';
    cx.beginPath();cx.arc(x+((c*29)%36)+6,y+2,1.8,0,7);cx.fill();cx.globalAlpha=1;}}}
 RT.gates.forEach(g2=>{
  const x=g2.col*TILE,gy=g2.row*TILE;
  if(g2.open){
   if(g2.anim>0){
    cx.globalAlpha=g2.anim/30;cx.fillStyle=theme.accent;cx.fillRect(x,gy-TILE,TILE,TILE*2);
    cx.strokeStyle='#fff';cx.lineWidth=3;
    cx.beginPath();cx.arc(x+TILE/2,gy,(30-g2.anim)*5,0,7);cx.stroke();cx.globalAlpha=1;}
   return}
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
  cx.fillText('✦'.repeat(g2.num),x+TILE/2,gy+22)});
 RT.ents.forEach(e=>{
  if(e.t==='coin'&&!e.got){const bob=Math.sin(e.ph)*3,sc2=.7+.3*Math.abs(Math.cos(e.ph*.7));
   cx.save();cx.translate(e.x+12,e.y+12+bob);cx.scale(sc2,1);
   cx.shadowColor='#FFD76A';cx.shadowBlur=10+4*Math.sin(e.ph*2);cx.fillStyle='#FFD76A';
   cx.beginPath();cx.moveTo(0,-9);cx.lineTo(8,0);cx.lineTo(0,9);cx.lineTo(-8,0);cx.closePath();cx.fill();
   cx.fillStyle='#fff';cx.globalAlpha=.85;
   cx.beginPath();cx.moveTo(0,-4);cx.lineTo(3.5,0);cx.lineTo(0,4);cx.lineTo(-3.5,0);cx.closePath();cx.fill();cx.restore()}
  if(e.t==='heart'&&!e.got){const bob=Math.sin(e.ph)*3;
   cx.save();cx.translate(e.x+14,e.y+14+bob);cx.shadowColor='#ff2e88';cx.shadowBlur=12;cx.fillStyle='#ff2e88';
   cx.beginPath();cx.moveTo(0,8);cx.bezierCurveTo(-12,-2,-8,-12,0,-5);cx.bezierCurveTo(8,-12,12,-2,0,8);cx.fill();cx.restore()}
  if(e.t==='gift'&&!e.got){const bob=Math.sin(e.ph)*3;
   cx.save();cx.translate(e.x+16,e.y+16+bob);
   cx.shadowColor='#FFD76A';cx.shadowBlur=16;
   cx.fillStyle='#FFD76A';rr(-15,-15,30,30,7);cx.fill();
   cx.fillStyle='#ff2e88';cx.fillRect(-15,-3,30,6);cx.fillRect(-3,-15,6,30);
   cx.shadowBlur=0;cx.fillStyle='#fff';cx.font='900 17px Heebo,system-ui';cx.textAlign='center';
   cx.fillText('?',0,6);cx.restore()}
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
 if(RT.tut>0){const em=RT.tut===1?'👟':RT.tut===2?'⤒':'✨';
  cx.font='42px system-ui';cx.textAlign='center';
  cx.fillText(em,RT.player.x+15,RT.player.y-24+Math.sin(RT.time*.15)*7)}
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
  cx.globalAlpha=Math.min(1,RT.comboT/30);cx.fillText('קומבו x'+RT.combo,W/2,110);cx.shadowBlur=0;cx.globalAlpha=1}
 /* הבזק מסך (ג'וס): דועך בכל פריים */
 if(RT.flashA>0.01&&RT.flashC){cx.globalAlpha=RT.flashA;cx.fillStyle=RT.flashC;
  cx.fillRect(0,0,W,H);cx.globalAlpha=1;}
 RT.flashA*=.86;}
