/* ui/hud.js — ממשק במשחק (ניקוד, חיים, כוחות, שם עולם)
   מצב חוקר (3-5): ללא מספרים — מד יהלומים ויזואלי במקום ניקוד/לבבות */
import {RT} from '../game/runtime.js';
import {WORLDS} from '../game/levels.js';
import {powerIcon} from './icons.js';
import {S} from '../core/state.js';

export function hudSync(){
 const ex=S.mode==='חוקר';
 const chipScore=document.getElementById('chipScore');
 const chipCoins=document.getElementById('chipCoins');
 if(chipScore)chipScore.style.display=ex?'none':'';
 if(chipCoins)chipCoins.style.display=ex?'none':'';
 document.getElementById('hudScore').textContent=RT.score;
 document.getElementById('hudCoins').textContent=RT.coins;
 document.getElementById('hudHearts').textContent=ex
  ?('💎 '+RT.levelCoins+'/'+RT.levelCoinsTotal)
  :('❤️'.repeat(Math.max(0,RT.lives))||'💔');
 document.getElementById('hudWorld').textContent=WORLDS[RT.level].icon+' '+WORLDS[RT.level].name;
 let pw=RT.review?'🌸 ':'';
 if(RT.powers.shield)pw+='<span class="pw">'+powerIcon('shield')+'</span>';
 if(RT.powers.magnet>0)pw+='<span class="pw">'+powerIcon('magnet')+'</span>';
 if(RT.powers.star>0)pw+='<span class="pw">'+powerIcon('star')+'</span>'+Math.ceil(RT.powers.star/60);
 const elp=document.getElementById('hudPowers');
 elp.innerHTML=pw;elp.style.display=pw?'':'none'}
