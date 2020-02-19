import _ from 'lodash';
import React, {Component} from 'react';
import API from "Src/utils/API";
import {Grid, Progress, Icon, Divider, Search, Dimmer, Loader} from "semantic-ui-react";
import Interests from "Src/components/EditProfil/AddInterests/Interests/Interests";
import Warnings from 'Src/components/Warnings/Warnings';

const DEFAULT_STATE = {
    interests: [],
    clear: false,
    isLoading: false,
    value: '',
    warnings: [],
    results: [],
    loading: false,
};

const DEFAULT_STATE_SEARCH = {
    "isLoading": false,
    "results": [],
    "value": ""
};
// Store data results BDD of interest here
let DATA = [];

class AddInterests extends Component {
    // state = DEFAULT_STATE

    constructor(props){
        super(props);
        this.state = DEFAULT_STATE;
    }

    componentWillUnmount() {
        this._mounted = false;
        const CLEAR_STATE = {
            interests: [],
            clear: false,
            isLoading: false,
            value: '',
            warnings: [],
            results: [],
            loading: false,
        };
        this.setState({...CLEAR_STATE});
        DATA = [];
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        this._mounted = true;
        // Set loader and get progress bar
        this.setState({loading: true, interests: []});
        API.getInterests()
            .then(response => {
                  DATA = response.data.results;
            })
            .catch(error => {
                this._mounted && this.setState({warnings: error.response.data.warnings})
            });
        API.getUserInterests()
            .then(response => {
                if (response.data.interests !== false){
                    DEFAULT_STATE.interests = response.data.interests;
                    this._mounted && this.setState({interests: response.data.interests})
                }
            })
            .catch(error => {
                this._mounted && this.setState({warnings: error.response.data.warnings})
            });
            this._mounted && this.setState({loading: false});
    }

    componentDidUpdate = async(props, state) =>{
        if (props.complete !== state.complete)
            this._mounted && this.setState({complete: props.complete})
        if (props.loading !== state.loading)
            this._mounted && this.setState({loading: props.loading})
    };

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
            // Regex for interest
            const regex = new RegExp('/(^|\\B)#(?![0-9_]+\\b)([a-zA-Z0-9_]{1,30})(\\b|\\r)/g');
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

    deleteInterest = async ({ data, i }) =>
        this.setState(({ interests }) => ({
            interests: interests.filter((e, index) => i !== index)
        }), async() =>
            API.deleteInterest(data)
                .then(response => response.status === 200 && this._mounted
                    && this.setState({warnings: response.data.warnings}))
                .catch(error => this._mounted
                    && this.setState({warnings: error.response.data.warnings})));

    showWarnings(warnings) {
        if (warnings && warnings.length)
            return (
                <Grid.Row centered textAlign="center">
                    <div className="loginWarnings">
                        <Warnings data={warnings}/>
                    </div>
                </Grid.Row>
            );
        else
            return null
    };

    prevSection = () => {
        this._mounted && this.setState({loading: true});
        this.props.prevsection();
    };

    nextSection = () => {
        this._mounted && this.setState({loading: true});
        this.props.nextsection();
    };
    render() {
        const { prevSection, nextSection } = this;
        const {isLoading, value, results, warnings, interests} = this.state;
        const ProgressBar = () => (
            <Progress
                percent={this.props.complete}
                progress
                indicating
                size="medium"/>
        );
        return(
            <div className="AddInterests">
                <ProgressBar />
                <Dimmer active={this.state.loading}>
                    <Loader size='massive'/>
                </Dimmer>
                <div className="shapeAddInterests"></div>
                <Grid verticalAlign={"middle"}>
                    {this.showWarnings(warnings)}
                    <Grid.Row centered>
                        <Interests
                            interests={interests}
                            deleteInterest={this.deleteInterest} />
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <Grid verticalAlign="middle" className="TellOthersBox">
                    <Divider hidden />
                    <Grid.Row centered>
                        <h1 className="InterestsTitle">
                            Tell others what do you like
                        </h1>
                    </Grid.Row>
                    <Grid.Row centered className="TextInfoInterestsRow">
                        <p className="TextInfoInterests">Choose an existing interest increase your chances of match!</p>
                    </Grid.Row>
                    <Grid.Row centered>
                        <Search
                            icon="hashtag"
                            onKeyDown={this.handleKeyDown}
                            size="huge"
                            loading={isLoading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                            results={results}
                            value={value}
                            showNoResults={false} />
                    </Grid.Row>
                    <Divider hidden />
                </Grid>
                <Grid>
                    <Grid.Row centered>
                        <Icon
                            className="EditProfilArrow"
                            name='arrow circle left'
                            size="huge"
                            onClick={prevSection}/>
                        <Icon
                            className="EditProfilArrow"
                            name='arrow circle right'
                            size="huge"
                            onClick={nextSection}/>
                    </Grid.Row>
                </Grid>
            </div>
            )

    }
}

export default AddInterests;