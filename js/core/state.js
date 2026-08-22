/* core/state.js — מצב גלובלי + התמדה (localStorage) */
const KEY='leny-world-v1';
export function defState(){return{items:[],gates:{},stars:{},sound:true,night:false,diff:'רגיל',mode:'חוקר',tutorial:false,name:'',best:0}}
export let S=(()=>{const d=defState();try{const p=JSON.parse(localStorage.getItem(KEY));if(p&&typeof p==='object')Object.assign(d,p)}catch(e){}return d})();
let saveT=null;
export function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
export function saveSoon(){clearTimeout(saveT);saveT=setTimeout(save,250)}
export function resetState(){try{localStorage.removeItem(KEY)}catch(e){}S=defState();save()}
export const DIFF={'קל':{spd:.7,opts:2,lives:4,hint:1},'רגיל':{spd:1,opts:3,lives:3,hint:2},'מאתגר':{spd:1.25,opts:4,lives:3,hint:3}};
