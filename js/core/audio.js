/* core/audio.js — WebAudio: אפקטים, מוזיקה, צלילי חיות וכלים (הכול מסונתז) */
import {S} from './state.js';

/* סולם מוזיקלי ייחודי לכל עולם (M2) */
const SCALES=[
 [261.63,329.63,392,523.25,392,329.63],
 [220,261.63,329.63,440,329.63,261.63],
 [196,246.94,293.66,392,293.66,246.94],
 [293.66,369.99,440,587.33,440,369.99],
 [174.61,220,261.63,349.23,261.63,220],
 [329.63,415.3,493.88,659.25,493.88,415.3],
 [349.23,440,523.25,698.46,523.25,440],
 [246.94,293.66,369.99,493.88,369.99,293.66],
 [261.63,311.13,392,523.25,392,311.13],
 [293.66,349.23,440,587.33,440,349.23]];

export const AU={ctx:null,mg:null,sg:null,mus:null,ni:0,
 ensure(){if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;
   this.ctx=new C();const m=this.ctx.createGain();m.gain.value=1;
   this.comp=this.ctx.createDynamicsCompressor();
   this.comp.threshold.value=-18;this.comp.knee.value=20;this.comp.ratio.value=6;
   this.comp.attack.value=.003;this.comp.release.value=.25;
   m.connect(this.comp);this.comp.connect(this.ctx.destination);
   this.mg=this.ctx.createGain();this.mg.gain.value=S.sound?.16:0;this.mg.connect(m);
   this.sg=this.ctx.createGain();this.sg.gain.value=S.sound?.85:0;this.sg.connect(m);this.startMusic()}
   if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return true},
 tone(f,d=.12,type='sine',g=.4,del=0,dest,slide){if(!this.ctx)return;const t=this.ctx.currentTime+del,o=this.ctx.createOscillator(),e=this.ctx.createGain();
   o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.linearRampToValueAtTime(slide,t+d);
   e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(Math.max(g,.001),t+.02);e.gain.exponentialRampToValueAtTime(.0001,t+d);
   o.connect(e);e.connect(dest||this.sg);o.start(t);o.stop(t+d+.06)},
 sfx(n){if(!this.ensure()||!S.sound)return;switch(n){
   case'tap':this.tone(520,.08,'sine',.5);break;
   case'select':this.tone(660,.09,'triangle',.55);break;
   case'coin':this.tone(1046,.07,'sine',.6);this.tone(1568,.1,'sine',.5,.06);break;
   case'jump':this.tone(340,.14,'square',.4,0,null,620);break;
   case'djump':this.tone(480,.14,'square',.4,0,null,860);break;
   case'land':this.tone(120,.06,'triangle',.3);break;
   case'hurt':this.tone(200,.22,'sawtooth',.5,0,null,90);break;
   case'stomp':this.tone(160,.12,'square',.5,0,null,60);break;
   case'gate':this.tone(392,.1,'sine',.5);this.tone(523,.12,'sine',.45,.08);this.tone(659,.16,'sine',.45,.16);break;
   case'success':[523.25,659.25,783.99,1046.5].forEach((f,i)=>this.tone(f,.16,'triangle',.55,i*.08));break;
   case'power':[440,660,880].forEach((f,i)=>this.tone(f,.12,'sine',.5,i*.08));break;
   case'goal':[523,659,784,1046].forEach((f,i)=>this.tone(f,.15,'sine',.5,i*.11));break;
   case'bosshit':this.tone(120,.2,'sawtooth',.6,0,null,50);break;
   case'bossdie':this.tone(80,.5,'sawtooth',.6,0,null,30);this.tone(60,.6,'square',.5,.2,null,20);break;
   case'wrong':this.tone(330,.12,'sine',.35);this.tone(290,.16,'sine',.3,.12);break;
   case'gentle':this.tone(330,.1,'sine',.25);this.tone(440,.14,'sine',.25,.1);break}},
 animal(k){if(!this.ensure()||!S.sound)return;const c=this.ctx,t=c.currentTime;try{
   if(k==='dog'){[0,.2].forEach(d=>{const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(500,t+d);o.frequency.exponentialRampToValueAtTime(150,t+d+.12);f.type='lowpass';f.frequency.setValueAtTime(1200,t+d);f.frequency.exponentialRampToValueAtTime(400,t+d+.12);g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.9,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.16);o.connect(f);f.connect(g);g.connect(this.sg);o.start(t+d);o.stop(t+d+.2)})}
   else if(k==='cat'){const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';f.type='bandpass';f.frequency.value=900;f.Q.value=2;o.frequency.setValueAtTime(500,t);o.frequency.linearRampToValueAtTime(950,t+.15);o.frequency.linearRampToValueAtTime(400,t+.45);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.5,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.5);o.connect(f);f.connect(g);g.connect(this.sg);o.start(t);o.stop(t+.55)}
   else if(k==='cow'){const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(140,t);o.frequency.linearRampToValueAtTime(90,t+.7);f.type='lowpass';f.frequency.value=500;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.8,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+.85);o.connect(f);f.connect(g);g.connect(this.sg);o.start(t);o.stop(t+.9)}
   else if(k==='pig'){[0,.16].forEach(d=>{const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(150,t+d);o.frequency.linearRampToValueAtTime(320,t+d+.06);o.frequency.linearRampToValueAtTime(140,t+d+.12);f.type='lowpass';f.frequency.value=1000;g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.5,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.14);o.connect(f);f.connect(g);g.connect(this.sg);o.start(t+d);o.stop(t+d+.16)})}
   else{[0,.12].forEach(d=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(1300,t+d);o.frequency.exponentialRampToValueAtTime(1900,t+d+.07);g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.35,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.1);o.connect(g);g.connect(this.sg);o.start(t+d);o.stop(t+d+.12)})}}catch(e){}},
 inst(k){if(!this.ensure()||!S.sound)return;
   if(k==='drum'){this.tone(90,.16,'triangle',.8);this.tone(60,.22,'sine',.7,.02)}
   else if(k==='trumpet'){this.tone(392,.26,'sawtooth',.32);this.tone(523.25,.26,'sawtooth',.27,.03)}
   else{this.tone(880,.45,'sine',.5);this.tone(1760,.35,'sine',.22,.01)}},
 startMusic(){if(!this.ctx||this.mus)return;const notes=SCALES[this.scaleIdx||0];
   this.mus=setInterval(()=>{if(!S.sound||document.hidden)return;const f=notes[this.ni%notes.length];this.tone(f,.34,'triangle',.5,0,this.mg);this.tone(f*2,.18,'sine',.12,.02,this.mg);this.ni++},S.night?640:520)},
 stopMusic(){if(this.mus){clearInterval(this.mus);this.mus=null}},
 setScale(i){this.scaleIdx=i;if(this.mus){this.stopMusic();if(S.sound)this.startMusic();}},
 duck(on){if(!this.ctx||!this.mg)return;try{this.mg.gain.cancelScheduledValues(this.ctx.currentTime);
  this.mg.gain.setTargetAtTime(on?(S.sound?.05:0):(S.sound?.16:0),this.ctx.currentTime,.15);}catch(_){/* noop */}},
 refresh(){if(!this.ctx)return;this.mg.gain.value=S.sound?.16:0;this.sg.gain.value=S.sound?.85:0}};

document.addEventListener('visibilitychange',()=>{if(document.hidden)AU.stopMusic();else if(S.sound&&AU.ctx)AU.startMusic()});
