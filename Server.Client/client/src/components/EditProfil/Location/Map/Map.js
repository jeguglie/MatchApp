import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Grid, Icon} from "semantic-ui-react";

const AnyReactComponent = ({ text }) => {
    return(
    <div>
        <Icon  color='pink' loading name='heart' size="big"/>
    </div>
)
}
class SimpleMap extends Component {

    constructor(props){
        super(props);
    }

    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };

    render() {
        console.log(this.props);
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB9cGdWgQvt4wublLDt_ytEGF9TYb128UA' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom} >
                    <AnyReactComponent
                        lat={this.props.lat}
                        lng={this.props.lng}
                        text="Your location"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default SimpleMap;