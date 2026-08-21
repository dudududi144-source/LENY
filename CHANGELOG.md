# CHANGELOG

הפורמט מבוסס על Keep a Changelog.

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
