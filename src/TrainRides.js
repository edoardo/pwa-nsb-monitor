import React, { Component } from 'react';

import CircularProgress from 'material-ui/CircularProgress';
import { List } from 'material-ui/List';
import './TrainRides.css';

import TrainRide from './TrainRide';

class TrainRides extends Component {
    constructor(props) {
        super(props);

        this.worker = new Worker('js/worker.js');
        this.worker.addEventListener('message', e => {
            const message = JSON.parse(e.data);

            switch (message.action) {
                case 'updateRealTime':
                    console.log('updateRealTime message', message);
                    const data = message.payload;
                    this.setState({ rides: data });
                    break;
                default:
                    console.log('noop');
            }
        });

        this.state = {
            rides: []
        };
    }

    fetchRealTimeData() {
        this.worker.postMessage(JSON.stringify({
            action: 'fetchRealTimeData',
            payload: {
                stationId: this.props.stationId,
                originName: this.props.originName,
                destinationName: this.props.destinationName
            }
        }));
    }

    componentWillMount() {
        this.fetchRealTimeData();
    }

    render() {
        if (this.state.rides.length > 0) {
            return (
                <List>
                {
                    this.state.rides.map(ride =>
                        <TrainRide
                            key={ride.DatedVehicleJourneyRef}
                            details={ride}
                        />
                    )
                }
                </List>
            );
        }
        else {
            return (
                <CircularProgress
                    color='#d52b1e'
                    size={30}
                    thickness={2.6}
                    style={{margin: '1em 50%', left: -15}}
                />
            );
        }
    }
}

export default TrainRides;
