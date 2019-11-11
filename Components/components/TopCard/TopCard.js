import React from 'react';
import './TopCard.css';
import Aux from './../../hoc/Aux';
import Title from './Title/Title';
import ImageSliderProfil from './ImageSliderProfil/ImageSliderProfil';

const topCard = (props) => (
    <Aux>
        <ImageSliderProfil nextImage={props.nextImage}
                           prevImage={props.prevImage}
                           src={props.src}
                           showSignalUserModal={props.showSignalUserModal} />
        <Title name={props.name}
               nbrImg={props.nbrImg}
               gender={props.gender}
               currentImg={props.currentImg} />
    </Aux>
);

export default topCard;