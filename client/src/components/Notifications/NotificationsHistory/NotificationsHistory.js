import React from 'react';
import {List, Image, Button, Transition, Grid, Divider} from 'semantic-ui-react';
import API from '../../../utils/API';
import ModalUser from "../../ModalUser/ModalUser";
const moment = require('moment');
export default class NotificationsHistory extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            notifications: [],
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
            liked: false,
            showModal: false,
            interests: [],
        };
        this._mounted = false;
    }

    componentDidMount = async() => {
        this._mounted = true;
        await API.getNotifications()
            .then(response => {
                if (response.status === 200) {
                    this._mounted && this.setState({notifications: response.data.notifications}, () => console.log(this.state.notifications));
                }
            })
            .catch(e => console.log(e));
    };

    componentWillUnmount() {
        this._mounted = false;
    }

    renderSwitchType(type) {
        switch (type) {
            case 1:
                return 'Visited your profile  ';
            case 2:
                return 'Send you a message  ';
            case 3:
                return 'Liked you back  ';
            case 4:
                return 'Remove his like  ';
        }
    };

    handleDismiss = async(i, notif_id) => {
        if (this._mounted) {
            this.state.notifications.splice(i, 1);
            this.setState({notifications: this.state.notifications});
            await API.deletenotif(notif_id)
                .catch(error => console.log(error));
        }
    };

    userLike = async(userIdFocus) => {
        await API.userLike(userIdFocus)
            .then(response => {
                if (response.status === 200 && typeof response.data.liked != 'undefined') {
                    this._mounted && this.setState({liked: response.data.liked});
                    // Socket
                    if (response.data.liked === true)
                        this.props.s_like(userIdFocus);
                }
            })
            .catch(err => console.log(err));
    };
    handleClose = () => {
        this._mounted && this.setState({ userIdFocus: null, showModal: false, liked: false})
    };

    clickedUser = async(userIdFocus) => {
        // Send notification
        this.props.s_wallvisit(userIdFocus);
        API.wallvisit(userIdFocus);
        await API.checkUserLike(userIdFocus)
            .then(response => {
                if (response.status === 200 && typeof response.data.liked != 'undefined')
                    this._mounted && this.setState({liked: response.data.liked});
            })
            .catch(e => console.log(e));
        await API.getUserIdProfile(userIdFocus)
            .then(res => {
                if (res.status === 200){
                    this._mounted && this.setState({
                        user: res.data.user,
                        userIdFocus: userIdFocus,
                        showModal: true
                    });
                }
            });
    };
    render(){
        const { user, liked, showModal, interests } = this.state;
        return (
            <Grid columns={1} textAlign={'center'}>
                <ModalUser showModal={showModal} user={user} liked={liked} userLike={this.userLike} handleClose={this.handleClose} userInterests={interests} />
                <Grid.Column textAlign={'left'} mobile={16} tablet={8} computer={8} largeScreen={8} widescreen={8}>
                    <div className='NotificationsTitle'>
                        <Grid.Row >
                            <h1>Notifications history</h1>
                        </Grid.Row>
                    </div>
                    <div className={"NotificationsHistoric"}>
                        <Grid.Row>
                            <Transition.Group
                                as={List}
                                duration={200}
                                verticalAlign='middle'
                            >
                                {!this.state.notifications.length ?
                                    <div className={'nothingtoshow'}>
                                        <p>Nothing to show</p>
                                    </div> :
                                    null
                                }
                                {this.state.notifications.map((obj, i) => (
                                    <List.Item key={i}>
                                        <List.Content>
                                            <List.Content floated='right'>
                                                <Button
                                                    onClick={() => this.handleDismiss(i, obj.notif_id)}>
                                                    Dismiss
                                                </Button>
                                            </List.Content>
                                            <Image avatar src={obj.img_link}/>
                                            <List.Content
                                                as='a'
                                                className={"NotifFirstname"}
                                                onClick={() => this.clickedUser(obj.user_id)}
                                            >
                                                {' '} {obj.firstname}</List.Content>
                                            <List.Description className={"NotifDesc"}>
                                                {this.renderSwitchType(obj.type)}
                                                on {moment(obj.date).fromNow()}
                                            </List.Description>
                                        </List.Content>
                                        {i < this.state.notifications.length  - 1? <Divider /> : null}
                                    </List.Item>
                                ))}
                            </Transition.Group>
                        </Grid.Row>
                    </div>
                </Grid.Column>
            </Grid>
        )
    }
}