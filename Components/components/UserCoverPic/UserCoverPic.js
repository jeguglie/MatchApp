import React from 'react';
import './UserCoverPic.css';
import WallUserCoverBottom from "./WallUserCoverBottom/WallUserCoverBottom";

function UserCoverPic (props) {
    return (
        <div className="UserCoverCard">
            <div onClick={props.clicked} className="UserCoverPic">
                <img src={props.src} />
                <div className="ViewProfilOverlay">
                    <h1 className="Overlay">Profile</h1>
                </div>
            </div>
                <WallUserCoverBottom />
        </div>
    );
}

export default UserCoverPic;