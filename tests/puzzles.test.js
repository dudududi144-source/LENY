/* tests/puzzles.test.js */
import {describe,it,expect,beforeEach} from 'vitest';
import {PZ,openPuzzle,closePuzzle,pzGate,pzBoss} from '../js/game/puzzles.js';
import {RT} from '../js/game/runtime.js';

beforeEach(()=>{
 document.body.innerHTML='<div id="puzzle"><h2 id="pzTitle"></h2><h3 id="pzSub"></h3><div id="pzBox"></div><div id="pzHint"></div></div>';
 RT.paused=false;RT.puzzleBusy=false;RT.level=0;});

describe('פתיחה/סגירה',()=>{
 it('openPuzzle מציג מודאל, משהה משחק ובונה תוכן',()=>{
  openPuzzle('כותרת','תת',box=>{box.innerHTML='<button class="pz-opt">א</button>';},()=>{});
  expect(document.getElementById('puzzle').classList.contains('show')).toBe(true);
  expect(PZ.open).toBe(true);
  expect(RT.paused).toBe(true);
  expect(document.querySelectorAll('.pz-opt').length).toBe(1);});
 it('closePuzzle מעביר תוצאה לקולבק',async()=>{
  let got=null;
  openPuzzle('t','s',()=>{},ok=>{got=ok;});
  closePuzzle(true);
  await new Promise(r=>setTimeout(r,300));
  expect(got).toBe(true);
  expect(PZ.open).toBe(false);
  expect(RT.paused).toBe(false);});
});

describe('בניית חידות',()=>{
 it('pzGate בונה חידת חיות לעולם 1 (2+ אפשרויות)',()=>{
  const box=document.getElementById('pzBox');
  pzGate(box);
  expect(box.querySelectorAll('.pz-opt').length).toBeGreaterThanOrEqual(2);});
 it('pzGate בונה חידת חשבון לעולם 6',()=>{
  RT.level=5;
  const box=document.getElementById('pzBox');
  pzGate(box);
  expect(box.querySelectorAll('.pz-opt').length).toBeGreaterThanOrEqual(2);});
 it('pzGate בונה חידת צבעים לעולם 7',()=>{
  RT.level=6;
  const box=document.getElementById('pzBox');
  pzGate(box);
  expect(box.querySelectorAll('.pz-opt').length).toBeGreaterThanOrEqual(3);});
 it('pzGate בונה חידת גדלים וסדרות לעולם 8',()=>{
  RT.level=7;
  const box=document.getElementById('pzBox');
  pzGate(box);
  expect(box.querySelectorAll('.pz-opt').length).toBeGreaterThanOrEqual(3);});
 it('pzGate בונה חידת שעון לעולם 9',()=>{
  RT.level=8;
  const box=document.getElementById('pzBox');
  pzGate(box);
  expect(box.querySelectorAll('.pz-opt').length).toBeGreaterThanOrEqual(3);
  expect(box.querySelector('svg')).not.toBeNull();});
 it('pzGate בונה חידת ערבוב לעולם 10 (הסיום)',()=>{
  RT.level=9;
  for(let i=0;i<5;i++){
   const box=document.getElementById('pzBox');
   pzGate(box);
   expect(box.querySelectorAll('button').length).toBeGreaterThanOrEqual(2);
   box.innerHTML='';}});
 it('בוס מגריל חידה מתוך כל 9 הסוגים',()=>{
  const box=document.getElementById('pzBox');
  pzBoss(box);
  expect(box.querySelectorAll('button').length).toBeGreaterThanOrEqual(2);});
 it('כל 10 העולמות מייצרים חידה תקינה',()=>{
  for(let w=0;w<10;w++){
   RT.level=w;
   const box=document.getElementById('pzBox');
   pzGate(box);
   expect(box.querySelectorAll('button').length).toBeGreaterThanOrEqual(2);
   box.innerHTML='';}});
});
