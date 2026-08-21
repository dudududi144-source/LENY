/* ui/hud.js — ממשק במשחק (ניקוד, חיים, כוחות, שם עולם) */
import {RT} from '../game/runtime.js';
import {WORLDS} from '../game/levels.js';

export function hudSync(){
 document.getElementById('hudScore').textContent=RT.score;
 document.getElementById('hudCoins').textContent=RT.coins;
 document.getElementById('hudHearts').textContent='❤️'.repeat(Math.max(0,RT.lives))||'💔';
 document.getElementById('hudWorld').textContent=WORLDS[RT.level].icon+' '+WORLDS[RT.level].name;
 let pw='';
 if(RT.powers.shield)pw+='🛡️';
 if(RT.powers.magnet>0)pw+='🧲';
 if(RT.powers.star>0)pw+='⭐'+Math.ceil(RT.powers.star/60);
 const elp=document.getElementById('hudPowers');
 elp.textContent=pw;elp.style.display=pw?'':'none'}
