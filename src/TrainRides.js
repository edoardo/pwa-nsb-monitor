import React, { Component } from 'react';

import { Table, TableBody } from 'material-ui/Table';
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
            stationId: this.props.stationId,
            originName: this.props.originName,
            destinationName: this.props.destinationName
        }));
    }

    componentWillMount() {
        this.fetchRealTimeData();
    }

    render() {
        return (
            <Table style={{tableLayout: 'auto'}}>
                <TableBody>
                {
                    this.state.rides.map(ride =>
                        <TrainRide
                            key={ride.DatedVehicleJourneyRef}
                            details={ride}
                        />
                    )
                }
                </TableBody>
            </Table>
        );
    }
}

export default TrainRides;
