import React from 'react';
import './Title.css';
import ImgSliderIcons from '../../UI/ImgSliderIcons/ImgSliderIcons';
import CircleIconGender from '../../UI/CircleIconGender/CircleIconGender';


const title = (props) => (
    <div className="Title">
        <CircleIconGender gender={props.gender}/>
        <span className="TitleCard">{props.name}</span>
        <ImgSliderIcons
            nbrImg={props.nbrImg}
            currentImg={props.currentImg}
        />
    </div>
);

export default title;