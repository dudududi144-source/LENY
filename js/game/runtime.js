/* game/runtime.js — מצב ריצה משותף (מוטציות מבוקרות בלבד) */

/* RT — כל מה שקורה "עכשיו" על המסך (לא נשמר ב-localStorage) */
export const RT={
 screen:'title',      // title|hub|play|done|over|win|stickers
 paused:false, puzzleBusy:false,
 level:0, score:0, coins:0, lives:3,
 theme:null, player:null, cam:null,
 ents:[], parts:[], texts:[],
 levelMap:[], cols:0, rows:0,
 boss:null, gates:[], deco:[],
 shake:0, time:0, invuln:0, hintTimer:0, curHint:'', dying:0,
 powers:{shield:false,magnet:0,star:0},
 combo:0, comboT:0,
 levelCoins:0, levelCoinsTotal:0, gatesSolvedNow:0,
 skill:1
};

/* מקלדת/מגע */
export const keys={l:false,r:false,j:false};

/* מופעי דמות לני (מתמלאים ב-main) */
export const LEN={};
