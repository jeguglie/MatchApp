import React from 'react';
import { withRouter } from "react-router";
import UserMiniCard from "../../components/UserMiniCard/UserMiniCard";
import API from './../../utils/API';
import InputRange from 'react-input-range';
import InfiniteScroll from 'react-infinite-scroller';
import {Button, Grid, Segment, Divider, Checkbox, Icon} from "semantic-ui-react";
import 'react-input-range/lib/css/index.css';
import Aux from './../../hoc/Aux';
import ModalUser from '../../components/ModalUser/ModalUser';
import SearchTags from './SearchTags/SearchTags'

const DEFAULT_STATE = {
    loadingModal: '',
    nextUsers: '',
    hasMoreContent: false,
    clear: false,
    users: [],
    warnings: [],
    loading: true,
    userView: false,
    userIdFocusLoading: null,
    interests: [],
    visible: false,
    ageFilterLoad: false,
    distanceFilterLoad: false,
    matchFilterLoad: false,
    aDescendant: false,
    dDescendant: false,
    distanceRange: 250,
    ageRange: {
        min: 19,
        max: 27,
    },
    popularityRange: {
        min: 0,
        max: 50,
    },
};
class Wall extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
        this._mounted = false;
        this.innerRefModal = React.createRef();
    }

    componentDidMount = async() => {
        this._mounted = true;
        this._mounted && this.setState({loading: true});
        await API.checkUserView()
            .then(res => {
                if (res.status === 200) {
                    this._mounted && this.setState({userView: true});
                    this.searchMatch();
                }
            })
            .catch( () => {
                this.props.history.push('/profile');
            });
            this._mounted && this.setState({loading: false});
    };

    componentWillUnmount() {
        this._mounted = false;
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

    // Search button handle
    searchMatch = async() => {
        this._mounted && this.setState({loading: true});
        const {distanceRange, ageRange, popularityRange } = this.state;
        let users = [];
        await API.getUsers(distanceRange, ageRange, popularityRange)
            .then(response => {
                if (response.status === 200)
                    users = response.data.users;
            });
        let nextUsers = 0;
        if(users.length > 20)
           nextUsers = users.slice(21);
        this._mounted && this.setState({
            nextUsers: nextUsers,
            users: users.slice(0, 21),
            hasMoreContent: users.length > 20
        });
        this._mounted && this.setState({loading: false});

    };


    clickedUser = async(userIdFocus) => {
        // Send notification
        this.props.sWallVisit(userIdFocus);
        // Inner Ref Modal
        this.innerRefModal.current && this.innerRefModal.current.loadUser(userIdFocus);
        this._mounted && this.setState({ loadingMinCard: true, userIdFocusLoad: userIdFocus});
    };
    handleCardUserComplete = () => this._mounted && this.setState({loading: false, loadingMinCardLoad: false});
    handleBottomPage = () => {
        const { nextUsers, users } = this.state;
        if (nextUsers.length){
            for (let i = 0; i < nextUsers.length && i <= 20; i++)
                users.push(nextUsers[i]);
            this._mounted && this.setState({users: users, nextUsers: nextUsers.slice(21)});
        }
        else
            this._mounted && this.setState({hasMoreContent: false});
    };

    // Filters
    ageFilter = () => {
        if (this.state.aDescendant === true)
            this._mounted && this.setState({loading: true, aDescendant: false});
        else
            this._mounted && this.setState({loading: true, aDescendant: true});
        let users = this.state.users;
        if (this.state.aDescendant === true)
            users.sort(function (a, b) {
                if (b.age === a.age)
                    return b.points - a.points;
                return b.age + a.age;
            });
        else
            users.sort(function (a, b) {
                if (b.age === a.age)
                    return b.points - a.points;
                return b.age - a.age;
            });
        this._mounted && this.setState({users: users, loading: false});
    };
    distanceFilter = () => {
        if (this.state.dDescendant === true)
            this._mounted && this.setState({loading: true, dDescendant: false});
        else
            this._mounted && this.setState({loading: true, dDescendant: true});
        let users = this.state.users;
        if (this.state.dDescendant === true)
            users.sort(function (a, b) {
                if (b.distance === a.distance)
                    return b.points - a.points;
                return b.distance + a.distance;
            });
        else
            users.sort(function (a, b) {
                if (b.distance === a.distance)
                    return b.points - a.points;
                return b.distance - a.distance;
            });
        this._mounted && this.setState({users: users, loading: false});
    };

    render() {
        const { hasMoreContent, loading, users, userIdFocusLoad, loadingMinCardLoad, distanceRange, ageRange, popularityRange } = this.state;
        const search = (
            <Aux>
                <Grid.Column mobile={16} tablet={6} computer={6} largeScreen={4} widescreen={3}>
                    <Segment inverted className="SegmentFilter">
                        <div className="filterContainer">
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
                            <Divider hidden/>
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
                            <Divider hidden/>
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
                                                        onClick={this.searchMatch}>
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
        );
        const userscards = (
            <Grid.Column>
                <Grid.Row>
                    <div className={'ButtonFilters'}>
                        <Button.Group size={'small'} widths={3} fluid>
                            <Button
                                onClick={this.ageFilter}
                                icon
                                labelPosition='left'>
                                <Icon name={this.state.aDescendant ? 'arrow down' : 'arrow up'}/>Age</Button>
                            <Button
                                onClick={this.distanceFilter}
                                icon
                                labelPosition='left'>
                                <Icon name={this.state.dDescendant ? 'arrow down' : 'arrow up'} />
                                Distance
                            </Button>
                            <Button
                                onClick={this.searchMatch}
                                icon
                                labelPosition='left'>
                                <Icon name='list ol' />
                                Match
                            </Button>
                        </Button.Group>
                    </div>
                </Grid.Row>
                <Divider hidden/>
                <Grid stackable >
                    <UserMiniCard
                        userIdFocus={userIdFocusLoad}
                        loading={loadingMinCardLoad}
                        users={users}
                        clickedUser={this.clickedUser}
                    />
                </Grid>
            </Grid.Column>
        );
            return (
                <div className="WallContainer">
                    <ModalUser handleCardUserComplete={this.handleCardUserComplete} s_like={this.props.s_like} s_like_unliked={this.props.s_like_unliked} s_like_likedback={this.props.s_like_likedback} ref={this.innerRefModal} />
                    <Grid centered columns={'equal'} stackable>
                        {search}
                        {userscards}
                    </Grid>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.handleBottomPage}
                        hasMore={hasMoreContent}
                    > </InfiniteScroll>
                </div>
            );
    }
}

export default withRouter(Wall);