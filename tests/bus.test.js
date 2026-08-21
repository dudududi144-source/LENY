/* tests/bus.test.js */
import {describe,it,expect,vi} from 'vitest';
import {on,emit} from '../js/core/bus.js';

describe('event bus',()=>{
 it('מנוי מקבל אירוע עם נתונים',()=>{
  const fn=vi.fn();on('t-a',fn);emit('t-a',{x:1});
  expect(fn).toHaveBeenCalledWith({x:1});});
 it('ריבוי מנויים',()=>{
  const a=vi.fn(),b=vi.fn();on('t-b',a);on('t-b',b);emit('t-b');
  expect(a).toHaveBeenCalledTimes(1);expect(b).toHaveBeenCalledTimes(1);});
 it('אירוע ללא מנויים לא זורק שגיאה',()=>{
  expect(()=>emit('no-such-event')).not.toThrow();});
});
