/* e2e/game.spec.js — בדיקות קצה-לקצה מול דפדפן אמיתי (#24) */
import {test,expect} from '@playwright/test';

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

test('פתיחה → רכזת עם 10 עולמות', async ({page})=>{
 await page.goto('/');
 await page.click('#btnStart');
 await expect(page.locator('#scr-hub')).toBeVisible();
 await expect(page.locator('#hubBubbles .bubble')).toHaveCount(10);
});

test('כניסה לעולם 1 מציגה קנבס פעיל', async ({page})=>{
 await page.goto('/');
 await page.click('#btnStart');
 await page.click('#storyBtn').catch(()=>{});
 await page.locator('#hubBubbles .bubble').first().click();
 await expect(page.locator('#wrap')).toBeVisible();
 await expect(page.locator('#cv')).toBeVisible();
});

test('גינת יצירה: מדבקה נשמרת בין טעינות (התמדה)', async ({page})=>{
 await page.goto('/');
 await page.click('#btnStart');
 await page.click('#storyBtn').catch(()=>{});
 await page.click('#hubGarden');
 await expect(page.locator('#gardenStage')).toBeVisible();
 await page.locator('#gardenStage').click({position:{x:200,y:150}});
 await expect(page.locator('#gardenCount')).toContainText('1 מדבקות');
 await page.reload();
 await page.click('#btnStart');
 await page.click('#hubGarden');
 await expect(page.locator('#gardenCount')).toContainText('1 מדבקות');
});
