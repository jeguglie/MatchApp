import React from 'react';
import './BlurBackdrop.css';

const blur_backdrop = (props) => (
    props.show ? <div className={"BlurBackdrop"} onClick={props.clicked} ></div> : null
);

export default blur_backdrop;