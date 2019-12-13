import React from 'react';
import UserMiniCard from "../../components/UserMiniCard/UserMiniCard";
import API from './../../utils/API';
import InputRange from 'react-input-range';
import {Dimmer, Loader, Grid, Rail,Segment, Divider} from "semantic-ui-react";
import 'react-input-range/lib/css/index.css';

const DEFAULT_STATE = {
    users: [],
    warnings: [],
    loading: false,
    distanceRange: {
        min: 40,
        max: 200,
    },
    ageRange: {
        min: 18,
        max: 27,
    },
    popularityRange: {
        min: 0,
        max: 50,
    }
};

class Wall extends React.Component {

    state = {...DEFAULT_STATE};

    componentDidMount = async() => {
        const { users, loading, distanceRange, ageRange, popularityRange } = this.state;
        this.setState({loading: true});
        await API.getUsers(distanceRange, ageRange, popularityRange)
            .then(response => {if (response.status === 200) { this.setState({users: response.data.users}); } })
            .catch(error => {
                if(typeof error.response !== 'undefined')
                    this.setState({warnings : error.response.data.warnings})
            });
        this.setState({loading: false})
    };

    handleChange = async() => {
        console.log(1);
        const { users, loading, distanceRange, ageRange, popularityRange } = this.state;
        this.setState({loading: true});
        await API.getUsers(distanceRange, ageRange, popularityRange)
            .then(response => {if (response.status === 200) { this.setState({users: response.data.users}); } })
            .catch(error => {
                if(typeof error.response !== 'undefined')
                    this.setState({warnings : error.response.data.warnings})
            });
        this.setState({loading: false})
    }

    render() {
        const { users, loading, distanceRange, ageRange, popularityRange } = this.state;
            return (
                <div className="WallContainer">
                    <Dimmer active={loading}>
                        <Loader size='massive'/>
                    </Dimmer>
                    <Grid stackable container>
                        <Grid.Column textAlign='left' mobile={16} tablet={8} computer={6} >
                            <Segment inverted>
                            <div className="filterContainer">
                                <Grid.Row>
                                    <Grid.Row>
                                        <div className="DistanceRangeContainer">
                                            <h1 className="DistanceRangeTitle">Distance</h1>
                                        </div>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <InputRange
                                            draggableTrack
                                            maxValue={500}
                                            minValue={0}
                                            onChange={value => this.setState({ distanceRange: value }, () => this.handleChange)}
                                            formatLabel={value => `${value} km`}
                                            value={distanceRange} />
                                    </Grid.Row>
                                </Grid.Row>
                                <Divider hidden/>
                                <Grid.Row>
                                    <Grid.Row>
                                        <div className="DistanceRangeContainer">
                                            <h1 className="DistanceRangeTitle">Age</h1>
                                        </div>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <InputRange
                                            draggableTrack
                                            maxValue={99}
                                            minValue={18}
                                            onChange={value => this.setState({ ageRange: value }, () => this.handleChange)}
                                            value={ageRange} />
                                    </Grid.Row>
                                </Grid.Row>
                                <Divider hidden/>
                                <Grid.Row>
                                    <Grid.Row>
                                        <div className="DistanceRangeContainer">
                                            <h1 className="DistanceRangeTitle">Popularity</h1>
                                        </div>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <InputRange
                                            draggableTrack
                                            maxValue={500}
                                            minValue={0}
                                            onChange={value => this.setState({ popularityRange: value }, () => this.handleChange)}
                                            value={popularityRange} />
                                    </Grid.Row>
                                </Grid.Row>
                            </div>
                        </Segment>
                        </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={10}>
                                <Segment inverted>
                                    <div className="UsersMiniCard">
                                        <Grid centered >
                                            <UserMiniCard users={users} />
                                        </Grid>
                                    </div>
                                </Segment>
                            </Grid.Column>
                    </Grid>
                </div>
            );
    }
}


export default Wall;