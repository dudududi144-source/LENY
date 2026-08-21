# CHANGELOG

הפורמט מבוסס על Keep a Changelog.

## [2.3.0] — עולם שביעי: גן הצבעים
### Added
- עולם 7 🌈 גן הצבעים: מפה חדשה (לבבות, מעופפים, פלטפורמות נעות)
- חידות צבעים: מציאת צבע זהה + התאמת צבע לחפץ (בננה/צפרדע/תות/ים)
- פריט לבוש חדש: כנפי פרפר 🦋 (קבוצת `acc-wings` בדמות + סגנון)
### Changed
- תנאי הניצחון: השלמת 7 עולמות; מסך הניצחון מציג את הכנפיים

## [2.2.0] — עולם שישי: מעבדת המספרים
### Added
- עולם 6 🧮 מעבדת המספרים: מפה חדשה (פלטפורמות נעות, מעופפים, קוצים)
- חידות חשבון: ספירת פריטים + חיבור (2 סבבים, מספר אפשרויות לפי רמת קושי)
- פריט לבוש חדש: כתר 👑 (קבוצת `acc-crown` בדמות + סגנון)
### Changed
- תנאי הניצחון: השלמת 6 עולמות; מסך הניצחון מציג את הכתר
- מד ההתקדמות ברכז דינמי (`/6`); גרסת מטמון SW עודכנה

## [2.1.0] — Production Hardening
### Added
- PWA: manifest, service worker (offline), אייקונים 192/512
- בדיקות: 6 סוויטות (utils, bus, state, physics, levels, puzzles) + Vitest
- CI: lint + tests; Deploy: GitHub Pages workflow
- תיעוד: GDD, TESTING, SECURITY, CONTRIBUTING, CHANGELOG
- כלי פיתוח: eslint, jsconfig, editorconfig, gitattributes, .nojekyll
### Changed
- index.html: מטה PWA + רישום SW

## [2.0.0] — Modular Architecture
### Added
- פירוק ממונוליט ל-19 מודולי ES (core/game/engine/ui)
- Event bus לצימוד מנוע↔מסכים
- מסך "המדבקות שלי", כפתור לילה מהיר, מד התקדמות
- שמירת המקור ב-`classic/lenny-heroine.html`
### Changed
- index.html הפך לשלד דק; CSS הופרד ל-`css/main.css`

## [1.1.0] — Restoration
- שחזור קובץ מלא לאחר דחיפה חלקית

## [1.0.0] — First Push
- הגרסה ההיברידית הראשונה (פלטפורמות × למידה) בקובץ יחיד
