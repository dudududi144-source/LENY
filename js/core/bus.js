/* core/bus.js — אפיק אירועים (pub/sub) לצימוד נמוך בין מנוע למסכים */
const handlers={};
export function on(evt,fn){(handlers[evt]=handlers[evt]||[]).push(fn)}
export function emit(evt,data){(handlers[evt]||[]).forEach(fn=>fn(data))}
