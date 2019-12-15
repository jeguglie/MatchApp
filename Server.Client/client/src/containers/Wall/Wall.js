import React from 'react';
import UserMiniCard from "../../components/UserMiniCard/UserMiniCard";
import API from './../../utils/API';
import InputRange from 'react-input-range';
import Interests from "../../components/EditProfil/AddInterests/Interests/Interests";
import {
    Header,
    Image,
    Modal,
    Dimmer,
    Loader,
    Grid,
    Rail,
    Segment,
    Divider,
    Checkbox,
    Portal,
    Label,
    Icon
} from "semantic-ui-react";
import 'react-input-range/lib/css/index.css';
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import _ from "lodash";

const DEFAULT_STATE = {
    user: {
        lastname: '',
        firstname: '',
        interests: [],
        gender: [],
        interested: [],
        imgs: [],
        country: '',
        bio: '',
        age: '',
        likes: ''
    },
    showModal: false,
    userIdFocus: 0,
    clear: false,
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
class Wall extends React.Component {

    state = {...DEFAULT_STATE};
    componentDidMount = async() => {

        this.setState({loading: true});
        // Check if user can view users
        await API.checkUserView()
            .then(res => { this.canView = res.status === 200 })
            .catch(() => { this.props.history.push('/') });
        if(!this.canView)
            this.props.history.push('/')
        await this.searchMatch();
        this.setState({loading: false});
    };

    // Filter
    handleChange = async(value, id) => {
        if (id === "distanceRange")
            this.setState({distanceRange: value});
        else if (id === "ageRange")
            this.setState({ageRange: value});
        else if (id === "popularityRange")
            this.setState({popularityRange: value});
    };

    // Search button handle
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

    // Cliked user handle
    clickedUser = async(userIdFocus) => {
        await API.getUserIdProfile(userIdFocus)
            .then(res => {
                if (res.status === 200){
                    this.setState({
                        user: res.data.user,
                        userIdFocus: userIdFocus,
                        showModal: true
                    });
                    console.log(res.data.user);
                }
            })
    };
    handleClose = () => {
        this.setState({ userIdFocus: null, showModal: false})
    }
    render() {
        const { user, showModal, users, loading, distanceRange, ageRange, popularityRange, interests } = this.state;

            return (
                <div className="WallContainer">
                    <Modal
                        dimmer={"blurring"}
                        size={'tiny'}
                        open={showModal}
                        onClose={this.handleClose}
                        className="CardModal">
                        <Modal.Header className="CardHeader"><h1 className="CardHeaderTile"> {user.firstname} {user.lastname}, <strong>{user.age}</strong></h1></Modal.Header>
                        <Modal.Content  className="ModalProfilView" >
                            <Modal.Header></Modal.Header>
                            <Divider hidden/>
                                <Grid centered columns={2}>
                                    <Grid.Column className="RowImages">
                                        <Image rounded size='medium' src={user.imgs[0]} />
                                    </Grid.Column>
                                    <Grid.Row className="RowImages" centered columns={user.imgs.length}>
                                        {user.imgs.map((img, i) => {
                                            if (i > 0)
                                                return (
                                                    <Grid.Column>
                                                        <Image rounded size='small' src={user.imgs[i]}/>
                                                    </Grid.Column>
                                                )
                                        })}
                                    </Grid.Row>
                                </Grid>
                            <Divider hidden />
                            <Modal.Description>
                                <Segment  className="BioSegment" textAlign="center" inverted>
                                    <p>{user.bio}</p>
                                </Segment>
                                <Label.Group size='small'>
                                    <p />
                                    {user.interests.map((data, i) => {
                                        return (
                                            <Label className="interestLabel"
                                                   id={i}
                                                   key={i}
                                                   data={data}>
                                                <strong>#</strong>{data}</Label>
                                        )
                                    })}
                                    <Divider hidden />
                                </Label.Group>
                            </Modal.Description>
                        </Modal.Content>
                            <Icon
                                className="ButtonLike"
                                icon='heart'
                            />
                    </Modal>
                    <Dimmer active={loading}>
                        <Loader size='massive'/>
                    </Dimmer>
                    <Grid centered columns={'equal'} stackable>
                        <Grid.Column mobile={16} tablet={6} computer={6} largeScreen={4} widescreen={3}>
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
                            <Grid.Column>
                                {/*<Segment inverted>*/}
                                {/*</Segment>*/}
                                {/*<Divider hidden/>*/}
                                        <Grid stackable  >
                                            <UserMiniCard
                                                users={users}
                                                clickedUser={this.clickedUser}
                                            />
                                        </Grid>
                            </Grid.Column>
                    </Grid>
                </div>
            );
    }
}


export default Wall;