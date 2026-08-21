/* tests/utils.test.js */
import {describe,it,expect} from 'vitest';
import {shuffle,clamp,rnd} from '../js/core/utils.js';

describe('utils',()=>{
 it('shuffle שומר על כל האיברים ואינו משנה את המקור',()=>{
  const a=[1,2,3,4,5];const b=shuffle(a);
  expect([...b].sort((x,y)=>x-y)).toEqual([1,2,3,4,5]);
  expect(a).toEqual([1,2,3,4,5]);});
 it('clamp מגביל לטווח',()=>{
  expect(clamp(5,0,10)).toBe(5);
  expect(clamp(-1,0,10)).toBe(0);
  expect(clamp(11,0,10)).toBe(10);});
 it('rnd מחזיר מספר בטווח [0,n)',()=>{
  for(let i=0;i<50;i++){const v=rnd(5);
   expect(v).toBeGreaterThanOrEqual(0);expect(v).toBeLessThan(5);}});
});
