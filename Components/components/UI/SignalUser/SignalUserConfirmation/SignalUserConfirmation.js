import React from 'react';
import './SignalUserConfirmation.css';

function SignalUserConfirmation (props) {
    return (
        <div className="SignalUserConfirmation">
            <h1 className="h1Text">Are you sure to signal <strong>{props.name}</strong> ?</h1>
            <div className="divider-height"></div>
            <button onClick={ props.SignalUserYes }>Yes</button><div className="divider"/><button onClick={ props.SignalUserNo } >No</button>
        </div>
    )
}

export default SignalUserConfirmation;