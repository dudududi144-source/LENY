# 🔒 SECURITY — מדיניות אבטחה

## עקרונות
1. **אין סודות בריפו** — לא בקוד, לא בקבצים, לא בהיסטוריה
2. `.gitignore` חוסם דפוסים נפוצים: `.env*`, `*token*`, `*secret*`, `*.pem`, `*.key`, `turso*`, `supabase*`, `cloudflare*`, `github_pat*`
3. המשחק עצמו: **אפס מעקב, אפס רשת** (מלבד טעינת הדף), אחסון מקומי בלבד (`localStorage`)

## אם מפתח נחשף
1. לבטל/לסובב מיידית במקור (GitHub → Settings → Tokens; וכו')
2. לבדוק Activity Log לשימוש חריג
3. להסיר מהיסטוריית Git אם הוכנס לריפו (`git filter-repo`)

## דיווח פגיעות
לפתוח Issue עם תווית `security` או ליצור קשר פרטי. אין להפרסם פרטי ניצול לפני תיקון.

## תלות חיצונית יחידה בזמן ריצה
- פונט Heebo מ-CDN (fontsource) — עם fallback ל-system-ui
