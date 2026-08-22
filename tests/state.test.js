/* tests/state.test.js */
import {describe,it,expect} from 'vitest';
import {defState,DIFF,S,save,resetState} from '../js/core/state.js';

describe('state',()=>{
 it('מבנה ברירת מחדל',()=>{
  const d=defState();
  expect(d.items).toEqual([]);
  expect(d.gates).toEqual({});
  expect(d.stars).toEqual({});
  expect(d.sound).toBe(true);
  expect(d.night).toBe(false);
  expect(d.diff).toBe('רגיל');
  expect(d.mode).toBe('חוקר');
  expect(d.tutorial).toBe(false);
  expect(d.storySeen).toBe(false);
  expect(d.timeLimit).toBe(0);
  expect(d.garden).toEqual([]);
  expect(d.reviewQueue).toEqual([]);
  expect(d.skillModel).toEqual({});
  expect(d.best).toBe(0);});
 it('שלוש רמות קושי עם ערכים שפויים',()=>{
  expect(Object.keys(DIFF)).toEqual(['קל','רגיל','מאתגר']);
  for(const k of Object.keys(DIFF)){
   expect(DIFF[k].lives).toBeGreaterThanOrEqual(3);
   expect(DIFF[k].opts).toBeGreaterThanOrEqual(2);
   expect(DIFF[k].spd).toBeGreaterThan(0);}});
 it('שמירה וטעינה (roundtrip)',()=>{
  S.best=1234;S.items=[0];save();
  const raw=JSON.parse(localStorage.getItem('leny-world-v1'));
  expect(raw.best).toBe(1234);
  expect(raw.items).toEqual([0]);});
 it('איפוס מחזיר לברירת מחדל',()=>{
  S.best=999;resetState();
  expect(S.best).toBe(0);expect(S.items).toEqual([]);});
});

describe('סניטציית מצב',()=>{
 it('מצב מושחת מתוקן לברירת מחדל בטוחה',()=>{
  const bad={items:[1,'x',99,3],garden:'oops',reviewQueue:null,skillModel:5,timeLimit:-3,name:42,
   garden2:null};
  bad.garden='oops';
  const s=sanitize(Object.assign(defState(),bad));
  expect(s.items).toEqual([1,3]);
  expect(Array.isArray(s.garden)).toBe(true);
  expect(s.garden.length).toBe(0);
  expect(s.skillModel).toEqual({});
  expect(s.timeLimit).toBe(0);
  expect(s.name).toBe('');});

 it('מדבקות תקינות נשמרות',()=>{
  const s=sanitize(Object.assign(defState(),{garden:[{e:'🌸',x:10.5,y:20.1},{e:7}]}));
  expect(s.garden.length).toBe(1);
  expect(s.garden[0].e).toBe('🌸');});
});