import React from 'react';
import './Hashtags.css';

function hashtags(props) {
    const isModalHashtags = props.isModalHashtags;
    if (isModalHashtags === "true") {
        return (
            <div className="Hashtags">
                {props.hashtags.map(function (hashtags, index) {
                    return <span className={props.gender} key={index}><strong>#</strong>{hashtags.slice(1)}</span>
                })}
            </div>
        )
    }
    else
        return (
            <div className="Hashtags">
                {props.hashtags.slice(0, 7).map(function (hashtags, index) {
                    return <span className={props.gender} key={index}><strong>#</strong>{hashtags.slice(1)}</span>
                })}
                {props.hashtags.length > 7 ?
                    <span onClick={props.showHashTags} id="More" className={props.gender}>...</span> : null}
            </div>
        )
}
export default hashtags;