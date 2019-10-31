import React from 'react';
import './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => (
    <Aux>
        <Backdrop show={props.show} clicked={props.modalClosed}/>
        <div className={"Modal"}
             style={{transform: props.show ? 'translateX(0)' : 'translateX(-100vh)', opacity: props.show ? '1':'0'}} >
            {props.children}
        </div>
    </Aux>
);

export default modal;