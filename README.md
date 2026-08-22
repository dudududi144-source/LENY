# 🌟 LENY — העולם של לני

![CI](https://github.com/dudududi144-source/LENY/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/dudududi144-source/LENY/actions/workflows/deploy-pages.yml/badge.svg)
![Version](https://img.shields.io/badge/version-2.7.0-7c4dff)
![License](https://img.shields.io/badge/license-MIT-22c55e)

**משחק היברידי לילדים: פלטפורמות × למידה** — כל שער נפתח בחידה חינוכית, והידע הופך לכוח (מגן, מגנט, כוכב). **Production-ready:** PWA עם offline, בדיקות, CI/CD, תיעוד מלא.

> איחוד של שני משחקים: *"לני — ההרפתקה הניאונית"* (פלטפורמות) ו*"לני הגיבורה"* (למידה לגיל הרך) — לארכיטקטורה מודולרית אחת.

---

## 🎮 מה יש בפנים

| עולם | תחום למידה | פרס |
|------|------------|-----|
| 🐾 אחו החיות | זיהוי חיות לפי קול | 💖 שמלת הלבבות |
| 🔷 מערות הצורות | התאמת צורות | 👒 כובע הקש |
| ✏️ פסגות האותיות | אותיות ומילים | 🎀 הפפיון |
| 🎵 ריצת המוזיקה | מקצבים וצלילים | 🖤 חצאית הטוטו |
| 💜 מבצר הרגשות | רגשות + **קרב בוס** | 👢 המגפיים |
| 🧮 מעבדת המספרים | ספירה וחשבון | 👑 הכתר |
| 🌈 גן הצבעים | התאמת צבעים | 🦋 הכנפיים |
| 🐘 עמק הגדלים | גדול/קטן + סדרות | 👓 המשקפיים |
| ⏰ מגדל השעות | קריאת שעון | 📿 השרשרת |
| 🏆 מבחן הגיבורה | **הכול + בוס סופי** | ✨ שרביט הקסם |

### מכניקות מפתח
- **שני מצבי משחק** — 🧒 *חוקר* (3–5): ללא כישלון, קפיצה נדיבה, עידוד קולי · 🎮 *הרפתקן* (6–8): האתגר המלא
- **שערי חוכמה** — חידה פותחת דרך **ומעניקה כוח** (Power-Learning)
- **בוס חכם** — כל מכה דורשת מענה על חידה
- **קושי מסתגל** — `skill` 0.7–1.15 + 3 רמות קושי בפינת הורים
- **TTS עברי** + **אודיו 100% סינתזה** (WebAudio, ללא קבצים)
- **דמות לני** — SVG מונפש עם 5 אביזרים נאספים
- **📔 מדבקות** — אלבום פרסים וכוכבי חוכמה

## 🚀 הרצה

```bash
npm install
npm start          # שרת מקומי ב-http://localhost:8000
npm test           # בדיקות (Vitest)
npm run lint       # ESLint
```

### GitHub Pages
הפעל ב-`Settings → Pages → Source: GitHub Actions`, וה-workflow `deploy-pages.yml` יפרסם אוטומטית בכל push ל-`main`.

### PWA
המשחק נרשם כ-Service Worker ועובד **אופליין** אחרי ביקור ראשון; ניתן להתקנה כיישום (manifest + אייקונים).

## 🕹️ שליטה
| פעולה | מקלדת | מגע |
|-------|--------|-----|
| תנועה | `←` `→` / `A` `D` | ◀ ▶ |
| קפיצה (כפולה!) | רווח / `↑` | ⤒ |
| השהיה | `P` | ⏸ |

## 📁 מבנה

```
LENY/
├── index.html            # שלד + PWA meta
├── manifest.webmanifest  # PWA
├── sw.js                 # Service Worker (offline-first)
├── css/main.css
├── js/
│   ├── main.js
│   ├── core/   utils · bus · state · audio · tts
│   ├── game/   levels · runtime · puzzles
│   ├── engine/ physics · renderer · engine
│   └── ui/     lenny · scenes · hud · parent · input · fx
├── tests/      6 סוויטות unit (Vitest + jsdom)
├── .github/workflows/  ci.yml · deploy-pages.yml
├── docs/       ARCHITECTURE · GDD · TESTING
├── classic/    lenny-heroine.html (המקור לעיון)
├── SECURITY.md · CONTRIBUTING.md · CHANGELOG.md
└── assets/     אייקוני PWA
```

## 🧪 איכות
- **בדיקות:** `npm test` — פיזיקה, שערים, חידות, state, bus, ולידציית שלבים
- **CI:** כל push/PR עובר lint + tests
- **CD:** deploy אוטומטי ל-GitHub Pages

## 📖 תיעוד
- [ארכיטקטורה](docs/ARCHITECTURE.md) · [עיצוב (GDD)](docs/GDD.md) · [בדיקות](docs/TESTING.md) · [אבטחה](SECURITY.md) · [תרומה](CONTRIBUTING.md)

## 🔒 אבטחה
`.gitignore` חוסם קבצי סודות; המשחק ללא מעקב וללא רשת. אם מפתח נחשף — בטלו אותו מיידית (ראה SECURITY.md).

## 📄 רישיון
[MIT](LICENSE)
