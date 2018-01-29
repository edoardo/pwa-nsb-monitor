import { actionTypes } from '../reducers';

export const setServiceWorker = serviceWorker => ({
    type: actionTypes.APP_SET_SERVICE_WORKER,
    payload: serviceWorker,
});
