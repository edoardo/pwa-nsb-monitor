self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
    const rootUrl = new URL('/nsb-monitor/', location).href;

    event.notification.close();

    // open app
    event.waitUntil(
        clients.matchAll().then(matchedClients => {
            for (let client of matchedClients) {
                if (client.url === rootUrl) {
                    return client.focus();
                }
            }

            return clients.openWindow(`/nsb-monitor/#/station/${event.notification.data.stationId}`);
        })
    );
});
