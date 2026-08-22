/* game/mind.js — השכבה הפסיכולוגית (מקור טקסט: core/strings.js)
   עקרונות מכווני-ילד: שבח תהליך (growth mindset), ניסוח מחדש של טעויות, ויסות רגשי.
   כל המחרוזות חיות ב-STR.mind — כאן רק הלוגיקה. */
import {rnd} from '../core/utils.js';
import STR from '../core/strings.js';

export const EFFORT_PRAISE=STR.mind.effort;
export const FOCUS_PRAISE=STR.mind.focus;
export const CALM_MISTAKE=STR.mind.calm;

export function praiseFor(firstTry){
 return firstTry?FOCUS_PRAISE[rnd(FOCUS_PRAISE.length)]:EFFORT_PRAISE[rnd(EFFORT_PRAISE.length)];}
export function reframe(){return CALM_MISTAKE[rnd(CALM_MISTAKE.length)];}
