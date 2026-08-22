/* tests/juice.test.js — שכבת הג'וס: פלאש מסך + מתנות הפתעה */
import {describe,it,expect,beforeEach} from 'vitest';
import {RT} from '../js/game/runtime.js';
import {S} from '../js/core/state.js';
import {parseLevel,flash} from '../js/engine/engine.js';

describe("שכבת ג'וס",()=>{
 beforeEach(()=>{S.mode='חוקר';});

 it('פלאש מסך נשמר ב-RT',()=>{
  flash('#ff2e88',.4);
  expect(RT.flashC).toBe('#ff2e88');
  expect(RT.flashA).toBeCloseTo(.4);});

 it('מתנות הפתעה מופיעות בשלבים (נגד מונוטוניות)',()=>{
  let gifts=0;
  for(let i=0;i<6;i++){parseLevel(i%5);gifts+=RT.ents.filter(e=>e.t==='gift').length;}
  expect(gifts).toBeGreaterThan(0);});

 it('מתנה היא ישות תקינה עם סוג פרס',()=>{
  let g=null;
  for(let i=0;i<6&&!g;i++){parseLevel(i%5);g=RT.ents.find(e=>e.t==='gift');}
  if(g){expect(g.w).toBe(32);expect(g.h).toBe(32);expect([0,1,2]).toContain(g.kind);}});
});
