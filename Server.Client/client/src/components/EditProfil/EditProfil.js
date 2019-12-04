import React from 'react';
import BasicsInformations from "./BasicInformations/BasicsInformations";
import AddPhotos from "./AddPhotos/AddPhotos";
import AddInterests from "./AddInterests/AddInterests";
import {CSSTransition} from 'react-transition-group';

const DEFAULT_SATE = {
    section: 1,
    section1: true,
    section2: false,
    section3: false,
    bool: false
};

class EditProfil extends React.Component {
    constructor(props){
        super(props);
        this.state = {...DEFAULT_SATE};
    }

    componentDidMount() {
    }

    handleNext = () => {
        this.setState({section: this.state.section + 1, bool: true});
    };

    handleSection3 = () => {
        this.setState({section2: false, section1: false, section3: true});
    };
    handleSection2 = () => {
        this.setState({section2: true, section1: false, section3: false});
    };
    handleSection1 = () => {
        this.setState({section2: false, section1: true, section3: false});
    };


    handlePrev = () => this.setState({section: this.state.section - 1});
    render(){
        if (this.state.section === 1) {
            if (this.state.section1 === false)
                this.handleSection1();
            return (
                <CSSTransition in={this.state.section1} timeout={500} classNames="BasicsInformationsAnimate">
                    <BasicsInformations nextSection={this.handleNext}/>
                </CSSTransition>
            );
        }
        else if (this.state.section === 2) {
            if (this.state.section2 === false)
                this.handleSection2();
            return (
                <CSSTransition in={this.state.section2} timeout={500} classNames="AddPhotosAnimate">
                    <AddPhotos prevSection={this.handlePrev}
                               nextSection={this.handleNext}/>
                </CSSTransition>
            );
        }
        else if (this.state.section === 3) {
            if (this.state.section3 === false)
                this.handleSection3();
            return (
                <CSSTransition in={this.state.section3} timeout={500} classNames="AddInterestsAnimate">
                    <AddInterests prevSection={this.handlePrev}/>
                </CSSTransition>
            );
        }

    }
}

export default EditProfil;