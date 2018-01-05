import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SocialNotificationsActive from 'material-ui/svg-icons/social/notifications-active';
import SocialNotificationsOff from 'material-ui/svg-icons/social/notifications-off';
import SocialNotificationsNone from 'material-ui/svg-icons/social/notifications-none';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notificationsState: Notification.permission
        };
    }

    handleRightIconClick = () => {
        const c = this;

        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission(permission => {
                c.setState({
                    notificationsState: permission
                });
            });
        }
    };

    render() {
        let rightIconType;
        let rightIconDisabled = true;

        switch (this.state.notificationsState) {
            case 'granted':
                rightIconType = <SocialNotificationsActive disabled={true} />;
                break;
            case 'denied':
                rightIconType = <SocialNotificationsOff />;
                break;
            default:
                rightIconType = <SocialNotificationsNone />;
                rightIconDisabled = false;
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
