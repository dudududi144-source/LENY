/* game/content-bank.js — בנק תוכן מרכזי לחידות (M1 #8)
   כל סוג חידה שואב מכאן; הבנק נבדק אוטומטית ב-validateBank(). */

/* אותיות — 12 מילים עם ניקוד (סולם: זיהוי אות ← צליל ראשון) */
export const WORDS=[
 {w:'כֶּלֶב',e:'🐶',a:'כ'},{w:'חָתוּל',e:'🐱',a:'ח'},{w:'סוּס',e:'🐴',a:'ס'},
 {w:'פֶּרַח',e:'🌸',a:'פ'},{w:'בַּיִת',e:'🏠',a:'ב'},{w:'דָּג',e:'🐟',a:'ד'},
 {w:'שֶׁמֶשׁ',e:'🌞',a:'ש'},{w:'תַּפּוּחַ',e:'🍎',a:'ת'},{w:'עוּגָה',e:'🎂',a:'ע'},
 {w:'בָּלוֹן',e:'🎈',a:'ב'},{w:'יָרֵחַ',e:'🌙',a:'י'},{w:'גְּלִידָה',e:'🍦',a:'ג'}];

/* צבעים — זוגות חפץ↔צבע (סולם: צבע זהה ← צבע של חפץ) */
export const COLOR_OBJECTS=[
 ['🍓','#ff2e88'],['🍌','#ffd23e'],['🐸','#7dff5e'],['🌊','#4dc9ff'],['🍇','#b967ff'],
 ['🥕','#ff7a3c'],['🍊','#ff9f1c'],['🫐','#4d6dff']];

/* גדלים — שלשות קטן→גדול + פריט שלישי להסחה בסבב הסדרות */
export const SIZE_TRIPLES=[
 ['🐭','🐰','🐘'],['🐜','🐱','🦁'],['🐟','🐬','🐋'],['🍒','🍎','🎃'],['🌱','🌿','🌳']];

/* סדרות — תבניות לשלב "מה ממשיך?" */
export const PATTERN_BANK=[
 ['🔴','🔵','🟢'],['🟡','🟣','🟠'],['🍎','🍌','🍇'],['🐶','🐱','🐰']];

/* ולידציה אוטומטית של תקינות הבנק (רצה בבדיקות) */
export function validateBank(){
 const HEBSET=new Set(['א','ב','ג','ד','ה','ו','כ','פ','ח','ס','ש','ת','ע','י','מ','ל','ק','ר','נ','צ']);
 if(WORDS.length<10)return false;
 for(const w of WORDS){if(!w.w||!w.e||!HEBSET.has(w.a))return false;}
 if(COLOR_OBJECTS.length<5)return false;
 for(const [e,c] of COLOR_OBJECTS){if(!e||!/^#[0-9a-f]{6}$/i.test(c))return false;}
 if(SIZE_TRIPLES.length<5)return false;
 for(const t of SIZE_TRIPLES){if(new Set(t).size!==3)return false;}
 if(PATTERN_BANK.length<4)return false;
 for(const p of PATTERN_BANK){if(p.length!==3||new Set(p).size!==3)return false;}
 return true;}
