import React from 'react';
import './ImageSliderProfil.css';
import SignalUser from "../../UI/SignalUser/SignalUser";

const imageSliderProfil = (props) => (
    <div className="Img">
        <div className="slider">
            <div onClick={props.showSignalUserModal} className="SignalUser">
                <SignalUser />
            </div>
            <div onClick={props.prevImage} className="arrows prev"></div>
            <div onClick={props.nextImage} className="arrows next"></div>
            <img alt="" src={props.src} />
        </div>
    </div>
);

export default imageSliderProfil;