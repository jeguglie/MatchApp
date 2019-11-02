import React from 'react';
import Bio from './Bio/Bio';
import './BottomCard.css';
import Hashtags from './Hashtags/Hashtags';
import Like from './Like/Like';

const bottomCard = (props) => (
    <div className="BottomCard">
        <Bio bio={props.bio} />
        <Like  gender={props.gender}/>
        <Hashtags hashtags={props.hashtags} gender={props.gender} showHashTags={props.showHashTags}/>
    </div>
);

export default bottomCard;