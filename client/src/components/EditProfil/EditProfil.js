import React from 'react';
import BasicsInformations from "./BasicInformations/BasicsInformations";
import AddPhotos from "./AddPhotos/AddPhotos";
import API from "../../utils/API";
import AddInterests from "./AddInterests/AddInterests";
import Location from "./Location/Location";


const DEFAULT_STATE = {
    section: 1,
    complete: 0,
    loading: false,
};

class EditProfil extends React.Component {

    constructor(props){
        super(props);
        this.state = DEFAULT_STATE;
        this._mounted = false;

    }
    handleNext = () => {
        API.getComplete()
            .then ((response) => {
                this._mounted && this.setState({complete: response.data.complete});
            })
        this.setState({loading: true, section: this.state.section + 1})
    };
    handlePrev = () => {
        API.getComplete()
            .then ((response) => {
                this._mounted && this.setState({complete: response.data.complete});
            })
        this.setState({loading: true, section: this.state.section - 1})
    };

    componentDidMount = async() => {
        this._mounted = true;
        await API.getComplete()
            .then ((response) => {
                this._mounted && this.setState({complete: response.data.complete});
            })
    };

    componentWillUnmount() {
        this._mounted = false;
    }


    useCustomAddress = () => { this.props.history.push('/usecustomaddress') };

    render(){
        const {section} = this.state;
        if (section === 1)
            return(
                <div className={'EditProfileContainer'}>
                    <BasicsInformations
                        nextsection={this.handleNext}
                        complete={this.state.complete}
                        getcomplete={this.getComplete}
                        />
                </div>
                );
        else if (section === 2)
            return (
                <div className={'EditProfileContainer'}>
                    <AddPhotos
                        prevsection={this.handlePrev}
                        nextsection={this.handleNext}
                        complete={this.state.complete}
                        getcomplete={this.getComplete}
                        />
                </div>
            );
        else if (section === 3)
            return (
                <div className={'EditProfileContainer'}>
                    <AddInterests
                        prevsection={this.handlePrev}
                        nextsection={this.handleNext}
                        complete={this.state.complete}
                        getcomplete={this.getComplete}
                       />
                </div>
            );
        else if (section === 4)
            return (
                <div className={'EditProfileContainer'}>
                    <Location
                        prevsection={this.handlePrev}
                        complete={this.state.complete}
                        getcomplete={this.getComplete}
                        useCustomAddress={this.useCustomAddress}
                        />
                </div>
            );
        }

}

export default EditProfil;