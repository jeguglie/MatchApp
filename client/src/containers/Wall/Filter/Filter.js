import React from 'react';
import {Button, Checkbox, Divider, Grid, Segment} from "semantic-ui-react";
import InputRange from "react-input-range";
import SearchTags from "../SearchTags/SearchTags";
import 'react-input-range/lib/css/index.css';
import Aux from "../../../hoc/Aux";
import Debounce from 'react-debounce-component';

const DEFAULT_STATE = {
    distanceRange: 250,
    ageRange: {
        min: 18,
        max: 27,
    },
    popularityRange: {
        min: 0,
        max: 50,
    },
    loading: false,
};

class Filter extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(2);
    }

    // Filter
    handleChange = async(value, id) => {
        if (id === "distanceRange")
            this._mounted && this.setState({distanceRange: value});
        else if (id === "ageRange")
            this._mounted && this.setState({ageRange: value});
        else if (id === "popularityRange")
            this._mounted && this.setState({popularityRange: value});
    };

    render(){
        const {distanceRange, loading, ageRange, popularityRange} = this.state;
        return (
            <Aux>
                <Grid.Column mobile={16} tablet={6} computer={6} largeScreen={4} widescreen={3}>
                    <Segment inverted className="SegmentFilter">
                        <div className="filterContainer">
                            <Grid.Row>
                                <div className="DistanceRangeContainer">
                                    <h1 className="DistanceRangeTitle"><strong>Distance</strong>
                                        <span className="RangeTitle">
                                            0 - {distanceRange} km
                                        </span></h1>
                                </div>
                            </Grid.Row>
                            <Grid.Row>
                                <InputRange
                                    maxValue={5000}
                                    minValue={0}
                                    onChange={(value) => this.setState({distanceRange: value})}
                                    value={distanceRange} />
                            </Grid.Row>
                            <Divider hidden/>
                            <Grid.Row>
                                <div className="DistanceRangeContainer">
                                    <h1 className="DistanceRangeTitle"><strong>Age</strong> <span className="RangeTitle"> {ageRange.min} - {ageRange.max}</span></h1>
                                </div>
                            </Grid.Row>
                            <Grid.Row>
                                <InputRange
                                    maxValue={99}
                                    minValue={18}
                                    onChange={(value) => this.setState({ageRange: value})}
                                    value={ageRange} />
                            </Grid.Row>
                            <Divider hidden/>
                            <Grid.Row>
                                <div className="DistanceRangeContainer">
                                    <h1 className="DistanceRangeTitle"><strong>Popularity</strong> <span className="RangeTitle"> {popularityRange.min} - {popularityRange.max}</span></h1>
                                </div>
                            </Grid.Row>
                            <Grid.Row>
                                <InputRange
                                    maxValue={500}
                                    minValue={0}
                                    onChange={(value) => this.setState({popularityRange: value})}
                                    value={popularityRange} />
                            </Grid.Row>
                            <Divider hidden/>
                            <Segment className={'bottomFilter'}>
                                <Grid divided columns={'equal'}>
                                    <Grid.Row  >
                                        <Grid.Column width={6}>
                                            <Segment>
                                                <Grid.Row centered>
                                                    <Checkbox toggle />
                                                    <p id={'includeMyInterests'}>Use my interests</p>
                                                </Grid.Row>
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Grid.Row>
                                                <SearchTags />
                                                <Divider />
                                            </Grid.Row>
                                            <Grid.Row centered textAlign={'center'}>
                                                <Button
                                                    className={'searchButton'}
                                                    id="search"
                                                    size='large'
                                                    fluid
                                                    loading={loading}
                                                    floated={'right'}
                                                    onClick={() => this.props.searchMatch(this.state.distanceRange, this.state.ageRange, this.state.popularityRange)}>
                                                    Search
                                                </Button>
                                            </Grid.Row>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </div>
                    </Segment>
                </Grid.Column>
            </Aux>
        )
    }
}

export default Filter;