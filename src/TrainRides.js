import React, { Component } from 'react';

import CircularProgress from 'material-ui/CircularProgress';
import { List } from 'material-ui/List';

import TrainRide from './TrainRide';

class TrainRides extends Component {
    constructor(props) {
        super(props);

        this.serviceWorker = navigator.serviceWorker;
        this.worker = new Worker('js/xml-worker.js');
        this.worker.addEventListener('message', e => {
            const message = JSON.parse(e.data);

            switch (message.action) {
                case 'updateRealTime':
                    console.log('updateRealTime message', message);
                    const data = message.payload;
                    this.setState({ rides: data });
                    break;
                case 'parseXMLResponse':
                    const xml = message.payload;
                    this.parseResponse(xml);
                    break;
                default:
                    console.log('noop');
            }
        });

        this.state = {
            rides: []
        };
    }

    componentWillMount() {
        this.fetchRealTimeData();
    }

    // TODO move to separate file
    parseResponse = (xml) => {
        const parser = new DOMParser();

        const dom = parser.parseFromString(xml, 'text/xml');

        if (dom.documentElement.nodeName === 'parsererror') {
            throw new Error('XML parse failed');
        }

        const destinations = new Set(this.props.destinations);

        // NB: querySelectorAll returns a NodeList object not an Array
        const rides = [ ...dom.querySelectorAll('MonitoredStopVisit') ];

        const convertedRides = rides
            .filter(ride => destinations.has(ride.querySelector('DestinationName').innerHTML))
            .map(ride => {
                const filteredRide = {
                    LineRef: ride.querySelector('LineRef').innerHTML,
                    DestinationName: ride.querySelector('DestinationName').innerHTML,
                    ItemIdentifier: ride.querySelector('ItemIdentifier').innerHTML,
                };

                const monitoredCall = ride.querySelector('MonitoredCall');

                [
                    'VehicleAtStop',
                    'ArrivalStatus', 'DepartureStatus',
                    'AimedDepartureTime', 'ExpectedDepartureTime', 'DeparturePlatformName',
                ].forEach(detail => {
                    filteredRide[detail] = monitoredCall.querySelector(detail).innerHTML;
                });

                const MonitoredVehicleJourney = ride.querySelector('MonitoredVehicleJourney');

                filteredRide.OperatorRef = MonitoredVehicleJourney.querySelector('OperatorRef').innerHTML;

                const via = [...MonitoredVehicleJourney.querySelectorAll('Via')].map(
                        via => via.querySelector('PlaceName').innerHTML
                    ).join(', ');

                if (via) {
                    filteredRide.Via = 'via ' + via;
                }

                return filteredRide;
         });

        this.setState({ rides: convertedRides });

        if (Notification.permission === 'granted') {
            // XXX notification only for the next ride?!
            this.sendNotification({ id: this.props.stationId, name: this.props.stationName }, convertedRides[0]);
        }
    };

    sendNotification = (station, ride) => {
        if (ride) {
            let requiresNotification = false;

            const formatTime = (time) => {
                const t = new Date(time);

                return `${ ('0' + t.getHours()).slice(-2) }:${ ('0' + t.getMinutes()).slice(-2) }`;
            };

            const aimedTime = formatTime(ride.AimedDepartureTime);
            const expectedTime = formatTime(ride.ExpectedDepartureTime);

            let title = 'Train ';
            let message = `${ ride.LineRef } ${ ride.DestinationName } (${ aimedTime })`;

            if (aimedTime !== expectedTime) {
                requiresNotification = true;

                title += `delayed at ${ station.name }`;
                message += ` - new time ${ expectedTime }`;
            }
            else if ((ride.ArrivalStatus + ride.DepartureStatus).match(/cancelled/i)) {
                requiresNotification = true;

                title += `cancelled at ${ station.name }`;
            }

            if (requiresNotification) {
                this.serviceWorker.getRegistration()
                    .then(reg => {
                        reg.showNotification(
                            title,
                            {
                                body: message,
                                icon: 'img/icon-128x128.png',
                                vibrate: [200, 100, 200],
                                tag: ride.ItemIdentifier,
                                data: {
                                    stationId: station.id,
                                    stationName: station.name
                                }
                            }
                        );
                    });
            }
        }
    };

    fetchRealTimeData = () => {
        this.worker.postMessage(JSON.stringify({
            action: 'fetchRealTimeData',
            payload: {
                stationId: this.props.stationId,
                stationName: this.props.stationName,
                origins: this.props.origins,
                destinations: this.props.destinations
            }
        }));
    };

    render() {
        if (this.state.rides.length > 0) {
            return (
                <List>
                {
                    this.state.rides.map(ride =>
                        <TrainRide
                            key={ride.ItemIdentifier}
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
