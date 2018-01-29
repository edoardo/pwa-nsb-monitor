export const actionTypes = {
    NOTIFICATIONS_TOGGLE_PAUSED: 'NOTIFICATIONS_TOGGLE_PAUSED',
    NOTIFICATIONS_SET_PERMISSION: 'NOTIFICATIONS_SET_PERMISSION',
    NOTIFICATIONS_SET_SNOOZE_TIMEOUT: 'NOTIFICATIONS_SET_SNOOZE_TIMEOUT',
};

const initialState = {
    permission: Notification.permission,
    paused: false,
    snoozeTimeout: 30 * 60 * 1000, // 30 minutes
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NOTIFICATIONS_SET_PERMISSION:
            return {
                ...state,
                permission: action.payload
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
