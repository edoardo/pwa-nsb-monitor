export const actionTypes = {
    NOTIFICATIONS_SET_PERMISSION: 'NOTIFICATIONS_SET_PERMISSION',
    NOTIFICATIONS_SET_SNOOZE_START_TIME: 'NOTIFICATIONS_SET_SNOOZE_START_TIME',
    NOTIFICATIONS_SET_SNOOZE_TIMEOUT: 'NOTIFICATIONS_SET_SNOOZE_TIMEOUT',
    NOTIFICATIONS_TOGGLE_PAUSED: 'NOTIFICATIONS_TOGGLE_PAUSED',
};

const initialState = {
    paused: false,
    permission: Notification.permission,
    snoozeStartTime: 0,
    snoozeTimeout: 30 * 60 * 1000, // 30 minutes
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NOTIFICATIONS_SET_PERMISSION:
            return {
                ...state,
                permission: action.payload
            };
        case actionTypes.NOTIFICATIONS_SET_SNOOZE_START_TIME:
            return {
                ...state,
                snoozeStartTime: action.payload
            };
        case actionTypes.NOTIFICATIONS_SET_SNOOZE_TIMEOUT:
            return {
                ...state,
                snoozeTimeout: action.payload
            };
        case actionTypes.NOTIFICATIONS_TOGGLE_PAUSED:
            return {
                ...state,
                paused: !state.paused
            };
        default:
            return state;
    }
};
