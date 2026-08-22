/* core/state.js — מצב גלובלי + התמדה (localStorage) */
const KEY='leny-world-v1';
export function defState(){return{items:[],gates:{},stars:{},sound:true,night:false,diff:'רגיל',mode:'חוקר',tutorial:false,storySeen:false,timeLimit:0,avatar:'',garden:[],words:[],reviewQueue:[],skillModel:{},access:{speed:1,big:false,noFail:false},lang:'he',name:'',best:0}}
/* סניטציה: מצב שמור מושחת/ישן לא יכול לשבור את המשחק */
export function sanitize(d){
 if(!Array.isArray(d.items))d.items=[];
 d.items=d.items.filter(x=>Number.isInteger(x)&&x>=0&&x<=9);
 if(!Array.isArray(d.garden))d.garden=[];
 d.garden=d.garden.filter(g=>g&&typeof g.e==='string'&&typeof g.x==='number'&&typeof g.y==='number').slice(0,60);
 if(!Array.isArray(d.reviewQueue))d.reviewQueue=[];
 d.reviewQueue=d.reviewQueue.filter(x=>typeof x==='string').slice(0,9);
 if(typeof d.skillModel!=='object'||d.skillModel===null)d.skillModel={};
 if(typeof d.gates!=='object'||d.gates===null)d.gates={};
 if(typeof d.stars!=='object'||d.stars===null)d.stars={};
 if(typeof d.timeLimit!=='number'||d.timeLimit<0)d.timeLimit=0;
 if(typeof d.name!=='string')d.name='';
 if(typeof d.avatar!=='string'||d.avatar.length>250000||d.avatar.indexOf('data:image')!==0)d.avatar='';
 if(!Array.isArray(d.words))d.words=[];
 d.words=d.words.filter(w=>w&&typeof w.w==='string'&&typeof w.e==='string').slice(0,40);
 return d;}
export let S=(()=>{const d=defState();try{const p=JSON.parse(localStorage.getItem(KEY));if(p&&typeof p==='object')Object.assign(d,p)}catch(e){}return sanitize(d)})();
let saveT=null;
export function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
export function saveSoon(){clearTimeout(saveT);saveT=setTimeout(save,250)}
export function resetState(){try{localStorage.removeItem(KEY)}catch(e){}S=defState();save()}
export const DIFF={'קל':{spd:.7,opts:2,lives:4,hint:1},'רגיל':{spd:1,opts:3,lives:3,hint:2},'מאתגר':{spd:1.25,opts:4,lives:3,hint:3}};
