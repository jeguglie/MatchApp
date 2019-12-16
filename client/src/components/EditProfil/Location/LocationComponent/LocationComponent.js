import React from "react";
import { geolocated } from "react-geolocated";

class LocationComponent extends React.Component {
    render() {
        // if (!this.props.isGeolocationAvailable)
        //     return (
        //         <div>Your browser does not support Geolocation</div>
        //     )
        // if (!this.props.isGeolocationEnabled)
        //     return (
        //         <div>Your browser does not support Geolocation</div>
        //     )
        // else if (this.props.coords)
        //     return (
        //         <div>Your browser support Geolocation</div>
        //     )
        return null;
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    suppressLocationOnMount: false,
})(LocationComponent);

