import { combineReducers } from 'redux';

import app, * as fromApp from './app';
import notifications, * as fromNotifications from './notifications';

export const actionTypes = {
    ...fromApp.actionTypes,
    ...fromNotifications.actionTypes,
};

export default combineReducers({
    app,
    notifications,
});
