import React from 'react';
import './WallUserCoverBottom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import CircleIconGender from '../../UI/CircleIconGender/CircleIconGender';

function WallUserCoverBottom (props) {
    return (
        <div className="WallUserCoverBottom">
            <div className="BottomFirstPart">
                <div className="BottomLeft">
                    <span className="fa-stack LikeCounter">
                        <FontAwesomeIcon className="fa fa-stack-2x" icon={faHeart} />
                        <span className="fa-stack-1x fa-stack-text fa-inverse like-counter"></span>
                    </span>
                </div>
                <div className="BottomRight">
                    <span className="BottomName">Alexander</span><br/>
                    <span className="BottomAge">25 ans</span>
                    <span className="vertical-divider"> | </span>
                    <span className="BottomDistance">0.7 km</span>
                </div>
            </div>
                <div className="SearchFor">
                        <span className="SearchForText">Interested by</span><br />
                        <span className="TextWoman">Woman</span>
                        <span className="TextMan">Man</span>
                </div>
        </div>
    )
}

export default WallUserCoverBottom;