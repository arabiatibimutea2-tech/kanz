/* Service worker: يحفظ كل ملفات الكتاب على الجهاز ليعمل بدون إنترنت */
const VERSION = 'kanz-v5';
const FILES = ["./", "index.html", "assets-f.js", "assets-h.js", "assets-k.js", "assets-m.js", "assets-r.js", "assets-s.js", "assets-t.js", "assets-taa.js", "assets-worm.js", "audio/fatha-words.mp3", "audio/q.mp3", "audio/s-words.mp3", "audio/words.mp3", "img/bell.png", "img/camel.png", "img/carrot.png", "img/dal-daftar.png", "img/dal-dalw.png", "img/dal-dam.png", "img/dal-daraj.png", "img/dal-darraja.png", "img/dal-dawa.png", "img/desert.jpg", "img/face-waw.webp", "img/gh-ghaba.webp", "img/gh-ghar.webp", "img/gh-ghasala.webp", "img/gh-ghawwasa.webp", "img/gh-ghayma.webp", "img/gh-ghazala.webp", "img/gh-sub.webp", "img/grandpa.png", "img/grasshopper.png", "img/guava.png", "img/hx-akala.webp", "img/hx-atasa.webp", "img/hx-daraba.webp", "img/hx-hamala.webp", "img/hx-kharaja.webp", "img/hx-nafakha.webp", "img/hx-nazala.webp", "img/hx-rabata.webp", "img/hx-rakada.webp", "img/hx-rakala.webp", "img/hx-sakaba.webp", "img/hx-wajada.webp", "img/ic-ghasala.webp", "img/ic-hadana.webp", "img/ic-haraba.webp", "img/ic-kasaba.webp", "img/ic-qafaza.webp", "img/ic-qataa.webp", "img/ic-saraqa.webp", "img/ic-zahafa.webp", "img/jar.png", "img/mk-akhadha-0.webp", "img/mk-akhadha-1.webp", "img/mk-akhadha-2.webp", "img/mk-batana-0.webp", "img/mk-batana-1.webp", "img/mk-batana-2.webp", "img/mk-batara-0.webp", "img/mk-batara-1.webp", "img/mk-batara-2.webp", "img/mk-faala-0.webp", "img/mk-faala-1.webp", "img/mk-faala-2.webp", "img/mk-hasada-0.webp", "img/mk-hasada-1.webp", "img/mk-hasada-2.webp", "img/mk-jahara-0.webp", "img/mk-jahara-1.webp", "img/mk-jahara-2.webp", "img/mk-masaka-0.webp", "img/mk-masaka-1.webp", "img/mk-masaka-2.webp", "img/mk-nataha-0.webp", "img/mk-nataha-1.webp", "img/mk-nataha-2.webp", "img/mk2-alif.webp", "img/mk2-ayn.webp", "img/mk2-ba.webp", "img/mk2-dal.webp", "img/mk2-dhal.webp", "img/mk2-fa.webp", "img/mk2-ha.webp", "img/mk2-ha2.webp", "img/mk2-jim.webp", "img/mk2-kaf.webp", "img/mk2-kha.webp", "img/mk2-lam.webp", "img/mk2-mim.webp", "img/mk2-nun.webp", "img/mk2-ra.webp", "img/mk2-sad.webp", "img/mk2-sin.webp", "img/mk2-ta.webp", "img/mk2-ta2.webp", "img/mk3-alif.svg", "img/mk3-ayn.svg", "img/mk3-ba.svg", "img/mk3-dal.svg", "img/mk3-dhal.svg", "img/mk3-fa.svg", "img/mk3-ha.svg", "img/mk3-ha2.svg", "img/mk3-jim.svg", "img/mk3-kaf.svg", "img/mk3-kha.svg", "img/mk3-lam.svg", "img/mk3-mim.svg", "img/mk3-nun.svg", "img/mk3-ra.svg", "img/mk3-sad.svg", "img/mk3-sin.svg", "img/mk3-ta.svg", "img/mk3-ta2.svg", "img/newspaper.png", "img/poster-dal.jpg", "img/poster.jpg", "img/rm-end.webp", "img/rm-map.webp", "img/rm-ship.webp", "img/rm-start.webp", "img/spinach.png", "img/tractor.png", "img/walnut.png", "print/connect-1.pdf", "print/connect-1.png", "print/connect-2.pdf", "print/connect-2.png", "print/connect-3.pdf", "print/connect-3.png", "print/seg-1.pdf", "print/seg-1.png", "print/seg-2.pdf", "print/seg-2.png", "print/seg-3.pdf", "print/seg-3.png", "print/sent-fatha.pdf", "print/sent-fatha.png", "video-alif.mp4", "video-ba.mp4", "video-dal.mp4", "video-fatha.mp4", "video-ghayn.mp4", "video-ha2.mp4", "video-jim.mp4", "video-sad.mp4", "video-ta.mp4", "video-ta2.mp4", "video-waw.mp4", "video-za2.mp4", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];
const EXTERNAL = [
  'https://cdn.tailwindcss.com/3.4.17',
  'https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@700;800&family=Tajawal:wght@500;700;900&family=Cairo:wght@700;900&family=Noto+Naskh+Arabic:wght@700&display=swap'
];

async function put(cache, url, opts) {
  try {
    const r = await fetch(url, Object.assign({ cache: 'reload' }, opts || {}));
    if (r.ok || r.type === 'opaque') { await cache.put(url, r.clone()); return r; }
  } catch (e) {}
  return null;
}

let READY = false, RUNNING = null;
async function precache() {
  const cache = await caches.open(VERSION);
  // الملفات المحلية: ملف فاشل لا يوقف تثبيت الباقي
  let i = 0;
  const queue = FILES.slice();
  async function worker() {
    while (queue.length) {
      const f = queue.shift();
      if (await cache.match(f)) continue;
      await put(cache, f);
      i++;
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  // Tailwind والخطوط من الإنترنت (أول مرة فقط)
  await put(cache, EXTERNAL[0], { mode: 'no-cors' });
  const css = await put(cache, EXTERNAL[1], { mode: 'cors' });
  if (css && css.type !== 'opaque') {
    try {
      const txt = await css.clone().text();
      const urls = [...new Set(txt.match(/https:\/\/fonts\.gstatic\.com\/[^)'"]+/g) || [])];
      await Promise.all(urls.map(u => put(cache, u, { mode: 'cors' })));
    } catch (e) {}
  }
  READY = true;
}

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(precache()); });
// إن أُغلق التطبيق أثناء التنزيل يُكمل الملفات الناقصة عند الفتح التالي
self.addEventListener('activate', e => e.waitUntil(precache()));

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

// دعم طلبات Range للفيديو والصوت (ضروري في آيفون)
async function rangeResponse(req, res) {
  const range = req.headers.get('range');
  if (!range || res.type === 'opaque') return res;
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const size = buf.byteLength;
  let start = m && m[1] ? +m[1] : 0;
  let end = m && m[2] ? +m[2] : size - 1;
  if (m && !m[1] && m[2]) { start = size - +m[2]; end = size - 1; }
  end = Math.min(end, size - 1);
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' && req.method !== 'HEAD') return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true, ignoreMethod: true, ignoreVary: true });
    if (hit) {
      if (req.method === 'HEAD') return new Response(null, { status: 200, headers: hit.headers });
      return rangeResponse(req, hit);
    }
    if (req.mode === 'navigate') {
      const idx = await cache.match('index.html');
      try { const r = await fetch(req); return r; } catch (err) { if (idx) return idx; throw err; }
    }
    try {
      const r = await fetch(req);
      // خطوط جوجل التي تُطلب لاحقًا تُحفظ أيضًا
      if (req.method === 'GET' && r && (r.ok || r.type === 'opaque') && /fonts\.(gstatic|googleapis)\.com|cdn\.tailwindcss\.com/.test(req.url)) {
        cache.put(req, r.clone());
      }
      return r;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});

// تقرير التقدّم للصفحة
self.addEventListener('message', async e => {
  if (e.data === 'progress') {
    if (!READY && !RUNNING) RUNNING = precache().finally(() => { RUNNING = null; });
    const cache = await caches.open(VERSION);
    const keys = await cache.keys();
    const local = keys.filter(k => k.url.startsWith(self.registration.scope)).length;
    e.source && e.source.postMessage({ type: 'progress', done: local, total: FILES.length, ready: READY });
  }
});
