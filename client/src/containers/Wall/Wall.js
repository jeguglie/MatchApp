import React from 'react';
import { withRouter } from "react-router";
import UserMiniCard from "Src/components/UserMiniCard/UserMiniCard";
import API from 'Src/utils/API';
import InfiniteScroll from 'react-infinite-scroller';
import { Button, Grid, Divider, Icon } from "semantic-ui-react";
import ModalUser from 'Src/components/ModalUser/ModalUser';
import { store } from "react-notifications-component";
import Filter from 'Src/containers/Wall/Filter/Filter';

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
    userInterests: [],
    visible: false,
    aDescendant: false,
    dDescendant: false,
    distanceRange: 250,
    ageRange: {
        min: 18,
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
        this.innerRef = React.createRef();
    }

    componentDidMount = async() => {
        this._mounted = true;
        this._mounted && this.setState({loading: true});
        await API.checkUserView()
            .then(async(res) => {
                if (res.status === 200) {
                    await API.getUserInterests()
                        .then(response => {
                            if (response.status === 200)
                                this._mounted && this.setState({interests: response.data.interests, userInterests: response.data.interests})
                        });
                    this._mounted && this.setState({userView: true});
                    this.searchMatch(this.state.distanceRange, this.state.ageRange, this.state.popularityRange, []);
                }
            })
            .catch( () => {
                store.addNotification({
                    message: "Please complete your profile",
                    type: "info",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
                this.props.history.push('/profile');
            });
    };

    componentWillUnmount() {
        this._mounted = false;
    }

    // Search button handle
    searchMatch = async(distanceRange, ageRange, popularityRange, interests) => {
        this._mounted && this.setState(prevState => ({loading: true, interests: interests && interests.length ? interests : prevState.userInterests}));
        let users = [];
        await API.getUsers(distanceRange, ageRange, popularityRange, interests)
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
        const {aDescendant } = this.state;
        this.setState({loading: true});
        this.innerRef.current && this.innerRef.current.ageFilter(aDescendant);
        this.setState({aDescendant: !aDescendant, loading: false});
    };

    distanceFilter = () => {
        const {dDescendant } = this.state;
        this.setState({loading: true});
        this.innerRef.current && this.innerRef.current.distanceFilter(dDescendant);
        this.setState({dDescendant: !dDescendant, loading: false});
    };

    render() {
        const { hasMoreContent, loading, users, aDescendant, interests, dDescendant, userIdFocusLoad} = this.state;
        const userscards = (
            <Grid.Column>
                <Grid.Row>
                    <div className={'ButtonFilters'}>
                        <Button.Group size={'small'} widths={3} fluid>
                            <Button
                                onClick={this.ageFilter}
                                icon
                                labelPosition='left'>
                                <Icon name={aDescendant ? 'arrow down' : 'arrow up'}/>Age</Button>
                            <Button
                                onClick={this.distanceFilter}
                                icon
                                labelPosition='left'>
                                <Icon name={dDescendant ? 'arrow down' : 'arrow up'} />
                                Distance
                            </Button>
                            <Button
                                onClick={() => this.searchMatch(this.state.distanceRange, this.state.ageRange, this.state.popularityRange, [])}
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
                    {!this.state.users.length && !this.state.loading ? <h1> No users found</h1> : null}
                    <UserMiniCard
                        userIdFocus={userIdFocusLoad}
                        inner
                        users={users}
                        ref={this.innerRef}
                        clickedUser={this.clickedUser}
                    />
                </Grid>
            </Grid.Column>
        );

        return (
            <div className="WallContainer">
                <ModalUser interests={interests} s_like={this.props.s_like} s_like_unliked={this.props.s_like_unliked} s_like_likedback={this.props.s_like_likedback} ref={this.innerRefModal} />
                <Grid centered columns={'equal'} stackable>
                    <Filter loading={loading} searchMatch={this.searchMatch} />
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