/* ui/fx.js — טוסטים וקונפטי */
import {el,rnd} from '../core/utils.js';

let toastT=null;
export function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');
 clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2400)}

export function confetti(){const c=document.getElementById('confetti');c.innerHTML='';
 const cols=['#F2549A','#7c4dff','#FFD76A','#7dffb8','#4dc9ff','#fff'];
 for(let i=0;i<70;i++){const p=el('span','cf');p.style.left=Math.random()*100+'vw';
  p.style.width=6+rnd(9)+'px';p.style.height=10+rnd(11)+'px';
  p.style.background=cols[i%cols.length];
  p.style.animationDuration=2.3+Math.random()*2.4+'s';
  p.style.animationDelay=Math.random()*.9+'s';c.appendChild(p)}}
