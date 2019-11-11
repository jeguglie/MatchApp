import React from 'react';
import './ImgSliderIcons.css';
const imgSliderIcons = (props) => (
    <div className="ImgSliderIcons">
        {props.nbrImg.map(function(number, index){
                    return <span id={ index  === props.currentImg ? "active" : null} key={ index }></span>;
            })
        }
    </div>
);

export default imgSliderIcons;