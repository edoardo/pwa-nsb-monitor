const clients = [];

const fetchRealTimeData = async ({ clientId, stationId, originName, destinationName }) => {
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

            // send back data only to the correct client
            clients[clientId].postMessage(JSON.stringify({
                action: 'updateRealTime',
                payload: rides
            }));
        }
    })
    .catch(error => {
        console.error(`Fetch error for real time data for station ${ stationId } (${ error.message })`);
    });
};

const onMessage = async (message) => {
    switch (message.action) {
        case 'fetchRealTimeData':
            await fetchRealTimeData(message);
            break;
        default:
            console.log('noop');
    }
};

self.addEventListener('connect', e => {
    const port = e.ports[0];

    clients.push(port);

    port.addEventListener('message', e => {
        onMessage(JSON.parse(e.data));
    });

    port.start();

    port.postMessage(JSON.stringify({
        action: 'registerClient',
        clientId: clients.length - 1
    }));
});
