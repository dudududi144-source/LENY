/* core/utils.js — כלים כלליים */
export const $=s=>document.querySelector(s);
export const $$=s=>[...document.querySelectorAll(s)];
export const el=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n};
export const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
export const rnd=n=>Math.floor(Math.random()*n);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let TLIST=[];
export const later=(fn,t)=>{const id=setTimeout(fn,t);TLIST.push(()=>clearTimeout(id));return id};
export const cleanT=()=>{TLIST.forEach(f=>f());TLIST=[]};
