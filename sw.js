self.addEventListener('install', e=> self.skipWaiting());
self.addEventListener('activate', e=> self.clients.claim());
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  e.respondWith((async()=>{
    const cache = await caches.open('yoni-min');
    const cached = await cache.match(e.request);
    if(cached) return cached;
    try{
      const res = await fetch(e.request);
      if(res && res.status===200){ cache.put(e.request, res.clone()); }
      return res;
    }catch(_){
      return cached || new Response('',{status:200});
    }
  })());
});