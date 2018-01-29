import { actionTypes } from '../reducers';

export const toggleNotificationsPaused = () => ({
    type: actionTypes.NOTIFICATIONS_TOGGLE_PAUSED,
});

export const setNotificationsPermission = permission => ({
    type: actionTypes.NOTIFICATIONS_SET_PERMISSION,
    payload: permission
});

export const setNotificationsSnoozeTimeout = timeout => ({
    type: actionTypes.NOTIFICATIONS_SET_SNOOZE_TIMEOUT,
    payload: timeout
});
