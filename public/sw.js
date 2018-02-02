self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
    const rootUrl = new URL(`/nsb-monitor/#/station/${event.notification.data.stationId}`, location).href;

    event.notification.close();

    let appClient;

    event.waitUntil(async function() {
        const swClients = await clients.matchAll();

        for (const client of swClients) {
            const clientUrl = new URL(client.url);

            if (clientUrl.pathname === '/nsb-monitor/') {
                appClient = client;
                break;
            }
        }

        if (!appClient) {
            appClient = await clients.openWindow(`/nsb-monitor/#/station/${event.notification.data.stationId}`);
        }

        if (event.action === 'pause') {
            appClient.postMessage(JSON.stringify({ action: 'PAUSE_NOTIFICATIONS' }));
        } else if (event.action === 'snooze') {
            appClient.postMessage(JSON.stringify({ action: 'SNOOZE_NOTIFICATIONS' }));
        } else {
            if (appClient.url !== rootUrl) {
                await clients.openWindow(`/nsb-monitor/#/station/${event.notification.data.stationId}`);
            } else {
                appClient.focus();
            }
        }
    }());
});
