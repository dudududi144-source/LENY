/* tests/puzzles.test.js */
import {describe,it,expect,beforeEach} from 'vitest';
import {PZ,openPuzzle,closePuzzle,pzGate} from '../js/game/puzzles.js';
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
});
