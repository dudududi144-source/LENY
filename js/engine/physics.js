/* engine/physics.js — קבועי פיזיקה, התנגשויות, שאילתות מוצקות */
import {RT} from '../game/runtime.js';
import {TILE} from '../game/levels.js';

export const GRAV=.62,MOVE=.9,MAXV=5.2,FRIC=.78,JUMP=-12.6;

/* שער סגור = עמודה מוצקה לכל הגובה (אי אפשר לעקוף בקפיצה) */
export function gateClosedCol(c,r){for(const g of RT.gates){if(!g.open&&g.col===c&&r<=g.row)return true}return false}

export function solidAt(px,py){const c=Math.floor(px/TILE),r=Math.floor(py/TILE);
 if(r<0||r>=RT.rows||c<0||c>=RT.cols)return false;
 if(gateClosedCol(c,r))return true;
 return RT.levelMap[r][c]===1}

/* התנגשות ציר-מופרד: קודם X ואז Y, בשתי נקודות בדיקה לכל ציר */
export function rectVsMap(o){
 o.x+=o.vx;
 if(o.vx>0){if(solidAt(o.x+o.w,o.y+4)||solidAt(o.x+o.w,o.y+o.h-4)){o.x=Math.floor((o.x+o.w)/TILE)*TILE-o.w-.01;o.vx=0}}
 else if(o.vx<0){if(solidAt(o.x,o.y+4)||solidAt(o.x,o.y+o.h-4)){o.x=(Math.floor(o.x/TILE)+1)*TILE+.01;o.vx=0}}
 o.y+=o.vy;o.onGround=false;
 if(o.vy>0){if(solidAt(o.x+4,o.y+o.h)||solidAt(o.x+o.w-4,o.y+o.h)){o.y=Math.floor((o.y+o.h)/TILE)*TILE-o.h-.01;o.vy=0;o.onGround=true}}
 else if(o.vy<0){if(solidAt(o.x+4,o.y)||solidAt(o.x+o.w-4,o.y)){o.y=(Math.floor(o.y/TILE)+1)*TILE+.01;o.vy=0}}}

export function aabb(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
