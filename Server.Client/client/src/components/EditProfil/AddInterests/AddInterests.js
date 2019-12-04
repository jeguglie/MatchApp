import _ from 'lodash';
import React, {Component} from 'react';
import API from "../../../utils/API";
import classnames from "classnames";
import {Grid, Progress, Input, Icon, Divider, Search, Header, Segment, Container} from "semantic-ui-react";
import ReactSearchBox from '../../SearchBox/index'
import Interests from "./Interests/Interests";
import Warnings from '../../../components/Warnings/Warnings';
const DEFAULT_STATE = {
    interests: [],
    clear: false,
    isLoading: false,
    value: '',
    warnings: [],
    successAdd: [],
    results: [],
};


let DATA = [];

const ProgressBar = () => (
    <Progress
        percent={70}
        className="ProgressBarProfile"
        indicating
        progress
        size="large"/>
);

class AddInterests extends Component {

    constructor(props){
        super(props);
        this.state = DEFAULT_STATE;
    }

    async componentDidMount() {
        try {
            const { data } = await API.getInterests();
            DATA = data.results;
            console.log(DATA);
        } catch (error) {
            console.log(error);
        }
    }

    handleResultSelect = (e, { result }) => this.setState({ value: result.title.trim() })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value});

        setTimeout(async () => {
            if (this.state.value.length < 1) return this.setState(DEFAULT_STATE);
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(DATA, isMatch),
            })
        }, 300)
    };

    handleKeyDown = async (data) => {
        if (data.key === 'Enter') {
            const regex = new RegExp('[^A-Za-z0-9]');
            const interests = this.state.interests;
            const new_interest = data.target.value;
            const warnings = [];
            // Parsing check Interest
            if (!new_interest || new_interest.length < 3)
                warnings.push("Your interest must contain between 3 and 20 characters");
            if (regex.test(new_interest))
                warnings.push("Your interest is not valid. Only letter and numeric value is accepted");
            // If there is no warnings
            if (warnings.length < 1) {
                try {
                    const {data} = await API.addInterests(new_interest);
                    if (data.success) {
                       interests.push(new_interest);
                       this.setState({interests: interests, successAdd: data.warnings, value: ''});
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            this.setState({warnings: warnings});
        }
    };

    render() {
        const {isLoading, value, warnings, successAdd, results} = this.state;
        return(
            <div className="container-fluid centered">
                <div className={classnames("ui middle", "AddInterests")}>
                    <Grid columns={2} doubling>
                        <Grid.Column>
                            <h1 className="CompleteTitle">Add interests</h1>
                        </Grid.Column>
                        <Grid.Column>
                            <ProgressBar />
                        </Grid.Column>
                    </Grid>
                    <Divider hidden />
                    <Divider hidden />
                    <Grid  verticalAlign={"middle"}>
                        <Grid.Row centered>
                            <div className="loginWarnings">
                                <Warnings data={warnings}/>
                                <Warnings data={successAdd}/>
                            </div>
                        </Grid.Row>
                        <Grid.Row centered>
                            <Interests
                                interests={this.state.interests}
                            />
                        </Grid.Row>
                        <Grid.Row centered>
                            <h1 className="InterestsTitle">Tell us what do you like</h1>
                        </Grid.Row>
                        <Grid.Row centered>
                            <Search
                                onKeyDown={this.handleKeyDown}
                                size="huge"
                                loading={isLoading}
                                onResultSelect={this.handleResultSelect}
                                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                    leading: true,
                                })}
                                results={results}
                                value={value}
                                {...this.props}
                            />
                        </Grid.Row>
                    </Grid>
                    <Divider hidden />
                    <Divider hidden />
                    <Grid>
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle left outline'
                                  size="huge"
                                  onClick={this.props.prevSection}/>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right outline'
                                  size="huge"
                                  onClick={this.props.nextSection}/>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
            )

    }
}

export default AddInterests;