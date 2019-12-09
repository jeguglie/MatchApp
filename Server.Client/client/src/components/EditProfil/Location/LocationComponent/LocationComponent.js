import React from "react";
import { geolocated } from "react-geolocated";

class LocationComponent extends React.Component {
    render() {

        if (!this.props.isGeolocationAvailable)
            return (
                <div>Your browser does not support Geolocation</div>
            )
        if (!this.props.isGeolocationEnabled)
            return (
                <div>Your browser does not support Geolocation</div>
            )
        else if (this.props.coords && this.props.clicked)
            this.props.setCoords(this.props.coords);
        return null;
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    suppressLocationOnMount: true,
})(LocationComponent);

