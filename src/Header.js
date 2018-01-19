import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SocialNotificationsActive from 'material-ui/svg-icons/social/notifications-active';
import SocialNotificationsNone from 'material-ui/svg-icons/social/notifications-none';
import SocialNotificationsOff from 'material-ui/svg-icons/social/notifications-off';
import SocialNotificationsPaused from 'material-ui/svg-icons/social/notifications-paused';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notificationsState: Notification.permission,
            notificationsSnooze: false,
        };
    }

    toggleNotificationsSnooze = () => {
        this.setState({ notificationsSnooze: !this.state.notificationsSnooze });
    };

    handleRightIconClick = () => {
        const notificationsState = this.state.notificationsState;

        if (notificationsState !== 'granted' && notificationsState !== 'denied') {
            Notification.requestPermission(permission => {
                this.setState({
                    notificationsState: permission
                });
            });
        } else if (notificationsState === 'granted') {
            this.toggleNotificationsSnooze();
        }
    };

    render() {
        let rightIconType;
        let rightIconDisabled = false;

        switch (this.state.notificationsState) {
            case 'granted':
                rightIconType = this.state.notificationsSnooze ? <SocialNotificationsPaused /> : <SocialNotificationsActive />;
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
                onRightIconButtonTouchTap={this.handleRightIconClick}
            />
            </header>
        );
    }
}

export default Header;
