import React from 'react';
import './ModalViewProfil.css';
import Aux from '../../../../hoc/Aux';
import BlurBackdrop from '../../Backdrop/BlurBackdrop/BlurBackdrop';

const blur_modal = (props) => (
    <Aux>
        <BlurBackdrop   show={props.show}
                        clicked={props.modalClosed}

                        />
        <div id="ModalViewProfil"
             className={"ModalViewProfil"}
             style={{opacity: props.show ? '1':'0'}} >

            {props.children}
        </div>
    </Aux>
);

export default blur_modal;