/* engine/tutorial.js — מנוע הדרכה (הופרד מ-engine לצמצום אחריות)
   שלושה שלבים: ללכת ← לקפוץ ← לגעת בשער. חד-פעמי (דגל S.tutorial). */
import {RT} from '../game/runtime.js';
import {S,save} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {later} from '../core/utils.js';

export function tutorialStart(li){
 RT.tut=0;RT.tutDist=0;
 if(li===0&&!S.tutorial){RT.tut=1;
  later(()=>TTS.say('בְּרוּכָה הַבָּאָה! לַחֲצִי עַל הַחִצִּים כְּדֵי לָלֶכֶת'),700);}}

export function tutorialUpdate(p){
 if(RT.tut===1){
  RT.tutDist=(RT.tutDist||0)+Math.abs(p.vx);
  RT.curHint='👟 לחצי על החצים כדי ללכת';RT.hintTimer=200;
  if(RT.tutDist>130){RT.tut=2;AU.sfx('power');
   TTS.say('מְצֻיֶּנֶת! עַכְשָׁיו קְפִיצָה — כַּפְתּוֹר הַקְּפִיצָה');}}
 else if(RT.tut===2){
  RT.curHint='⤒ לחצי כדי לקפוץ!';RT.hintTimer=200;
  if(p.vy<-2){RT.tut=3;AU.sfx('power');
   TTS.say('וָואו! עַכְשָׁיו נִגְעִי בַּשַּׁעַר הַזּוֹהֵר');}}
 else if(RT.tut===3){
  RT.curHint='✦ נגעי בשער הזוהר!';RT.hintTimer=200;}}

export function tutorialComplete(){
 if(RT.tut===3){RT.tut=0;S.tutorial=true;save();}}
