import React, { Component } from 'react';

import { Table, TableBody } from 'material-ui/Table';
import './TrainRides.css';

import TrainRide from './TrainRide';

class TrainRides extends Component {
    constructor(props) {
        super(props);

        this.worker = new SharedWorker('js/shared-worker.js');
        this.worker.port.addEventListener('message', e => {
            const message = JSON.parse(e.data);

            switch (message.action) {
                case 'registerClient':
                    console.log('registerClient message', message);
                    this.clientId = message.clientId;

                    this.fetchRealTimeData();
                    break;
                case 'updateRealTime':
                    console.log('updateRealTime message', message);
                    const data = message.payload;
                    this.setState({ rides: data });
                    break;
                default:
                    console.log('noop');
            }
        });
        this.worker.port.start();

        this.state = {
            rides: []
        };
    }

    fetchRealTimeData() {
        this.worker.port.postMessage(JSON.stringify({
            action: 'fetchRealTimeData',
            clientId: this.clientId,
            stationId: this.props.stationId,
            originName: this.props.originName,
            destinationName: this.props.destinationName
        }));
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
