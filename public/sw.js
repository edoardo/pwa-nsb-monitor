self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

const state = {
    clientApp: undefined,
    notifications: {
        timeoutId: null,
        snoozeTimeout: 0,
    }
};

const snoozeNotifications = () => {
    toggleNotifications();
    console.log('set timeout in sw', state.notifications);
    state.notifications.timeoutId = self.setTimeout(toggleNotifications, state.notifications.snoozeTimeout);
};

const toggleNotifications = () => state.clientApp.postMessage(JSON.stringify({ action: 'TOGGLE_NOTIFICATIONS' }));

self.addEventListener('message', event => {
    const message = JSON.parse(event.data);

    switch (message.action) {
        case 'SET_SNOOZE_TIMEOUT':
            console.log('setting snooze timeout in sw', message);
            state.notifications.snoozeTimeout = message.payload;
            break;
        case 'CLEAR_SNOOZE_TIMEOUT':
            console.log('clearTimeout in sw', message);
            self.clearTimeout(state.notifications.timeoutId);
        default:
            // noop;
    }
});

self.addEventListener('notificationclick', event => {
    const rootUrl = new URL(`/nsb-monitor/#/station/${event.notification.data.stationId}`, location).href;

    event.notification.close();

    let appClient;

    event.waitUntil(async function() {
        const swClients = await clients.matchAll();

        for (const client of swClients) {
            const clientUrl = new URL(client.url);

            if (clientUrl.pathname === '/nsb-monitor/') {
                state.clientApp = appClient = client;
                break;
            }
        }

        if (!appClient) {
            appClient = await clients.openWindow(`/nsb-monitor/#/station/${event.notification.data.stationId}`);
        }

        if (event.action === 'snooze') {
            snoozeNotifications();
        } else {
            if (appClient.url !== rootUrl) {
                await clients.openWindow(`/nsb-monitor/#/station/${event.notification.data.stationId}`);
            } else {
                appClient.focus();
            }
        }
    }());
});
