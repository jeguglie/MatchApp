import React from "react";
import {Container, Image, Divider} from 'semantic-ui-react';
import Autocomplete from 'react-google-autocomplete';
import API from "Src/utils/API";
import {store} from "react-notifications-component";

class ChangeLocation extends React.Component {

    constructor (props) {
        super(props);
        this._mounted = false;
    };

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
    }

    setLocation = async(lat, lng) => {
        await API.updategeolocate(lat, lng)
            .then(response => {
                if (response.status === 200) {
                    store.addNotification({
                        title: 'Your position was successfully updated',
                        message: "Start to match !",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 10000,
                            onScreen: true
                        }
                    });
                }
            })
            .catch(e => console.log(e));
    };

    notifChooseLocation = () => {
        store.addNotification({
            message: "Please select a place in dropdown",
            type: "warning",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 10000,
                onScreen: true
            }
        });
    };

    render() {
        return (
            <Container className="loginModal">
                <Divider hidden />
                <Image className="img-fluid"
                       src={'/assets/img/MatchApp-Logo.png'}
                       alt="Responsive image"
                       size="medium"
                       centered />
                <div className="shape"></div>
                <Divider hidden />
                <h1 className="loginh1">Set custom location</h1>
                <div className={'inputSearchGoogle'}>
                    <Autocomplete
                        style={{width: '90%'}}
                        onPlaceSelected={(place) => {
                            if (place.geometry)
                                this.setLocation(place.geometry.location.lat(), place.geometry.location.lng());
                            else
                                this.notifChooseLocation();
                        }}
                    />
                </div>
                <Divider hidden />
                <Divider hidden />
                <Divider hidden />
            </Container>
        );
    }
}

export default ChangeLocation;