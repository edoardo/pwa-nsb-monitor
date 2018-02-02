import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from './Header';
import Main from './Main';

import { toggleNotificationsPaused, setNotificationsSnoozeStartTime } from './actions/notifications';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#fff',
        primary2Color: '#fff',
        primary3Color: '#ccc',
        accent1Color: '#d52b1e',
        accent2Color: '#ff6348',
        accent3Color: '#9b0000',
        textColor: 'rgba(0,0,0,255)',
        alternateTextColor: 'rgba(0,0,0,255)'
    }
});

class App extends Component {
    constructor(props) {
        super(props);

        const {
            serviceWorker,
            toggleNotificationsPaused,
            setNotificationsSnoozeStartTime,
        } = this.props;

        serviceWorker.addEventListener('message', e => {
            const message = JSON.parse(e.data);

            if (message.action === 'SNOOZE_NOTIFICATIONS') {
                toggleNotificationsPaused();
                setNotificationsSnoozeStartTime(Date.now());
            }
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Router>
                    <Fragment>
                        <Header/>
                        <Main/>
                    </Fragment>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default connect(
    state => ({
        serviceWorker: state.app.serviceWorker,
    }),
    {
        toggleNotificationsPaused,
        setNotificationsSnoozeStartTime,
    }
)(App);
