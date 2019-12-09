import React from 'react';
import {Input, Button, Segment, Form, TextArea, Grid, Progress, Icon, Select, Loader, Dimmer, Container, Divider} from 'semantic-ui-react';
import VALIDATE from "../../../utils/validation";
import LocationComponent from "./LocationComponent/LocationComponent";
import SimpleMap from "./Map/Map";

const DEFAULT_STATE = {
    loading: false,
    complete: 0,
    center: {
        lat: 59.95,
        lng: 30.33
    },
    zoom: 11,
    clicked: false,
};
class Location extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
        this.state.complete = this.props.complete;
        // Location ref
        this.getInnerRef = this.getInnerRef.bind(this);
        this.getLocation = this.getLocation.bind(this);
    }
    // React geolocate
    innerRef;
    getInnerRef = (ref) => {this.innerRef = ref;};
    getLocation = () => {
        this.setState({clicked: true})
        this.innerRef && this.innerRef.getLocation();
    };
    setCoords = (props) => {
        console.log(props)
        this.setState({clicked: false, lat: props.latitude, lng: props.longitude});
    };

    async componentDidMount() {
        this.setState({loading: true});
        await VALIDATE.sleepLoader(500);
        await this.props.getcomplete();
        this.setState({complete: this.props.complete});
        this.setState({loading: false});
    }



    render() {
        const { getInnerRef, getLocation } = this;
        const {complete, center, lat, lng} = this.state;
        const ProgressBar = () => (
            <Progress
                percent={complete}
                progress
                indicating
                size="medium"/>
        );
        return (
                <div className="Location">
                    <Dimmer active={this.state.loading}>
                        <Loader size='massive'>Loading...</Loader>
                    </Dimmer>
                    <ProgressBar />
                    <Grid textAlign="center">
                        <Grid.Row centered>
                            <h1 className="CompleteTitle">Add your location</h1>
                        </Grid.Row>
                    </Grid>
                    <Divider hidden />
                    <Divider hidden />
                    <LocationComponent
                        ref={getInnerRef}
                        setCoords={this.setCoords}
                        clicked={this.state.clicked}/>
                    <div className="shapeLastStep"></div>
                    <div className="WrapMap">
                    <Segment>
                        <div className="mapAddLocation">
                            <SimpleMap
                                default={center}
                                zoom={this.state.zoom}
                                lat={lat}
                                lng={lng}
                            />
                        </div>
                    </Segment>
                    </div>
                    <Segment basic textAlign='center'>
                        <Button
                            onClick={getLocation}
                            className="buttonLastStep"
                            size="big"
                            content='Geolocate my position' />
                        <Divider horizontal className="DividerLastStep"><span>Or add location</span></Divider>
                        <Input
                            size="big"
                            icon='search'
                            iconPosition='left'
                            placeholder='Search location' />
                    </Segment>
                    <Grid>
                        <Divider hidden />
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle left outline'
                                  size="huge"
                                  onClick={this.props.prevsection}/>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right outline'
                                  size="huge"
                                  onClick={this.props.nextsection}/>
                        </Grid.Row>
                    </Grid>
                </div>

        )
    }
}
export default Location;