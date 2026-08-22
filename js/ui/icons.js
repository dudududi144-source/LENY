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
