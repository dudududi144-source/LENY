/* tests/engine.test.js — M0: התנהגות מצבי חוקר/הרפתקן */
import {describe,it,expect,beforeEach,afterEach} from 'vitest';
import {S} from '../js/core/state.js';
import {RT} from '../js/game/runtime.js';
import {parseLevel,setJump} from '../js/engine/engine.js';

describe('מצב חוקר (3-5)',()=>{
 beforeEach(()=>{S.mode='חוקר';});
 afterEach(()=>{S.mode='חוקר';RT.screen='title';});

 it('ללא אויבים וללא קוצים',()=>{
  parseLevel(2); // פסגות האותיות — מכיל מעופפים וקוצים
  expect(RT.ents.some(e=>e.t==='enemy')).toBe(false);
  expect(RT.ents.some(e=>e.t==='spike')).toBe(false);});

 it('בוס מוחלף בדגל',()=>{
  parseLevel(4); // מבצר הרגשות — מכיל בוס
  expect(RT.boss).toBeNull();
  expect(RT.ents.some(e=>e.t==='flag')).toBe(true);});

 it('חיץ קפיצה נדיב (12)',()=>{
  parseLevel(0);RT.screen='play';setJump();
  expect(RT.player.jbuf).toBe(12);});
});

describe('מצב הרפתקן (6-8)',()=>{
 beforeEach(()=>{S.mode='הרפתקן';});
 afterEach(()=>{S.mode='חוקר';RT.screen='title';});

 it('אויבים וקוצים קיימים',()=>{
  parseLevel(2);
  expect(RT.ents.some(e=>e.t==='enemy')).toBe(true);
  expect(RT.ents.some(e=>e.t==='spike')).toBe(true);});

 it('בוס קיים',()=>{
  parseLevel(4);
  expect(RT.boss).not.toBeNull();});

 it('חיץ קפיצה רגיל (8)',()=>{
  parseLevel(0);RT.screen='play';setJump();
  expect(RT.player.jbuf).toBe(8);});
});
