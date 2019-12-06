import React from 'react';
import BasicsInformations from "./BasicInformations/BasicsInformations";
import AddPhotos from "./AddPhotos/AddPhotos";
import API from "../../utils/API";
import AddInterests from "./AddInterests/AddInterests";

const DEFAULT_SATE = {
    section: 1,
    section1: true,
    section2: false,
    section3: false,
    bool: false,
    complete: 0,
};

class EditProfil extends React.Component {
    constructor(props){
        super(props);
        this.state = {...DEFAULT_SATE};
    }

    handleNext = () => this.setState({section: this.state.section + 1, bool: true});
    handleSection3 = () => this.setState({section2: false, section1: false, section3: true});
    handleSection2 = () => this.setState({section2: true, section1: false, section3: false});
    handleSection1 = () => this.setState({section2: false, section1: true, section3: false});
    handlePrev = () => this.setState({section: this.state.section - 1});

    async componentDidMount() {
        this._mounted = true;
        this.getComplete();
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    getComplete = async() => {
        await API.getComplete()
            .then ((response) => {
                    if (this._mounted)
                        this.setState({complete: response.data.complete});
                })
            .catch((error) => {
                console.log(error);
            })
    };

    render(){
        if (this.state.section === 1) {
            if (this.state.section1 === false)
                this.handleSection1();
            return (
                    <BasicsInformations
                        nextSection={this.handleNext}
                        complete={this.state.complete} />
            );
        }
        else if (this.state.section === 2) {
            if (this.state.section2 === false)
                this.handleSection2();
            return (
                    <AddPhotos prevSection={this.handlePrev}
                               nextSection={this.handleNext}
                               complete={this.state.complete} />
            );
        }
        else if (this.state.section === 3) {
            if (this.state.section3 === false)
                this.handleSection3();
            return (
                    <AddInterests
                        prevSection={this.handlePrev}
                        complete={this.state.complete} />
            );
        }

    }
}

export default EditProfil;