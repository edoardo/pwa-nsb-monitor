const fetchRealTimeData = async (payload) => {
    const { stationId, originName, destinationName } = payload;

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
        }
    })
    .catch(error => {
        console.error(`Fetch error for real time data for station ${ stationId } (${ error.message })`);
    });
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
