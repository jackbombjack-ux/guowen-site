/* 手機推播通知用的 Service Worker(只處理通知,不快取任何網頁,不會造成舊版殘留) */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  var title = d.title || '國文滿級分';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    icon: 'images/icon-192.png',
    badge: 'images/badge-96.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    lang: 'zh-Hant',
    data: { url: d.url || '/member.html' }
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var target = new URL((e.notification.data && e.notification.data.url) || '/member.html', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.split('#')[0] === target.split('#')[0] && 'focus' in c) return c.focus();
    }
    for (var j = 0; j < list.length; j++) {
      if ('navigate' in list[j] && 'focus' in list[j]) return list[j].focus().then(function (c) { return c.navigate(target); });
    }
    return self.clients.openWindow(target);
  }));
});
