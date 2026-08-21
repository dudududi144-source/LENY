/* ui/input.js — מקלדת + כפתורי מגע */
import {RT,keys} from '../game/runtime.js';
import {togglePause} from '../engine/engine.js';

function kd(e){const k=e.key.toLowerCase();
 if(['arrowleft','a'].includes(k))keys.l=true;
 if(['arrowright','d'].includes(k))keys.r=true;
 if([' ','arrowup','w'].includes(k)){keys.j=true;
  if(RT.screen==='play'&&!RT.paused&&!RT.dying&&RT.player)RT.player.jbuf=8;
  e.preventDefault()}
 if(k==='p'&&RT.screen==='play')togglePause()}

function ku(e){const k=e.key.toLowerCase();
 if(['arrowleft','a'].includes(k))keys.l=false;
 if(['arrowright','d'].includes(k))keys.r=false;
 if([' ','arrowup','w'].includes(k)){keys.j=false;
  if(RT.player&&RT.player.vy<0)RT.player.vy*=.45}}

function bindT(id,dn,up){const e2=document.querySelector(id);
 e2.addEventListener('touchstart',ev=>{ev.preventDefault();dn()},{passive:false});
 e2.addEventListener('touchend',ev=>{ev.preventDefault();up&&up()},{passive:false})}

export function initInput(){
 addEventListener('keydown',kd);addEventListener('keyup',ku);
 bindT('#tl',()=>keys.l=true,()=>keys.l=false);
 bindT('#tr',()=>keys.r=true,()=>keys.r=false);
 bindT('#tj',()=>{keys.j=true;if(RT.screen==='play'&&!RT.paused&&!RT.dying&&RT.player)RT.player.jbuf=8},
  ()=>{keys.j=false;if(RT.player&&RT.player.vy<0)RT.player.vy*=.45})}
