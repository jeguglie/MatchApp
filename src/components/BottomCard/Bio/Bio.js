import React from 'react';
import './Bio.css'
const bio = (props) => (
    <div className="Bio">
        <p className="Bio-text">{props.bio}</p>
    </div>
);

export default bio;