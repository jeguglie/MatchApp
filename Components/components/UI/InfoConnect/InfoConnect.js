import React from 'react';
import './InfoConnect.css';

const infoConnect = (props) => (
    <div className="InfoConnect">
        <span className={props.infoConnectStatus}></span><span className="InfoConnectText">{props.infoConnect}</span>
    </div>
);

export default infoConnect;