/* tests/adaptive.test.js — M1 #9: חידות מסתגלות לרמת התחום */
import {describe,it,expect,beforeEach,afterEach} from 'vitest';
import {S} from '../js/core/state.js';
import {PZ,optsCount,roundsFor} from '../js/game/puzzles.js';

beforeEach(()=>{
 document.body.innerHTML='<div id="puzzle"><h2 id="pzTitle"></h2><h3 id="pzSub"></h3><div id="pzBox"></div><div id="pzHint"></div></div>';
 S.diff='רגיל'; // בסיס 3 אפשרויות
 S.skillModel={};
 PZ.domain=null;});
afterEach(()=>{S.diff='רגיל';S.skillModel={};PZ.domain=null;});

describe('אדפטיביות חידות',()=>{
 it('ללא תחום — ערכי הבסיס של הגדרת ההורה',()=>{
  expect(optsCount()).toBe(3);
  expect(roundsFor(2)).toBe(2);});

 it('רמת תחום גבוהה (5) — יותר אפשרויות וסבבים',()=>{
  PZ.domain='math';S.skillModel={math:10}; // רמה 5
  expect(optsCount()).toBe(4);
  expect(roundsFor(2)).toBe(3);});

 it('רמת תחום נמוכה (1) — פחות אפשרויות',()=>{
  PZ.domain='shapes';S.skillModel={shapes:0}; // רמה 1
  expect(optsCount()).toBe(2);
  expect(roundsFor(2)).toBe(2);});

 it('רמה בינונית (3) — ערכי בסיס',()=>{
  PZ.domain='letters';S.skillModel={letters:4}; // רמה 3
  expect(optsCount()).toBe(3);
  expect(roundsFor(2)).toBe(2);});

 it('חסמים: 2..4 אפשרויות בכל מצב',()=>{
  PZ.domain='time';
  S.skillModel={time:10};S.diff='מאתגר';
  expect(optsCount()).toBeLessThanOrEqual(4);
  S.skillModel={time:0};S.diff='קל';
  expect(optsCount()).toBeGreaterThanOrEqual(2);});
});
