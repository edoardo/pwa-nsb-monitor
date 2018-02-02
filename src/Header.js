import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SocialNotificationsActive from 'material-ui/svg-icons/social/notifications-active';
import SocialNotificationsNone from 'material-ui/svg-icons/social/notifications-none';
import SocialNotificationsOff from 'material-ui/svg-icons/social/notifications-off';
import SocialNotificationsPaused from 'material-ui/svg-icons/social/notifications-paused';

import { toggleNotificationsPaused, setNotificationsPermission } from './actions/notifications';

const Header = props => {
    const {
        serviceWorker,
        notificationsPermission,
        notificationsPaused,
        setNotificationsPermission,
        toggleNotificationsPaused,
    } = props;

    const handleRightIconClick = () => {
        if (notificationsPermission !== 'granted' && notificationsPermission !== 'denied') {
            Notification.requestPermission(permission => {
                setNotificationsPermission(permission);
            });
        } else if (notificationsPermission === 'granted') {
            if (notificationsPaused) {
                serviceWorker.controller.postMessage(JSON.stringify({
                    action: 'CLEAR_SNOOZE_TIMEOUT'
                }));
            }

            toggleNotificationsPaused();
        }
    };

    let rightIconType;
    let rightIconDisabled = false;

    switch (notificationsPermission) {
        case 'granted':
            rightIconType = notificationsPaused ? <SocialNotificationsPaused /> : <SocialNotificationsActive />;
            break;
        case 'denied':
            rightIconType = <SocialNotificationsOff />;
            rightIconDisabled = true;
            break;
        default:
            rightIconType = <SocialNotificationsNone />;
    }

    return (
        <header>
        <AppBar
            title="NSB real time monitor"
            showMenuIconButton={false} // TODO implement settings here!
            iconElementRight={
                <IconButton
                    disabled={rightIconDisabled}
                >
                    {rightIconType}
                </IconButton>
            }
            onRightIconButtonTouchTap={handleRightIconClick}
        />
        </header>
    );
};

export default connect(
    state => ({
        serviceWorker: state.app.serviceWorker,
        notificationsPaused: state.notifications.paused,
        notificationsPermission: state.notifications.permission,
    }),
    {
        toggleNotificationsPaused,
        setNotificationsPermission,
    }
)(Header);
