/* tests/content-bank.test.js — M1 #8: תקינות בנק התוכן */
import {describe,it,expect} from 'vitest';
import {WORDS,COLOR_OBJECTS,SIZE_TRIPLES,PATTERN_BANK,validateBank} from '../js/game/content-bank.js';

describe('בנק תוכן',()=>{
 it('validateBank עובר',()=>{
  expect(validateBank()).toBe(true);});

 it('אותיות: 10+ מילים, אותיות חוקיות וסמל לכל מילה',()=>{
  expect(WORDS.length).toBeGreaterThanOrEqual(10);
  for(const w of WORDS){
   expect(w.w.length).toBeGreaterThan(0);
   expect(w.e.length).toBeGreaterThan(0);
   expect(w.a).toMatch(/^[א-ת]$/);}});

 it('צבעים: 5+ זוגות עם הקס תקין',()=>{
  expect(COLOR_OBJECTS.length).toBeGreaterThanOrEqual(5);
  for(const [e,c] of COLOR_OBJECTS){
   expect(e.length).toBeGreaterThan(0);
   expect(c).toMatch(/^#[0-9a-f]{6}$/i);}});

 it('גדלים: 5+ שלשות ללא כפילויות',()=>{
  expect(SIZE_TRIPLES.length).toBeGreaterThanOrEqual(5);
  for(const t of SIZE_TRIPLES){expect(new Set(t).size).toBe(3);}});

 it('סדרות: 4+ תבניות עם פריט הסחה ייחודי',()=>{
  expect(PATTERN_BANK.length).toBeGreaterThanOrEqual(4);
  for(const p of PATTERN_BANK){expect(new Set(p).size).toBe(3);}});

 it('אין כפילויות מילים בבנק האותיות',()=>{
  const ws=WORDS.map(w=>w.w);
  expect(new Set(ws).size).toBe(ws.length);});
});
