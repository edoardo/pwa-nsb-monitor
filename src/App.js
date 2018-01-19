import React, { Fragment } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from './Header';
import Main from './Main';

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

const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router
            basename="/nsb-monitor/"
        >
            <Fragment>
                <Header/>
                <Main/>
            </Fragment>
        </Router>
    </MuiThemeProvider>
);

export default App;
