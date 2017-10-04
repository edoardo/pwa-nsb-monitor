import React, { Component } from 'react';

import { ListItem } from 'material-ui/List';
import AlertWarning from 'material-ui/svg-icons/alert/warning';

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

        let hasWarning = false;

        if (details.ExpectedDepartureTime !== details.AimedDepartureTime ||
            (details.StopVisitNotePartOne + details.StopVisitNote).match(/(Innstilt|Cancelled)/)) {
            hasWarning = true;
        }

        return (
            <ListItem
                leftIcon={
                    hasWarning ? <AlertWarning /> : undefined

                }
                insetChildren={true}
                primaryText={
                    <div className="train-ride-line1">
                        <div className="spaced">
                        <Time epoch={details.ExpectedDepartureTime} />
                        {
                            (details.ExpectedDepartureTime !== details.AimedDepartureTime) &&
                            <s><Time epoch={details.AimedDepartureTime}/></s>
                        }
                        </div>
                        <span className="platform spaced">{details.AimedDeparturePlatformName}</span>
                        <span className={`lineId ${ details.LineID }`}>{details.LineID}</span>
                        <strong className="destinationName spaced">{details.DestinationName}</strong>
                    </div>
                }
                secondaryText={
                    <p className="remarks spaced">
                        <span>{details.StopVisitNotePartOne}</span> <span>{details.StopVisitNote}</span>
                    </p>
                }
            >
            </ListItem>
        );
    }
}

export default TrainRide;
