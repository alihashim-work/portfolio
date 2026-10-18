// Cache-first for heavy, versioned assets; network-first for the page itself.
const V='ah-portfolio-v1';
const CORE=['./','index.html','css/site.css','js/ui.js','js/studio.js','assets/img/poster.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  const heavy=/\/assets\//.test(u.pathname)||/cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(heavy){e.respondWith(caches.open(V).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==='opaque')c.put(e.request,n.clone());return n}))));return}
  if(u.origin===location.origin)e.respondWith(fetch(e.request).then(n=>{caches.open(V).then(c=>c.put(e.request,n.clone()));return n}).catch(()=>caches.match(e.request)));
});
