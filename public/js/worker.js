const fetchRealTimeData = (payload) => {
    const { stationId, stationName, originName, destinationName } = payload;

    const formData = new FormData();
    formData.append('ID', stationId);

    fetch('https://beta.sabadelli.it/nsb-monitor/rtd',
        {
            method: 'POST',
            body: formData
        }
    )
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(realTimeData => {
        if (realTimeData.Siri && realTimeData.Siri.length > 0) {
            const rides =
                realTimeData.Siri
                .filter(ride => {
                    if (originName) {
                        return ride.OriginName === originName;
                    }
                    else if (destinationName) {
                        return ride.DestinationName === destinationName;
                    }
                })
                .map(ride => {
                    const details = [
                        'LineID',
                        'DestinationDisplay', 'DestinationName',
                        'AimedArrivalTime', 'ExpectedArrivalTime', 'AimedArrivalPlatformName', 'ArrivalPlatformName',
                        'AimedDepartureTime', 'ExpectedDepartureTime', 'AimedDeparturePlatformName', 'DeparturePlatformName',
                        'StopVisitNotePartOne', 'StopVisitNote', 'DatedVehicleJourneyRef',
                    ];

                    let filteredRide = {};

                    details.forEach(detail => {
                        filteredRide[detail] = ride[detail];
                    });

                    return filteredRide;
                });

            postMessage(JSON.stringify({
                action: 'updateRealTime',
                payload: rides
            }));

            // notification!
            if (Notification.permission === 'granted') {
                sendNotification(stationName, rides[0]);
            }

            // for chaining
            return payload;
        }
    })
    .catch(error => {
        console.error(`Fetch error for real time data for station ${ stationId } (${ error.message })`);
    })
    // enter loop
    .then(payload => {
        setTimeout(fetchRealTimeData, 60000, payload);
    });
};

const sendNotification = (stationName, ride) => {
    if (ride) {
        let requireNotification = false;

        const aimedTime = new Date(ride.AimedDepartureTime);

        let title = 'Train ';
        let message = `${ ride.LineID } ${ ride.DestinationName } (${ ('0' + aimedTime.getHours()).slice(-2) }:${ ('0' + aimedTime.getMinutes()).slice(-2) })`;

        if (ride.AimedDepartureTime !== ride.ExpectedDepartureTime) {
            requireNotification = true;

            const expectedTime = new Date(ride.ExpectedDepartureTime);

            title += `delayed at ${ stationName }`;
            message += ` - new time ${ ('0' + expectedTime.getHours()).slice(-2) }:${ ('0' + expectedTime.getMinutes()).slice(-2) }`;
        }
        else if ((ride.StopVisitNotePartOne + ride.StopVisitNote).match(/(Innstilt|Cancelled)/)) {
            requireNotification = true;

            title += `cancelled at ${ stationName }`;
        }

        requireNotification && new Notification(
            title,
            {
                body: message,
                icon: '../img/icon-128x128.png',
                vibrate: [200, 100, 200]
            }
        );
    }
};

const onMessage = async (message) => {
    switch (message.action) {
        case 'fetchRealTimeData':
            await fetchRealTimeData(message.payload);
            break;
        default:
            console.log('noop');
    }
};

self.addEventListener('message', e => {
    onMessage(JSON.parse(e.data));
});
