/* core/tts.js — הקראה עברית (SpeechSynthesis) */
import {S} from './state.js';
import {AU} from './audio.js';

export const TTS={he:null,
 init(){try{if(!('speechSynthesis' in window))return;
   const p=()=>{const vs=speechSynthesis.getVoices();this.he=vs.find(v=>(v.lang||'').toLowerCase().startsWith('he'))||null};
   p();
   if(speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',p);
   else speechSynthesis.onvoiceschanged=p}catch(e){}},
 say(t){if(!S.sound)return;try{if(!('speechSynthesis' in window))return;
   speechSynthesis.cancel();
   AU.duck(true);clearTimeout(this._duckT);this._duckT=setTimeout(()=>AU.duck(false),2600);
   const u=new SpeechSynthesisUtterance(t);u.lang='he-IL';
   if(this.he)u.voice=this.he;u.rate=.9;u.pitch=1.15;
   speechSynthesis.speak(u)}catch(e){AU.duck(false)}}};
TTS.init();

export function praise(){const n=S.name.trim();AU.sfx('success');TTS.say(n?('כָּל הַכָּבוֹד, '+n+'!'):'כָּל הַכָּבוֹד!')}
