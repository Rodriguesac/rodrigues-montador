const VERSION="rac-montador-static-v1";
const CORE=["./","./index.html","./catalogo-estatico.json","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",ev=>{ev.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",ev=>{ev.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x.startsWith("rac-montador-static-")&&x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",ev=>{
  const req=ev.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    ev.respondWith(fetch(req).then(res=>{if(res.ok){const c=res.clone();caches.open(VERSION).then(cache=>cache.put(req,c)).catch(()=>{});}return res;}).catch(async()=>await caches.match(req)||await caches.match("./index.html")||Response.error()));
    return;
  }
  if(req.destination==="image"){
    ev.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(async res=>{if(res.ok||res.type==="opaque"){const cache=await caches.open(VERSION);await cache.put(req,res.clone()).catch(()=>{});}return res;})));
  }
});