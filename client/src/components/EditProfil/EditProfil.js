import React from 'react';
import BasicsInformations from "Src/components/EditProfil/BasicInformations/BasicsInformations";
import AddPhotos from "Src/components/EditProfil/AddPhotos/AddPhotos";
import API from "Src/utils/API";
import AddInterests from "Src/components/EditProfil/AddInterests/AddInterests";
import Location from "Src/components/EditProfil/Location/Location";


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


    setCustomLocation = () => { this.props.history.push('/changelocation') };

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
                        setCustomLocation={this.setCustomLocation}
                        />
                </div>
            );
        }

}

export default EditProfil;