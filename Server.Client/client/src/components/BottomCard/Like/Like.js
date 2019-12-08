import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import './Like.css'

const like = (props) => (
    <div className="Like">
        <div className="fa-4x">
            <div className={props.gender === "male" ? "LikeMale" : "LikeFemale"}>
                <FontAwesomeIcon icon={faHeart} />
            </div>
        </div>
    </div>
);

export default like;