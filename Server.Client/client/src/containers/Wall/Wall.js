import React from 'react';
import UserMiniCard from "../../components/UserMiniCard/UserMiniCard";
import API from './../../utils/API';
import InputRange from 'react-input-range';
import Interests from "../../components/EditProfil/AddInterests/Interests/Interests";
import {Search, Dimmer, Loader, Grid, Rail, Segment, Divider, Checkbox} from "semantic-ui-react";
import 'react-input-range/lib/css/index.css';
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import _ from "lodash";

const DEFAULT_STATE = {
    clear: false,
    isLoading: false,
    value: '',
    results: [],
    users: [],
    warnings: [],
    loading: false,
    interests: [],
    distanceRange: 250,
    ageRange: {
        min: 19,
        max: 27,
    },
    popularityRange: {
        min: 0,
        max: 50,
    }
};

const DEFAULT_STATE_SEARCH = {
    "isLoading": false,
    "results": [],
    "value": ""
};
// Store data results BDD of interest here
let DATA = [];

class Wall extends React.Component {

    state = {...DEFAULT_STATE};
    componentDidMount = async() => {

        this.setState({loading: true});
        // Get interests
        API.getInterests()
            .then(response => {
                DATA = response.data.results;
            })
            .catch(error => {
                if (this._mounted)
                    this.setState({warnings: error.response.data.warnings})
            });
        // Check if user can view users
        await API.checkUserView()
            .then(res => {
                if (res.status === 200)
                    this.canView = true;
                else
                    this.canView = false;
            })
            .catch(err => {
                this.canView = false;
            });
        if (this.canView === false)
            this.props.history.push('/');
        await this.searchMatch();

        this.setState({loading: false});
    };

    handleChange = async(value, id) => {
        if (id === "distanceRange")
            this.setState({distanceRange: value});
        else if (id === "ageRange")
            this.setState({ageRange: value});
        else if (id === "popularityRange")
            this.setState({popularityRange: value});
    };

    searchMatch = async() => {
        this.setState({loading: true});
        const {distanceRange, ageRange, popularityRange } = this.state;
        let users = [];
        // Get users
        await API.getUsers(distanceRange, ageRange, popularityRange)
            .then(response => {
                if (response.status === 200)
                    users = response.data.users;
            })
            .catch(error => {
                if(typeof error.response !== 'undefined')
                    this.setState({warnings : error.response.data.warnings})
            });

        this.setState({users: users});
        this.setState({loading: false});

    };

    // Add interests
    // Semantic UI Search
    handleResultSelect = (e, { result }) => this.setState({ value: result.title.trim() })
    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(async () => {
            if (this.state.value.length < 1)
                return this.setState(DEFAULT_STATE_SEARCH);
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(DATA, isMatch).slice(0,3),
            })
        }, 300)
    };
    handleKeyDown = async (data) => {
        if (data.key === 'Enter') {
            console.log(1);
            // Regex for interest
            const regex = new RegExp('[^A-Za-z0-9]');
            let new_interest = data.target.value;
            let interests = this.state.interests;
            let warnings = [];
            if (!new_interest || new_interest.length < 2)
                warnings.push("Your interest must contain between 2 and 20 characters");
            if (regex.test(new_interest))
                warnings.push("Your interest is not valid. Only letter and numeric value is accepted");
            if (warnings.length < 1) {
                await API.addInterests(new_interest)
                    .then(response => {
                        if(response.status === 200 && this._mounted) {
                            interests.push(new_interest);
                            this.setState({interests: interests, warnings: response.data.warnings, value: ''})
                        }
                    })
                    .catch((error) => {
                        this._mounted
                        && this.setState({warnings: error.response.data.warnings})
                    })
            } else
                this.setState({ warnings });
        }
    };


    render() {
        const { users, loading, distanceRange, ageRange, popularityRange, interests, isLoading, value, results } = this.state;
            return (
                <div className="WallContainer">
                    <Dimmer active={loading}>
                        <Loader size='massive'/>
                    </Dimmer>
                    <Grid centered stackable>
                        <Grid.Column floadted='left' textAlign='left' mobile={16} tablet={6} computer={4} >
                            <Segment inverted className="SegmentFilter">
                            <div className="filterContainer">
                                <Grid.Row>
                                    <Grid.Row>
                                        <div className="DistanceRangeContainer">
                                            <h1 className="DistanceRangeTitle"><strong>Distance</strong> <span className="RangeTitle"> 0 - {distanceRange} km</span></h1>
                                        </div>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <InputRange
                                            draggableTrack
                                            maxValue={5000}
                                            minValue={0}
                                            onChange={value => this.handleChange(value, "distanceRange")}
                                            formatLabel={value => `${value} km`}
                                            value={distanceRange} />
                                    </Grid.Row>
                                </Grid.Row>
                                <Divider hidden/>
                                <Grid.Row>
                                    <Grid.Row>
                                        <div className="DistanceRangeContainer">
                                            <h1 className="DistanceRangeTitle"><strong>Age</strong> <span className="RangeTitle"> {ageRange.min} - {ageRange.max}</span></h1>
                                        </div>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <InputRange
                                            draggableTrack
                                            maxValue={99}
                                            minValue={18}
                                            onChange={value => this.handleChange(value, "ageRange")}
                                            value={ageRange} />
                                    </Grid.Row>
                                </Grid.Row>
                                <Divider hidden/>
                                <Grid.Row>
                                    <Grid.Row>
                                        <div className="DistanceRangeContainer">
                                            <h1 className="DistanceRangeTitle"><strong>Popularity</strong> <span className="RangeTitle"> {popularityRange.min} - {popularityRange.max}</span></h1>
                                        </div>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <InputRange
                                            draggableTrack
                                            maxValue={500}
                                            minValue={0}
                                            onChange={value => this.handleChange(value, "popularityRange")}
                                            value={popularityRange} />
                                    </Grid.Row>
                                </Grid.Row>
                                <Divider hidden/>
                                <Grid.Row>
                                    <Segment className="IncludeInterestsTitle">
                                        <Checkbox label='Include my interests' defaultChecked />
                                    </Segment>
                                </Grid.Row>
                                <Grid.Row centered>
                                    <Interests
                                        interests={interests}
                                        deleteInterest={this.deleteInterest} />
                                </Grid.Row>
                                <Grid.Row centered>
                                    <Search
                                        fluid
                                        icon={"hashtag"}
                                        onKeyDown={this.handleKeyDown}
                                        size="small"
                                        loading={isLoading}
                                        onResultSelect={this.handleResultSelect}
                                        onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                                        results={results}
                                        value={value}
                                        showNoResults={false} />
                                </Grid.Row>
                                <Divider hidden/>
                                <Grid.Row>
                                    <Button
                                        onClick={this.searchMatch}>
                                        Search
                                    </Button>
                                </Grid.Row>
                            </div>
                        </Segment>
                    </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={10}>
                                        <Grid centered stackable columns={this.state.users.length} >
                                            <UserMiniCard users={users} />
                                        </Grid>
                            </Grid.Column>
                    </Grid>
                </div>
            );
    }
}


export default Wall;