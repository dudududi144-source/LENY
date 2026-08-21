/* tests/levels.test.js — ולידציית נתוני שלבים */
import {describe,it,expect} from 'vitest';
import {LEVELS,WORLDS,THEMES,TILE} from '../js/game/levels.js';

const KNOWN=new Set(['.','P','C','S','E','Y','M','H','F','B','#','1','2','3']);

describe('נתוני עולמות',()=>{
 it('5 עולמות, 5 נושאים, 5 מפות',()=>{
  expect(LEVELS.length).toBe(5);
  expect(WORLDS.length).toBe(5);
  expect(THEMES.length).toBe(5);});
 it('גודל אריח 44',()=>{expect(TILE).toBe(44);});
});

LEVELS.forEach((lv,i)=>{
 describe('עולם '+(i+1),()=>{
  it('רק תווים חוקיים',()=>{
   for(const row of lv.map)for(const ch of row)expect(KNOWN.has(ch)).toBe(true);});
  it('נקודת התחלה אחת בדיוק',()=>{
   expect(lv.map.join('').split('P').length-1).toBe(1);});
  it('יציאה: דגל או בוס',()=>{
   const s=lv.map.join('');
   expect(s.includes('F')||s.includes('B')).toBe(true);});
  it('עד 3 שערי חוכמה',()=>{
   const s=lv.map.join('');
   expect((s.match(/[123]/g)||[]).length).toBeLessThanOrEqual(3);});
  it('פער קרקע קפיץ (<=5 אריחים)',()=>{
   const ground=lv.map[lv.map.length-2]||'';
   let run=0,max=0;
   for(const ch of ground){if(ch==='.'){run++;max=Math.max(max,run);}else run=0;}
   expect(max).toBeLessThanOrEqual(5);});
 });
});
