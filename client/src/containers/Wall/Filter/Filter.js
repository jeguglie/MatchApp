import React from 'react';
import {Button, Checkbox, Divider, Grid, Segment} from "semantic-ui-react";
import InputRange from "react-input-range";
import './react-input-range.css';
import SearchTags from "Src/containers/Wall/SearchTags/SearchTags";
import Aux from "Src/hoc/Aux";

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
    checked: true,
};

class Filter extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
        this._mounted = false;
        this.state.loading = true;
        this.innerRef = React.createRef();
    }

    componentDidMount() {
        this._mounted = true;
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

    // Search click
    handleClick = () => {
        let interests = [];
        if (this.innerRef.current && this.innerRef.current.state.value && this.innerRef.current.state.value.length > 0)
            interests = this.innerRef.current.state.value;
        this.props.searchMatch(
            this.state.distanceRange,
            this.state.ageRange,
            this.state.popularityRange,
            interests
        );
    };

    activeCheckBox = () => {
        if (this.state.checked === false) {
            this.innerRef.current.clearValue();
            this.setState({checked: true})
        }
    };
    disableCheckBox = () => {
        if (this.state.checked === true) {
            this.setState({checked: false})
        }
    };
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.loading !== prevState.loading)
            return {loading: nextProps.loading};
        return null
    }
    render(){
        const {distanceRange, loading, checked, ageRange, popularityRange} = this.state;
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
                                <Grid columns={'equal'}>
                                    <Grid.Row  >
                                        <Grid.Column width={6}>
                                                <Grid.Row centered>
                                                    <Checkbox checked={checked} onClick={checked ? this.disableCheckBox : this.activeCheckBox} toggle />
                                                    <p id={'includeMyInterests'}>Use my interests</p>
                                                </Grid.Row>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Grid.Row>
                                                <SearchTags activeCheckBox={this.activeCheckBox} disableCheckBox={this.disableCheckBox} ref={this.innerRef} />
                                            </Grid.Row>
                                            <Grid.Row centered textAlign={'center'}>
                                                <Button
                                                    className={'searchButton'}
                                                    id="search"
                                                    size='large'
                                                    fluid
                                                    loading={loading}
                                                    floated={'right'}
                                                    onClick={this.handleClick}>
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