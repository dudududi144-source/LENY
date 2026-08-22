/* ui/icons.js — סט אייקונים וקטורי אחיד (Design System)
   שפת עיצוב אחידה: viewBox 48, stroke=currentColor, עובי 3, קצוות מעוגלים, fill none.
   מחליף אמוג'י ב-UI כדי שהמשחק ייראה כמוצר סטודיו, לא ניסוי.
   הצבע נקבע ע"י CSS (currentColor) לפי ערכת העולם. */
const S='fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const wrap=(inner)=>`<svg viewBox="0 0 48 48" ${S} aria-hidden="true">${inner}</svg>`;
export const WORLD_ICONS=[
 wrap('<circle cx="17" cy="16" r="4"/><circle cx="31" cy="16" r="4"/><path d="M24 22c-6 0-11 5-11 10 0 4 3 6 6 6 3 0 4-1 5-1s2 1 5 1c3 0 6-2 6-6 0-5-5-10-11-10z"/>'),
 wrap('<circle cx="14" cy="14" r="7"/><rect x="27" y="8" width="14" height="14" rx="3"/><path d="M24 28l9 13H15z"/>'),
 wrap('<path d="M24 12c-4-3-9-4-15-4v26c6 0 11 1 15 4 4-3 9-4 15-4V8c-6 0-11 1-15 4z"/><path d="M24 12v26"/>'),
 wrap('<path d="M18 34V10l16-4v24"/><circle cx="13" cy="34" r="5"/><circle cx="29" cy="30" r="5"/>'),
 wrap('<circle cx="24" cy="24" r="16"/><path d="M17 20v1M31 20v1"/><path d="M16 28c2 4 6 6 8 6s6-2 8-6"/>'),
 wrap('<path d="M14 10h20M14 24h20M14 38h20"/><circle cx="33" cy="10" r="3" fill="currentColor"/><circle cx="15" cy="24" r="3" fill="currentColor"/><circle cx="33" cy="38" r="3" fill="currentColor"/>'),
 wrap('<path d="M8 32a16 16 0 0 1 32 0"/><path d="M15 32a9 9 0 0 1 18 0"/><path d="M8 32h6M34 32h6"/>'),
 wrap('<circle cx="17" cy="26" r="11"/><circle cx="34" cy="17" r="6"/>'),
 wrap('<circle cx="24" cy="24" r="16"/><path d="M24 14v10l7 5"/>'),
 wrap('<path d="M8 34l3-16 8 7 5-10 5 10 8-7 3 16z"/><path d="M8 38h32"/>')
];
export function worldIcon(i){return WORLD_ICONS[i]||WORLD_ICONS[0];}
export default WORLD_ICONS;

/* אייקוני מצבי-רוח (רכזת) — אותה שפה אחידה */
export const MOOD_ICONS={
 calm:wrap('<path d="M8 28c4-5 8-5 12 0s8 5 12 0 8-5 12 0"/><path d="M8 36c4-5 8-5 12 0s8 5 12 0 8-5 12 0"/>'),
 adventure:wrap('<path d="M10 38l9-16 6 9 5-8 9 15z"/><path d="M19 22v-8l6 3-6 3"/>'),
 create:wrap('<path d="M24 8a16 16 0 1 0 0 32c3 0 4-2 4-4s-1-3 0-5 3-2 5-2h4a8 8 0 0 0 8-8c0-8-8-15-17-15z"/><circle cx="17" cy="18" r="2.5"/><circle cx="26" cy="14" r="2.5"/><circle cx="14" cy="27" r="2.5"/>')
};
/* אייקוני כוחות (HUD) — מגן/מגנט/כוכב */
export const POWER_ICONS={
 shield:wrap('<path d="M24 6l14 6v10c0 10-6 16-14 20-8-4-14-10-14-20V12z"/>'),
 magnet:wrap('<path d="M14 8v14a10 10 0 0 0 20 0V8"/><path d="M14 8h7v8h-7zM27 8h7v8h-7z"/>'),
 star:wrap('<path d="M24 6l5 11 12 1-9 8 3 12-10-6-10 6 3-12-9-8 12-1z"/>')
};
export function moodIcon(k){return MOOD_ICONS[k]||MOOD_ICONS.calm;}
export function powerIcon(k){return POWER_ICONS[k]||POWER_ICONS.star;}

/* אייקוני חיות וקטוריים בשפה האחידה (מחליפים אמוג'י בחידת החיות) */
const A='fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const aw=(i)=>`<svg viewBox="0 0 48 48" ${A} aria-hidden="true">${i}</svg>`;
export const ANIMAL_ICONS={
 dog:aw('<circle cx="24" cy="26" r="12"/><path d="M14 18c-4-6 2-10 6-8M34 18c4-6-2-10-6-8"/><circle cx="20" cy="24" r="1.6" fill="currentColor"/><circle cx="28" cy="24" r="1.6" fill="currentColor"/><path d="M24 28v3M24 31c-2 2-4 2-5 1M24 31c2 2 4 2 5 1"/>'),
 cat:aw('<circle cx="24" cy="26" r="12"/><path d="M14 20l-3-9 8 4M34 20l3-9-8 4"/><circle cx="20" cy="24" r="1.6" fill="currentColor"/><circle cx="28" cy="24" r="1.6" fill="currentColor"/><path d="M10 26h6M32 26h6"/>'),
 cow:aw('<circle cx="24" cy="26" r="12"/><path d="M14 16c-3-4 1-7 4-6M34 16c3-4-1-7-4-6"/><ellipse cx="24" cy="30" rx="6" ry="4"/><circle cx="22" cy="30" r="1.2" fill="currentColor"/><circle cx="26" cy="30" r="1.2" fill="currentColor"/>'),
 pig:aw('<circle cx="24" cy="26" r="12"/><path d="M15 16l-4-5M33 16l4-5"/><ellipse cx="24" cy="28" rx="5" ry="4"/><circle cx="22" cy="28" r="1.2" fill="currentColor"/><circle cx="26" cy="28" r="1.2" fill="currentColor"/>'),
 rabbit:aw('<circle cx="24" cy="28" r="11"/><path d="M18 18c-3-8 1-12 4-10M30 18c3-8-1-12-4-10"/><circle cx="20" cy="26" r="1.6" fill="currentColor"/><circle cx="28" cy="26" r="1.6" fill="currentColor"/>')
};
export function animalIcon(k){return ANIMAL_ICONS[k]||ANIMAL_ICONS.dog;}
