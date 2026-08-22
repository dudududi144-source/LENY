/* ui/scenes.js — ניהול מסכים: כותרת, רכז, מדבקות, סיום, הפסד, ניצחון
   נרשם לאירועי המנוע דרך ה-bus (צימוד חד-כיווני) */
import {$,$$,el,later,cleanT} from '../core/utils.js';
import {on} from '../core/bus.js';
import {S,save} from '../core/state.js';
import {AU} from '../core/audio.js';
import {TTS} from '../core/tts.js';
import {toast,confetti} from './fx.js';
import {RT,LEN} from '../game/runtime.js';
import {WORLDS,MEANINGS,THEMES} from '../game/levels.js';
import {worldIcon,moodIcon} from './icons.js';
import {startWorld,togglePause} from '../engine/engine.js';
import {renderGarden,initGarden} from './garden.js';
import {DOMAINS,weakestDomain} from '../game/skill-model.js';

function showScreen(id){$$('.scr').forEach(s=>s.classList.remove('show'));
 if(id)$('#scr-'+id).classList.add('show')}

function fadeTo(fn){$('#fade').style.opacity=1;
 setTimeout(()=>{fn();$('#fade').style.opacity=0},330)}

export function goTitle(){RT.screen='title';RT.paused=false;showScreen('title');
 $('#wrap').classList.remove('show');LEN.title.play('wave')}

export function goHub(){RT.screen='hub';RT.paused=false;cleanT();showScreen('hub');
 $('#wrap').classList.remove('show');renderHub();
 if(!S.storySeen)$('#story').classList.add('show')}

function renderHub(){
 LEN.hub.sync(S.items.map(w=>WORLDS[w].reward));LEN.hub.play('idle');
 const lights=$('#hubLights');if(lights){lights.innerHTML='';
  for(let i=0;i<WORLDS.length;i++){const got=S.items.includes(i);
   lights.appendChild(el('div','orb'+(got?' lit':''),got?'✦':''));}}
 const wd=weakestDomain();const weakIdx=wd?DOMAINS.indexOf(wd):-1;
 const queue=Array.isArray(S.reviewQueue)?S.reviewQueue:[];
 const n=S.name.trim();
 $('#hubHello').textContent=n?('הַיְי '+n+'! בְּחֲרִי עוֹלָם'):'הַיְי לֶנִי! בְּחֲרִי עוֹלָם';
 $('#hubProgress').textContent='⭐ '+S.items.length+'/'+WORLDS.length;
 const box=$('#hubBubbles');box.innerHTML='';
 const path=el('div');path.id='hubPath';
 path.innerHTML='<svg viewBox="0 0 640 220" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M20 40 C 120 120, 200 20, 320 110 S 520 40, 620 150" fill="none" stroke="rgba(124,77,255,.5)" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/></svg>';
 box.appendChild(path);
 const firstOpen=WORLDS.findIndex((w,i)=>!S.items.includes(i));
 WORLDS.forEach((w,i)=>{
  const unlocked=i===0||S.items.includes(i-1);
  const done=S.items.includes(i);
  const b=el('button','bubble'+(unlocked?'':' locked')+(done?' done':'')+(i===firstOpen?' current':''));
  b.style.animationDelay=(i*.08)+'s';
  b.setAttribute('aria-label',w.name);
  b.innerHTML='<span class="bi" style="color:'+(unlocked?THEMES[i].accent:'#9a9ab0')+'">'+worldIcon(i)+'</span><span class="bl">'+w.name+'</span><span class="bs">'+(done?'★'.repeat(Math.max(1,S.stars[i]||1)):'')+'</span>';
  if(done)b.appendChild(el('span','bdone','✓'));
  if(i===weakIdx||queue.includes(DOMAINS[i])){b.classList.add('weak');b.appendChild(el('span','bdone','🌸'));}
  b.onclick=()=>{AU.ensure();
   if(!unlocked){AU.sfx('wrong');b.classList.add('shake');later(()=>b.classList.remove('shake'),420);
    toast('שַׂחֲקִי קוֹדֶם בָּעוֹלָם הַקּוֹדֵם! 🌟');return}
   AU.sfx('select');LEN.hub.play('cheer');TTS.say(w.learn);
   fadeTo(()=>startWorld(i))};
  box.appendChild(b)})}

/* ── מסך מדבקות (בהשראת "לני הגיבורה") ── */
function renderStickers(){
 const g=$('#stickerGrid');g.innerHTML='';
 WORLDS.forEach((w,i)=>{
  const got=S.items.includes(i);
  const d=el('div','stk-card'+(got?'':' locked'));
  d.style.animationDelay=(i*.07)+'s';
  d.innerHTML='<span class="si">'+(got?w.rIcon:'❔')+'</span><span class="sn">'+w.rName+'</span>';
  g.appendChild(d)});
 const totalStars=Object.values(S.stars).reduce((a,b)=>a+b,0);
 $('#stickerCount').innerHTML='✦ נֶאֶסְפוּ <b>'+totalStars+'/'+(WORLDS.length*3)+'</b> כּוֹכְבֵי חָכְמָה · שיא: <b>'+S.best+'</b>'}

function showStickers(){RT.screen='stickers';RT.paused=false;showScreen('stickers');
 $('#wrap').classList.remove('show');renderStickers();AU.sfx('open')}

/* ── מסכי סיום/הפסד/ניצחון ── */
function showDone(d){const first=d&&d.first;
 RT.screen='done';$('#wrap').classList.remove('show');showScreen('done');
 LEN.done.sync(S.items.map(w=>WORLDS[w].reward));
 const w=WORLDS[RT.level];
 $('#doneReward').textContent=first?w.rIcon:'🏅';
 $('#doneName').textContent=first?('לֶנִי קִבְּלָה אֶת '+w.rSay+'!'):'כָּל הַכָּבוֹד! שׁוּב הִשְׁלַמְתְּ אֶת הָעוֹלָם';
 $('#doneStats').innerHTML='נִקּוּד: <b>'+RT.score+'</b> · יְהַלּוּמִים: <b>'+RT.levelCoins+'/'+RT.levelCoinsTotal+'</b>';
 $('#doneStars').textContent='שַׁעֲרֵי חָכְמָה: '+'✦'.repeat(RT.gatesSolvedNow)+' ('+RT.gatesSolvedNow+'/3)';
 $('#doneMeaning').textContent='✦ '+MEANINGS[RT.level];
 TTS.say(MEANINGS[RT.level]);
 LEN.done.play(first?'spin':'cheer');
 later(()=>{if(RT.screen==='done')LEN.done.play('dance')},1100);
 if(first){confetti();AU.sfx('goal');TTS.say('לֶנִי קִבְּלָה אֶת '+w.rSay)}else AU.sfx('success')}

function showGameOver(){
 RT.screen='over';$('#wrap').classList.remove('show');showScreen('over');
 $('#overScore').textContent=RT.score;$('#overBest').textContent=S.best;
 AU.sfx('wrong');TTS.say('נְסִי שׁוּב, אַתְּ מְצֻיֶּנֶת!')}

function showWin(){
 RT.screen='win';$('#wrap').classList.remove('show');showScreen('win');
 LEN.win.sync(['hearts','hat','bow','tutu','boots','crown','wings','glasses','necklace','wand']);LEN.win.play('dance');
 $('#winScore').textContent=RT.score;confetti();AU.sfx('goal');later(confetti,1200);
 TTS.say('כָּל הַכָּבוֹד! לֶנִי נִצְּחָה!')}

/* ── אתחול: מנוי לאירועים + חיבור כפתורים ── */
const DNAMES={animals:'חיות',shapes:'צורות',letters:'אותיות',music:'מוזיקה',emotions:'רגשות',math:'חשבון',colors:'צבעים',sizes:'גדלים',time:'שעות'};

/* ── אווטר מתמונת הילד: צילום/העלאה → הקטנה ל-128px → שמירה ── */
function fileToAvatar(file,cb){
 const rd=new FileReader();
 rd.onload=()=>{const img=new Image();
  img.onload=()=>{const c=document.createElement('canvas');const SZ=128;
   c.width=SZ;c.height=SZ;const x=c.getContext('2d');
   const m=Math.min(img.width,img.height);
   x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,SZ,SZ);
   cb(c.toDataURL('image/jpeg',.82));};
  img.onerror=()=>{};
  img.src=rd.result;};
 rd.onerror=()=>{};
 rd.readAsDataURL(file);}
function refreshAvatarUI(){const pv=$('#avatarPreview');if(!pv)return;
 if(S.avatar){pv.innerHTML='<img src="'+S.avatar+'" alt="האווטר שלי"/>';pv.classList.add('has-img');}
 else{pv.textContent='📷';pv.classList.remove('has-img');}}

export function initScenes(){
 initGarden();
 on('levelup',d=>toast('⭐ לֶנִי עָלְתָה רָמָה בְּ'+(DNAMES[d]||d)+'!'));
 on('review-toast',()=>toast('🌸 שֶׁלֶב חִזּוּק! +200 עַל כָּל שַׁעַר'));
 on('rest-warn',()=>toast('⏰ עוֹד שְׁתֵּי דַּקּוֹת — נָנוּחַ יַחַד'));
 on('rest',()=>{RT.paused=true;$('#rest').classList.add('show');TTS.say('הַגִּיעַ הַזְּמָן לָנוּחַ');});
 $('#restDone').onclick=()=>{$('#rest').classList.remove('show');RT.paused=false;goTitle();};
 $('#restMore').onclick=()=>{RT.sessionStart+=5*60000;RT.rested=false;RT.restWarned=false;$('#rest').classList.remove('show');RT.paused=false;toast('עוֹד 5 דַּקּוֹת ⏰');};
 LEN.hub.el.addEventListener('pointerdown',()=>{if(RT.screen!=='hub')return;
  LEN.hub.play(Math.random()<.5?'cheer':'spin');AU.sfx('success');
  const n=S.name.trim();TTS.say(n?('אֲנִי אוֹהֶבֶת אוֹתָךְ '+n+'!'):'כֵּיף לְשַׂחֵק אִתָּךְ!')});
 on('level-done',showDone);
 on('game-over',showGameOver);
 on('win',showWin);
 $('#btnStart').onclick=()=>{AU.ensure();AU.sfx('success');
  if(S.name.trim()){TTS.say('יַאלְלָה!');goHub();}
  else{showScreen('name');refreshAvatarUI();TTS.say('אֵיךְ קוֹרְאִים לָךְ?');}};
 /* בחירת שם: בועות מוכנות + שדה חופשי + דילוג */
 const presets=['לני','נועה','מאיה','אביב','שחר','יהלי','ליאם','דניאל','עמית','רני'];
 const namePresets=$('#namePresets');
 if(namePresets){namePresets.innerHTML='';
  presets.forEach(nm=>{const b=el('button','name-chip',nm);
   b.onclick=()=>{$('#nameInput').value=nm;
    namePresets.querySelectorAll('.name-chip').forEach(c=>c.classList.remove('sel'));
    b.classList.add('sel');AU.sfx('tap')};
   namePresets.appendChild(b)});}
 const goWithName=()=>{const v=($('#nameInput').value||'').trim();
  if(v){S.name=v;save();}
  AU.sfx('goal');TTS.say(v?('שָׁלוֹם '+v+'!'):'יַאלְלָה!');goHub();};
 $('#nameGo').onclick=goWithName;
 $('#nameSkip').onclick=()=>{AU.sfx('tap');goHub();};
 /* אווטר: צילום/העלאה, הקטנה ושמירה */
 const avIn=$('#avatarInput');
 $('#avatarCam').onclick=()=>{try{avIn.setAttribute('capture','user');}catch(_){/*noop*/}avIn.click();};
 avIn.addEventListener('change',()=>{const f=avIn.files&&avIn.files[0];
  if(!f)return;
  fileToAvatar(f,data=>{S.avatar=data;save();refreshAvatarUI();AU.sfx('power');
   TTS.say('וָואוּ! אַתְּ נִרְאֵית מְדַהִים!');});
  avIn.value='';});
 $('#avatarClear').onclick=()=>{S.avatar='';save();refreshAvatarUI();AU.sfx('tap');};
 /* בחירת מצב רוח: צורך רגשי + אוטונומיה */
 const moods=[['calm','רוֹגַע','בָּא לָךְ מַשֶּׁהוּ רָגוּעַ? גַּן הַצְּבָעִים מְחַכֶּה לָךְ'],
  ['adventure','הַרְפַּתְקָה','מַרְגִּישָׁה גִּבּוֹרָה? נַסִּי אֶת נִסְיוֹן הַגִּבּוֹרָה'],
  ['create','יְצִירָה','בָּא לָךְ לִיצֹר? גִּנַּת הַיְּצִירָה פְּתוּחָה']];
 const hubMoods=$('#hubMoods');
 if(hubMoods){hubMoods.innerHTML='';
  moods.forEach(m=>{const b=el('button','mood-btn');b.innerHTML='<span class="mi">'+moodIcon(m[0])+'</span> '+m[1];
   b.setAttribute('aria-label',m[1]);
   b.onclick=()=>{AU.sfx('tap');toast(m[2]);TTS.say(m[2])};
   hubMoods.appendChild(b)});}
 $('#btnDoneHome').onclick=()=>{AU.sfx('tap');goHub()};
 $('#btnRetry').onclick=()=>{AU.sfx('tap');fadeTo(()=>startWorld(RT.level))};
 $('#btnOverHome').onclick=()=>{AU.sfx('tap');goHub()};
 $('#btnWinHome').onclick=()=>{AU.sfx('tap');goHub()};
 $('#btnResume').onclick=()=>{$('#pauseM').classList.remove('show');RT.paused=false;AU.sfx('tap')};
 $('#btnPauseHome').onclick=()=>{$('#pauseM').classList.remove('show');RT.paused=false;goHub()};
 $('#hudPause').onclick=()=>togglePause();
 $('#hubStickers').onclick=()=>{AU.ensure();showStickers()};
 $('#hubGarden').onclick=()=>{AU.ensure();AU.sfx('open');showScreen('garden');renderGarden()};
 $('#gardenBack').onclick=()=>{AU.sfx('tap');goHub()};
 $('#storyBtn').onclick=()=>{S.storySeen=true;save();$('#story').classList.remove('show');
  AU.sfx('goal');LEN.hub.play('cheer');TTS.say('קדימה! בואי נאסוף את האורות');};
 $('#stickersBack').onclick=()=>{AU.sfx('tap');goHub()}}
