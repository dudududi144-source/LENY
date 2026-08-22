/* sw.js — Service Worker (offline-first) · גרסה עמידה 2.15
   שיפור קריטי: התקנה לא נכשלת על קובץ בודד, האצה מיידית (skipWaiting+claim) */
const CACHE='leny-v2.17.0';
const CORE=['/','/index.html','/css/main.css','/manifest.webmanifest',
 '/js/main.js','/js/core/utils.js','/js/core/bus.js','/js/core/state.js','/js/core/audio.js','/js/core/tts.js',
 '/js/game/levels.js','/js/game/runtime.js','/js/game/puzzles.js','/js/game/skill-model.js','/js/game/content-bank.js',
 '/js/engine/physics.js','/js/engine/renderer.js','/js/engine/engine.js',
 '/js/ui/lenny.js','/js/ui/scenes.js','/js/ui/hud.js','/js/ui/parent.js','/js/ui/input.js','/js/ui/fx.js','/js/ui/garden.js',
 '/assets/icon-192.png','/assets/icon-512.png'];

self.addEventListener('install',e=>{
 e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  for(const u of CORE){try{await c.add(u);}catch(_){/* קובץ אחד לא שובר התקנה */}}
  await self.skipWaiting();
 })());});

self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  const ks=await caches.keys();
  await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());});

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
   if(res.ok){try{const url=new URL(req.url);
    if(url.origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}}catch(_){/* noop */}}
   return res}).catch(()=>caches.match('/index.html'))))});
