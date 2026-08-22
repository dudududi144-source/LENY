/* tests/skill-model.test.js — M1: אלגוריתם מודל המיומנות */
import {describe,it,expect,beforeEach} from 'vitest';
import {S} from '../js/core/state.js';
import {DOMAINS,getLevel,getScore,recordResult,resetModel,summary,weakestDomain} from '../js/game/skill-model.js';

beforeEach(()=>{S.skillModel={};S.reviewQueue=[];});

describe('מודל מיומנות',()=>{
 it('9 תחומים מוגדרים',()=>{
  expect(DOMAINS.length).toBe(9);});

 it('רמת ברירת מחדל: 1 וניקוד 0',()=>{
  for(const d of DOMAINS){expect(getLevel(d)).toBe(1);expect(getScore(d)).toBe(0);}});

 it('הצלחות מעלות רמה (כל 2 נקודות)',()=>{
  recordResult('math',true);
  expect(getScore('math')).toBe(1);
  expect(getLevel('math')).toBe(1);
  const r=recordResult('math',true);
  expect(getScore('math')).toBe(2);
  expect(r.level).toBe(2);
  expect(r.leveledUp).toBe(true);});

 it('שגיאה מורידה ניקוד בכפליים',()=>{
  recordResult('letters',true);recordResult('letters',true);
  recordResult('letters',false);
  expect(getScore('letters')).toBe(0);});

 it('חסמים: ניקוד 0..10, רמה 1..5',()=>{
  for(let i=0;i<20;i++)recordResult('colors',true);
  expect(getScore('colors')).toBe(10);
  expect(getLevel('colors')).toBe(5);
  const r=recordResult('colors',true);
  expect(r.leveledUp).toBe(false);
  for(let i=0;i<20;i++)recordResult('colors',false);
  expect(getScore('colors')).toBe(0);
  expect(getLevel('colors')).toBe(1);});

 it('עצמאות תחומים',()=>{
  for(let i=0;i<4;i++)recordResult('animals',true);
  expect(getLevel('animals')).toBe(3);
  expect(getLevel('shapes')).toBe(1);});

 it('דומיין לא מוכר לא נוגע במודל',()=>{
  const r=recordResult('bogus',true);
  expect(r.leveledUp).toBe(false);
  expect(getScore('animals')).toBe(0);});

 it('איפוס מחזיר לברירת מחדל',()=>{
  for(let i=0;i<4;i++)recordResult('time',true);
  resetModel();
  expect(getLevel('time')).toBe(1);
  expect(getScore('time')).toBe(0);});

 it('summary מחזיר תמונה מלאה',()=>{
  const s=summary();
  expect(s.length).toBe(9);
  expect(s.every(e=>e.level>=1&&e.level<=5)).toBe(true);});

 it('תור חיזוק: שגיאה מכניסה, הצלחה מוציאה',()=>{
  recordResult('math',false);
  expect(S.reviewQueue).toContain('math');
  recordResult('math',true);
  expect(S.reviewQueue).not.toContain('math');});

 it('weakestDomain מעדיף תור חיזוק על פני ניקוד',()=>{
  S.reviewQueue=['letters'];S.skillModel={math:0};
  expect(weakestDomain()).toBe('letters');});
});
