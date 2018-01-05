const fetchRealTimeData = async (payload) => {
    const { stationId, stationName, origins, destinations } = payload;

    const params = new URLSearchParams();
    params.append('MonitoringRef', stationId);
    params.append('StopVisitTypes', 'departures');
    params.append('MaximumStopVisits', 12);

    if (destinations.length === 1) {
        params.append('DirectionRef', destinations[0]); // XXX TODO see how to handle multiple destinations, multiple fetch or filtering after?
        params.append('MaximumStopVisits', 4);
    }

    fetch('/nsb-monitor/rtd?' + params.toString())
    .then(response => {
        if (response.ok) {
            return response.text();
        }
    })
    .then(xml => {
        // DOMParser is not available in workers :(
        postMessage(JSON.stringify({
            action: 'parseXMLResponse',
            payload: xml
        }));

        return payload;
    })
    .catch(error => {
        console.error(`Fetch error for real time data for station ${ stationId } (${ error.message })`);

        return payload;
    })
    // enter loop
    // TODO find a better way!
    .then(payload => {
        setTimeout(fetchRealTimeData, 60000, payload);
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
