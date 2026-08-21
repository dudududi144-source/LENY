# 🧪 אסטרטגיית בדיקות

## רמות
1. **Unit** (`tests/*.test.js`, Vitest + jsdom)
   - `utils` — shuffle/clamp/rnd
   - `bus` — חוזה אירועים
   - `state` — התמדה ואיפוס
   - `physics` — מוצקות, שערים, נחיתה/תקרה, AABB
   - `levels` — ולידציית נתונים (תווים, P יחיד, יציאה, ≤3 שערים, פערים קפיצים)
   - `puzzles` — פתיחה/סגירה/קולבק, בניית חידה
2. **CI** — `.github/workflows/ci.yml` מריץ Lint + Tests בכל push/PR
3. **ידני** — צ'קליסט לפני שחרור:
   - [ ] פתיחה ב-Chrome/Android/iOS (Safari)
   - [ ] מצב לילה + הפעלה מחדש (Persistence)
   - [ ] איפוס מפינת הורים
   - [ ] offline (PWA): מצב טיסה → המשחק עובד
   - [ ] נגישות מקלדת מלאה

## הרצה
```
npm install
npm test          # הרצה חד-פעמית
npm run test:watch
npm run lint
```

## כללי כתיבת בדיקות בפרויקט
- בדיקה בודקת התנהגות, לא מימוש
- אין mock של DOM מעבר למה ש-jsdom נותן
- בדיקות דטרמיניסטיות: אין Math.random בתוך אסרשנים
