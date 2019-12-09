import React from 'react';
import {Input, Button, Segment, Form, TextArea, Grid, Progress, Icon, Select, Loader, Dimmer, Container, Divider} from 'semantic-ui-react';
import VALIDATE from "../../../utils/validation";
import LocationComponent from "./LocationComponent/LocationComponent";
import SimpleMap from "./Map/Map";
import PlacesWithStandaloneSearchBox from "./SearchBoxGoogleMap/SearchBoxGoogleMap";

const DEFAULT_STATE = {
    loading: false,
    complete: 0,
    innerRef: null,

};
class Location extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
        this.state.complete = this.props.complete;
        // Bin for location REF
        this.getInnerRef = this.getInnerRef.bind(this);
        this.getLocation = this.getLocation.bind(this);
    }

    async componentDidMount() {
        this.setState({loading: true});
        await VALIDATE.sleepLoader(200);
        await this.props.getcomplete();
        this.setState({complete: this.props.complete});
        this.setState({loading: false});
    }

    // React geolocate
    innerRef;
    getInnerRef = (ref) => {
        this.innerRef = ref;

    };
    getLocation = () => {
        this.innerRef && this.innerRef.getLocation();
        this.setState({innerRef: this.innerRef});
    };




    render() {
        const { getInnerRef, getLocation } = this;
        const {complete, loading} = this.state;
        const {prevsection, nextsection} = this.props;
        return (
                <div className="Location">
                    <Dimmer active={loading}>
                        <Loader size='massive'/>
                    </Dimmer>
                    <Progress
                        percent={complete}
                        progress
                        indicating
                        size="medium"
                    />
                    <Grid textAlign="center">
                        <Grid.Row centered>
                            <h1 className="CompleteTitle">
                                Add your location
                            </h1>
                        </Grid.Row>
                    </Grid>
                    <Divider hidden />
                    <Divider hidden />
                    <LocationComponent
                        ref={getInnerRef}
                    />
                    <div className="shapeLastStep"></div>
                    <div className="WrapMap">
                    <Segment>
                        <div className="mapAddLocation">
                            <SimpleMap innerRef={this.state.innerRef} />
                        </div>
                    </Segment>
                    </div>
                    <Segment basic textAlign='center'>
                        <Button
                            onClick={getLocation}
                            className="buttonLastStep"
                            size="big"
                            content='Geolocate my position' />
                        <Divider
                            horizontal
                            className="DividerLastStep">
                            <span>
                                Or set custom location
                            </span>
                        </Divider>
                        <PlacesWithStandaloneSearchBox />
                    </Segment>
                    <Grid>
                        <Divider hidden />
                        <Grid.Row centered >
                            <Icon
                                className="EditProfilArrow"
                                name='arrow alternate circle left outline'
                                size="huge"
                                onClick={prevsection}/>
                            <Icon
                                className="EditProfilArrow"
                                name='arrow alternate circle right outline'
                                size="huge"
                                onClick={nextsection}/>
                        </Grid.Row>
                    </Grid>
                </div>

        )
    }
}
export default Location;
// {/*<Input*/}
// {/*    size="big"*/}
// {/*    icon='search'*/}
// {/*    iconPosition='left'*/}
// {/*    placeholder='Search location' />*/}