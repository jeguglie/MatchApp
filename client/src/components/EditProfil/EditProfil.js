import React from 'react';
import BasicsInformations from "./BasicInformations/BasicsInformations";
import AddPhotos from "./AddPhotos/AddPhotos";
import API from "../../utils/API";
import AddInterests from "./AddInterests/AddInterests";
import Location from "./Location/Location";


const DEFAULT_STATE = {
    section: 1,
    complete: 0,
};

class EditProfil extends React.Component {

    constructor(props){
        super(props);
        this.state = DEFAULT_STATE;
        this._mounted = false;

    }
    handleNext = () => {this.setState({section: this.state.section + 1}) };
    handlePrev = () => {this.setState({section: this.state.section - 1}) };

    componentDidMount() {
        this._mounted = true;
        this.getComplete();
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    getComplete = async() => {
        await API.getComplete()
            .then ((response) => {
                this._mounted && this.setState({complete: response.data.complete});
            })
            .catch((error) => {
                console.log(error);
            })
    };
    useCustomAddress = () => {
        this.props.history.push('/usecustomaddress');
    };

    render(){
        const {section} = this.state;
            if (section === 1)
                return (
                        <BasicsInformations
                            nextsection={this.handleNext}
                            complete={this.state.complete}
                            getcomplete={this.getComplete}/>
                );
        else if (section === 2)
            return (
                    <AddPhotos
                        prevsection={this.handlePrev}
                        nextsection={this.handleNext}
                        complete={this.state.complete}
                        getcomplete={this.getComplete} />
            );
        else if (section === 3)
            return (
                    <AddInterests
                        prevsection={this.handlePrev}
                        nextsection={this.handleNext}
                        complete={this.state.complete}
                        getcomplete={this.getComplete}/>
            );
        else if (section === 4)
            return (
                <Location
                    prevsection={this.handlePrev}
                    complete={this.state.complete}
                    getcomplete={this.getComplete}
                    useCustomAddress={this.useCustomAddress}/>
            );
        }

}

export default EditProfil;