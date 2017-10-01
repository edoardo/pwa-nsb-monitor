import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import TrainRides from './TrainRides';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: (new Date().getHours() > 12 ? 1 : 0),
            stations: [{
                key: 0,
                id: '302e015dde84a2da8b779f16a00888a1e11783a4',
                name: 'Eidsvoll Verk',
                originName: 'Eidsvoll',
                destinationName: undefined
            },
            {
                key: 1,
                id: '441088887e8f9d98702a61c2da1d1cf353a1354e',
                name: 'Nationaltheatret',
                originName: undefined,
                destinationName: 'Eidsvoll'
            }]
        };
    }

    handleChange = (value) => {
        this.setState({ selectedTab: value });
    };

    render() {
        return (
            <main>
            <Tabs
                value={this.state.selectedTab}
                onChange={this.handleChange}
            >
            {
                this.state.stations.map(station =>
                    <Tab
                        key={station.key}
                        label={station.name}
                        value={station.key}
                    >
                        <TrainRides stationId={station.id} originName={station.originName} destinationName={station.destinationName} />
                    </Tab>
                )
            }
            </Tabs>
            </main>
        );
    }
}

export default Main;
