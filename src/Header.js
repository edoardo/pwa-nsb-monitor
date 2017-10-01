import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
    render() {
        return (
            <header>
            <AppBar
                title="NSB real time monitor"
            />
            </header>
        );
    }
}

export default Header;
