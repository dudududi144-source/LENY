/* tests/physics.test.js */
import {describe,it,expect,beforeEach} from 'vitest';
import {RT} from '../js/game/runtime.js';
import {TILE} from '../js/game/levels.js';
import {solidAt,gateClosedCol,rectVsMap,aabb,GRAV,JUMP} from '../js/engine/physics.js';

beforeEach(()=>{
 RT.levelMap=[[1,1,1],[0,0,0],[1,1,1]];
 RT.rows=3;RT.cols=3;RT.gates=[];});

describe('solidAt',()=>{
 it('אריח מוצק מזוהה',()=>{expect(solidAt(5,5)).toBe(true);});
 it('תא ריק אינו מוצק',()=>{expect(solidAt(5,50)).toBe(false);});
 it('מחוץ לגבולות אינו מוצק',()=>{expect(solidAt(-10,50)).toBe(false);});
});

describe('שערים',()=>{
 it('שער סגור חוסם את כל העמודה',()=>{
  RT.gates=[{col:1,row:1,open:false}];
  expect(gateClosedCol(1,0)).toBe(true);
  expect(solidAt(TILE+5,5)).toBe(true);});
 it('שער פתוח מאפשר מעבר',()=>{
  RT.gates=[{col:1,row:1,open:true}];
  expect(solidAt(TILE+5,TILE+6)).toBe(false);});
});

describe('rectVsMap',()=>{
 it('נחיתה על רצפה: onGround ואיפוס מהירות',()=>{
  const o={x:46,y:40,w:40,h:40,vx:0,vy:12,onGround:false};
  rectVsMap(o);
  expect(o.onGround).toBe(true);
  expect(o.vy).toBe(0);
  expect(o.y).toBeCloseTo(2*TILE-40-.01,1);});
 it('פגיעה בתקרה עוצרת עלייה',()=>{
  const o={x:46,y:50,w:40,h:40,vx:0,vy:-12,onGround:false};
  rectVsMap(o);
  expect(o.vy).toBe(0);
  expect(o.y).toBeCloseTo(TILE+.01,1);});
});

describe('aabb',()=>{
 it('חפיפה',()=>{expect(aabb({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10})).toBe(true);});
 it('אי-חפיפה',()=>{expect(aabb({x:0,y:0,w:10,h:10},{x:20,y:20,w:10,h:10})).toBe(false);});
});

describe('קבועים',()=>{
 it('כבידה חיובית וקפיצה שלילית',()=>{
  expect(GRAV).toBeGreaterThan(0);expect(JUMP).toBeLessThan(0);});
});
