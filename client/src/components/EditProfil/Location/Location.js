import React from 'react';
import {Button, Segment, Grid, Progress, Icon, Loader, Dimmer, Divider} from 'semantic-ui-react';
import VALIDATE from "Src/utils/validation";
import LocationComponent from "Src/components/EditProfil/Location/LocationComponent/LocationComponent";
import SimpleMap from "Src/components/EditProfil/Location/Map/Map";
import API from 'Src/utils/API';
import { store } from 'react-notifications-component';


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
        // Bind for location REF
        this.getInnerRef = this.getInnerRef.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this._mounted = false;
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        this._mounted = true;
        this._mounted && this.setState({loading: true});
        await VALIDATE.sleepLoader(200);
        this._mounted && this.setState({complete: this.props.complete});
        this._mounted && this.setState({loading: false});
    }

    componentDidUpdate = async(props, state) =>{
        if (props.complete !== state.complete)
            this._mounted && this.setState({complete: props.complete})
        if (props.loading !== state.loading)
            this._mounted && this.setState({loading: props.loading})
    };

    // React geolocate
    innerRef;
    getInnerRef = (ref) => {
        this.innerRef = ref;

    };
    prevSection = () => {
        this._mounted && this.setState({loading: true});
        this.props.prevsection();
    };

    getLocation = async() => {
        this.innerRef && this.innerRef.getLocation();
        if (this.innerRef && this._mounted &&  this.innerRef.state && this.innerRef.state.coords) {
            this.innerRef && this._mounted && this.setState({innerRef: this.innerRef});
            await API.updategeolocate(this.innerRef.state.coords.latitude, this.innerRef.state.coords.longitude)
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
        }
    };



    render() {
        const {getInnerRef, getLocation, prevSection } = this;
        const {complete, loading} = this.state;
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
                        <Divider horizontal id={"ordivider"}>Or</Divider>
                        <Button
                            onClick={this.props.setCustomLocation}
                            className="buttonLastStep"
                            size="big"
                            content='Set a custom location' />
                    </Segment>
                    <Grid>
                        <Divider hidden />
                        <Grid.Row centered >
                            <Icon
                                className="EditProfilArrow"
                                name='arrow circle left'
                                size="huge"
                                onClick={prevSection}/>
                        </Grid.Row>
                    </Grid>
                </div>

        )
    }
}
export default Location;