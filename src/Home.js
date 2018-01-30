import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import TrainRides from './TrainRides';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: this.props.match.params.stationId,
            stations: [{
                key: 0,
                id: 'EVV',
                name: 'Eidsvoll Verk',
                origins: ['Eidsvoll'],
                destinations: ['Kongsberg', 'Larvik', 'Skien']
            },
            {
                key: 1,
                id: 'NTH',
                name: 'Nationaltheatret',
                origins: ['Larvik','Kongsberg', 'Skien'],
                destinations: ['Eidsvoll']
            }]
        };

        // XXX
        this.props.history.push(`/station/${this.state.stations[0].id}`);
    }

    handleChange = (value) => {
        this.setState({ selectedTab: value });
        this.props.history.push(`/station/${value}`);
    };

    render() {
        return (
            <Tabs
                value={this.state.selectedTab}
                onChange={this.handleChange}
            >
            {
                this.state.stations.map(station =>
                    <Tab
                        key={station.key}
                        label={station.name}
                        value={station.id}
                    >
                        <TrainRides
                            stationId={station.id}
                            stationName={station.name}
                            origins={station.origins}
                            destinations={station.destinations}
                        />
                    </Tab>
                )
            }
            </Tabs>
        );
    }
}

export default Home;
