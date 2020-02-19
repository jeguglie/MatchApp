import {Divider, Grid, Image, Label, Modal, Segment, Icon} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import React from "react";
import classnames from 'classnames';
import ModalUserActions from "./ModalUserActions";
import API from "Src/utils/API";
const moment = require('moment');


const DEFAULT_STATE = {
    openHide: false,
    openReport: false,
    openFake: false,
    liked: false,
    interests: '',
    like: false,
    showModal: false,
    user: {
        lastname: '',
        firstname: '',
        interests: [],
        gender: [],
        interested: [],
        imgs: [],
        country: '',
        last_date_online: '',
        bio: '',
        age: '',
        likes: ''
    },
};

class ModalUser extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
        this._mounted = false;
        this.state.interests = this.props.interests

    }

    componentDidMount = async() => {
        this._mounted = true;
    };
    componentWillUnmount() {
        this._mounted && this.setState({...DEFAULT_STATE});
        this._mounted = false;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.interests !== prevState.interests) {
            return ({interests: nextProps.interests});
        }
        return null;
    }
    // Ref
    loadUser = (userIdFocus) => {
        API.getUserIdProfile(userIdFocus)
            .then(async (res) => {
                if (res.status === 200)
                    this._mounted && this.setState({user: res.data.user, showModal: true, liked: res.data.user.liked, like: res.data.like});
            });
    };

    // Like
    userLike = async(userIdFocus) => {
        await API.userLike(userIdFocus)
            .then(response => {
                if (response.status === 200 && typeof response.data.liked != 'undefined') {
                    this._mounted && this.setState({liked: response.data.liked});
                    if (response.data.liked) this.props.s_like(userIdFocus);
                    if (response.data.unliked) this.props.s_like_unliked(userIdFocus);
                    if (response.data.likedback) this.props.s_like_likedback(userIdFocus);
                }
            })
            .catch(err => console.log(err));
    };
    // Modal
    handleClose = () => {this._mounted && this.setState({ user: {...DEFAULT_STATE}, liked: false, showModal: false});};
    closeReport = () => { this._mounted && this.setState({openReport: false})};
    openReport = () => {this._mounted && this.setState({openReport: true})};
    closeFake = () => { this._mounted && this.setState({openFake: false})};
    openFake = () => {this._mounted && this.setState({openFake: true})};
    closeHide = () => { this._mounted && this.setState({openHide: false})};
    openHide = () => {this._mounted && this.setState({openHide: true})};
    render() {
        const {user, liked, like, showModal, openReport, openFake, openHide, interests } = this.state;
        return (
            showModal && typeof user.imgs !== 'undefined' ?
            <div>
                <ModalUserActions
                    openReport={openReport}
                    closeReport={this.closeReport}
                    openFake={openFake}
                    closeFake={this.closeFake}
                    openHide={openHide}
                    closeHide={this.closeHide}
                    userID={user.user_id}
                />
                <Modal
                    dimmer={"blurring"}
                    size={'tiny'}
                    open={showModal}
                    onClose={this.handleClose}
                    className="ModalCard"
                    closeIcon>
                    <Modal.Header className="CardHeader"><h1
                        className="CardHeaderTile"> {user.firstname} {user.lastname}, <strong>{user.age}</strong></h1>
                    </Modal.Header>
                    <Modal.Content className="ModalProfilView">
                        <p>
                            {user.online ?
                                <span className={'Online'}>
                                    <Icon name={'circle'} />
                                    Online
                                </span> :
                                <span className={'LastConnection'}>
                                     <Icon name={'circle'} />
                                    Online {moment(user.last_date_online).fromNow()}
                                </span>
                            }
                        </p>
                        {like ?
                            <span className={'spanLike'}>
                                <Icon name={'heart'} />
                                Like your profile
                            </span> :
                            null
                        }
                        <Divider hidden/>
                        <Grid centered columns={2}>
                            <Grid.Column className="RowImages">
                                <Image rounded size='medium' src={user.imgs[0]}/>
                            </Grid.Column>
                            <Grid.Row className="RowImages" centered columns={4}>
                                {user.imgs.map((img, i) => {
                                    if (i > 0)
                                        return (
                                            <Grid.Column key={i}>
                                                <Image rounded size='small' src={user.imgs[i]}/>
                                            </Grid.Column>
                                        );
                                    return null;
                                })}
                            </Grid.Row>
                        </Grid>
                        <Modal.Description>
                            {user.bio && user.bio.length ?
                                <Segment className="BioSegment" textAlign="center" inverted>
                                    <p>{user.bio}</p>
                                </Segment> : <Divider hidden />
                            }
                            <Segment basic textAlign={'center'}>
                                <Button.Group fluid widths={4}>
                                    <Button size='small' id='like' onClick={() => this.userLike(user.user_id)}>
                                        <Icon name='heart'/>
                                        {liked ? 'Unlike' : 'Like'}
                                    </Button>
                                    <Button size='small' id='hide' onClick={this.openHide}>
                                        <Icon name='user x'/>
                                        Hide
                                    </Button>
                                    <Button size='small' id='fake' onClick={this.openFake}>
                                        <Icon name='user secret'/>
                                        Fake
                                    </Button>
                                    <Button size='small' id='blockuser' onClick={this.openReport}>
                                        <Icon name='warning'/>
                                        Signal
                                    </Button>
                                </Button.Group>
                            </Segment>
                            <Divider hidden/>
                            <Label.Group size='small'>
                                <p/>
                                {user.interests.map((data, i) => {
                                    return (
                                        <Label
                                            className={interests.find(interest => interest === data) ? classnames("interestLabel","sameInterest") : "interestLabel"}
                                            id={i}
                                            key={i}
                                            data={data}>
                                            <strong>#</strong>{data}</Label>
                                    )
                                })}
                            </Label.Group>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </div> : null
        )
    }
}

export default ModalUser;