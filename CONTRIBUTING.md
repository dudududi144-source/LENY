# 🤝 CONTRIBUTING

## תחילת עבודה
```
git clone https://github.com/dudududi144-source/LENY.git
cd LENY
npm install
npm start        # שרת מקומי
npm test         # בדיקות
npm run lint     # לינט
```

## סטנדרטים
- ES Modules בלבד, ללא תלויות ריצה חדשות
- שמות פונקציות באנגלית; טקסטים לילדים בעברית עם ניקוד
- כל שינוי התנהגותי = בדיקה ב-`tests/`
- הודעות commit בסגנון Conventional: `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`

## PR
1. Branch מ-`main`
2. CI ירוק (lint + tests)
3. תיאור קצר + צילום מסך לשינויי UI
4. סקירה: בעל הריפו

## מבנה מודולים
ראה [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — כללים: תלויות יורדות בלבד, תקשורת מנוע↔מסכים דרך `bus`.
