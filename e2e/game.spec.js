/* e2e/game.spec.js — בדיקות קצה-לקצה מול דפדפן אמיתי (#24)
   כל לחיצה אופציונלית נבדקת קודם לנראות — אין המתנות אינסופיות */
import {test,expect} from '@playwright/test';

async function clickIfVisible(page, sel){
 const loc=page.locator(sel);
 if(await loc.isVisible()){await loc.click();return true;}
 return false;
}

/* כניסה מהפתיח לרכזת — עמידה עם/בלי שם, לפני ואחרי רענון */
async function resumeFromTitle(page){
 await page.waitForSelector('#btnStart');
 await page.click('#btnStart');
 await clickIfVisible(page,'#nameSkip');
 await clickIfVisible(page,'#storyBtn');
 await expect(page.locator('#scr-hub')).toBeVisible({timeout:8000});
}
async function startToHub(page, name){
 await page.goto('/');
 if(name){
  await page.click('#btnStart');
  await page.fill('#nameInput',name);
  await page.click('#nameGo');
  await clickIfVisible(page,'#storyBtn');
  await expect(page.locator('#scr-hub')).toBeVisible({timeout:8000});
 }else{await resumeFromTitle(page);}
}

test('המשחק נטען ללא שגיאות ומציג פתיח', async ({page})=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('/');
 await expect(page.locator('.intro-logo')).toBeVisible();
 await expect(page.locator('#btnStart')).toBeVisible();
 expect(errors).toEqual([]);
 expect(await page.evaluate(()=>window.__lenyErrors||[])).toEqual([]);
});

test('בחירת שם בפתיחה מופיעה בברכת הרכזת', async ({page})=>{
 await startToHub(page,'בדיקה');
 await expect(page.locator('#hubHello')).toContainText('בדיקה');
});

test('פתיחה → רכזת עם 10 עולמות + בחירת מצב רוח', async ({page})=>{
 await startToHub(page,'');
 await expect(page.locator('#hubBubbles .bubble')).toHaveCount(10);
 await expect(page.locator('#hubMoods .mood-btn')).toHaveCount(3);
});

test('כניסה לעולם 1 מציגה קנבס פעיל', async ({page})=>{
 await startToHub(page,'');
 await page.locator('#hubBubbles .bubble').first().click();
 await expect(page.locator('#wrap')).toBeVisible();
 await expect(page.locator('#cv')).toBeVisible();
});

test('גינת יצירה: מדבקה נשמרת בין טעינות (התמדה)', async ({page})=>{
 await startToHub(page,'');
 await page.click('#hubGarden');
 await expect(page.locator('#gardenStage')).toBeVisible();
 await page.locator('#gardenStage').click({position:{x:200,y:150}});
 await expect(page.locator('#gardenStage .gsticker')).toHaveCount(1);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('leny-world-v1')).garden);
 expect(stored.length).toBe(1);
 await page.reload();
 await resumeFromTitle(page);
 await page.click('#hubGarden');
 await expect(page.locator('#gardenStage .gsticker')).toHaveCount(1);
});

test('פרטיות: אפס בקשות מעקב/אנליטיקס (#19)', async ({page})=>{
 const TRACK=['google-analytics','analytics','facebook','fb.','doubleclick','hotjar','segment','amplitude','mixpanel','adsby'];
 const bad=[];
 page.on('request',r=>{const u=r.url().toLowerCase();
  if(TRACK.some(t=>u.includes(t)))bad.push(u);});
 await page.goto('/');
 await page.click('#btnStart');
 await page.waitForTimeout(1500);
 expect(bad).toEqual([]);});
