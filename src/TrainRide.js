import React, { Component } from 'react';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import './TrainRide.css';

const Time = ({ epoch }) => {
    const d = new Date(epoch);
    const time = `${ ('0' + d.getHours()).slice(-2)}:${ ('0' + d.getMinutes()).slice(-2)}`;

    return (
        <time dateTime={d.toISOString()}>{ time }</time>
    );
};

class TrainRide extends Component {
    render() {
        const details = this.props.details;

        return (
            <TableRow>
                <TableRowColumn>
                    <p className='expectedTime'><Time epoch={details.ExpectedDepartureTime} /></p>
                    {
                        (details.ExpectedDepartureTime !== details.AimedDepartureTime) &&
                            <p><s><Time epoch={details.AimedDepartureTime}/></s></p>
                    }
                </TableRowColumn>
                <TableRowColumn>
                    <span className='platform'>{details.AimedDeparturePlatformName}</span>
                </TableRowColumn>
                <TableRowColumn>
                    <p>
                    <span className={`lineId ${ details.LineID }`}>{details.LineID}</span>
                    <strong className='destinationName'>{details.DestinationName}</strong>
                    </p>
                    <p className='remarks'>{details.StopVisitNotePartOne} {details.StopVisitNote}</p>
                </TableRowColumn>
            </TableRow>
        );
    }
}

export default TrainRide;
