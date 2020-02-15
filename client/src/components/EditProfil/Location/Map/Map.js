import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Icon} from "semantic-ui-react";
import equal from 'fast-deep-equal';

const AnyReactComponent = ({ text }) => {
    return(
    <div>
        <Icon name='map marker alternate' size="big"/>
    </div>
)
}

const DEFAULT_POSITION = {
    center: {
        lat: 48.845289,
        lng: 2.338674
    },
    defaultCenter: {
        lat: 48.845289,
        lng: 2.338674
    },
    zoom: 11,
    innerRef: null,
}
class SimpleMap extends Component {

    constructor(props){
        super(props);
        this.state = DEFAULT_POSITION;
        this._mounted = false;
        this.updatePosition = this.updatePosition.bind(this);
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentDidUpdate(prevProps) {
       if(!equal(this.props.innerRef, prevProps.innerRef)) {
           this.updatePosition();
       }
    }

    updatePosition = () => {
        if (this.props.innerRef && this.props.innerRef.state && this.props.innerRef.state.coords) {
            this._mounted && this.setState({
                lat: this.props.innerRef.state.coords.latitude,
                lng: this.props.innerRef.state.coords.longitude,
            }, () => {
                this.setState(prevState => ({
                    center: {
                        ...prevState.center,
                        lat: this.state.lat,
                        lng: this.state.lng
                    }
                }))
            })
        }
    }
    render() {
        const {center, defaultCenter, zoom, lat, lng} = this.state;
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <div id="mapContent">
                    <GoogleMapReact
                        // bootstrapURLKeys={{ key: 'AIzaSyDMyRL-0tVdDqmG-aCpDaSsI0IbZqb7FQg' }}
                        defaultCenter={defaultCenter}
                        center={center}
                        defaultZoom={zoom}
                        className={"content"} >
                    <AnyReactComponent
                        lat={lat}
                        lng={lng}
                        text="Your location"
                    />
                </GoogleMapReact>
                </div>
            </div>
        );
    }
}

export default SimpleMap;