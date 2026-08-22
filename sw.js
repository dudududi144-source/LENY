/* sw.js — Service Worker: offline-first PWA
   אסטרטגיה: precache לנכסי ליבה + cache-first עם נפילה לרשת */
const CACHE='leny-v2.9.0';
const CORE=['/','/index.html','/css/main.css','/manifest.webmanifest',
 '/js/main.js','/js/core/utils.js','/js/core/bus.js','/js/core/state.js','/js/core/audio.js','/js/core/tts.js',
 '/js/game/levels.js','/js/game/runtime.js','/js/game/puzzles.js',
 '/js/engine/physics.js','/js/engine/renderer.js','/js/engine/engine.js',
 '/js/ui/lenny.js','/js/ui/scenes.js','/js/ui/hud.js','/js/ui/parent.js','/js/ui/input.js','/js/ui/fx.js',
 '/assets/icon-192.png','/assets/icon-512.png'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});

self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim()))});

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
   if(res.ok){try{const url=new URL(req.url);
    if(url.origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}}catch(_){/* noop */}}
   return res}).catch(()=>caches.match('/index.html'))))});
