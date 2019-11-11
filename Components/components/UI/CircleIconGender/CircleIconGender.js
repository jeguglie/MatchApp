import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import './CircleIconGender.css';

function circleIconGender (props) {

    if (props.WallCoverUser) {
        return (
            <div className={props.gender === "male" ? "MaleWallUserCover" : "FemaleWallUserCover"}>
                <FontAwesomeIcon icon={props.gender === "male" ? faMars : faVenus}/>
            </div>
        )
    } else {
        return (
            <div className={props.gender === "male" ? "Male" : "Female"}>
                <FontAwesomeIcon icon={props.gender === "male" ? faMars : faVenus}/>
            </div>
        );
    }
}

export default circleIconGender;