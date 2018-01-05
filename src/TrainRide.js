import React, { Component } from 'react';

import { ListItem } from 'material-ui/List';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import { yellow800, red500 } from 'material-ui/styles/colors';

import './TrainRide.css';

const Time = ({ epoch }) => {
    const d = new Date(epoch);
    const time = `${ ('0' + d.getHours()).slice(-2)}:${ ('0' + d.getMinutes()).slice(-2)}`;

    return (
        <time dateTime={d.toISOString()}>{ time }</time>
    );
};

const TrainRide = ({ details }) => {
    let hasWarning = false;
    let iconColor;

    if (details.ExpectedDepartureTime !== details.AimedDepartureTime) {
        hasWarning = true;
        iconColor = yellow800;
    }
    else if ((details.ArrivalStatus + details.DepartureStatus).match(/cancelled/i)) {
        hasWarning = true;
        iconColor = red500;
    }

    return (
        <ListItem
            rightIcon={
                hasWarning ? <AlertWarning color={iconColor} /> : undefined
            }
            primaryText={
                <div className="train-ride-line1">
                    <div className="spaced">
                    <Time epoch={details.ExpectedDepartureTime} />
                    {
                        hasWarning &&
                        <s><Time epoch={details.AimedDepartureTime}/></s>
                    }
                    </div>
                    <span className="platform spaced">{details.DeparturePlatformName}</span>
                    <span className={`lineId ${ details.LineRef }`}>{details.LineRef}</span>
                    <strong className="destinationName spaced">{details.DestinationName}</strong>
                </div>
            }
            secondaryText={
                <p className="remarks spaced">
                    <span>{details.OperatorRef}{details.Via ? ' - ' + details.Via : ''}</span>
                </p>
            }
        >
        </ListItem>
    );
};

export default TrainRide;
