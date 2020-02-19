import React from 'react';
import {List, Image, Button, Transition, Grid, Divider} from 'semantic-ui-react';
import API from 'Src/utils/API';
import ModalUser from "Src/components/ModalUser/ModalUser";
const moment = require('moment');


class NotificationsHistory extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            notifications: [],
            userIdFocus: null,
            loading: false,
            interests: [],
        };
        this._mounted = false;
        this.innerRefModal = React.createRef();

    }

    componentDidMount = async() => {
        this._mounted = true;
        await API.getNotifications()
            .then(res => {
                if (res.status === 200)
                    this._mounted && this.setState({notifications: res.data.notifications})
            });
        await API.getUserInterests()
            .then(response => {
                if (response.status === 200)
                    this._mounted && this.setState({interests: response.data.interests})
            });
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
            case 5:
                return 'Like your profile  ';
            default:
                return null;
        }
    };

    handleDismiss = async(i, notif_id) => {
        if (this._mounted) {
            this.state.notifications.splice(i, 1);
            this._mounted && this.setState({notifications: this.state.notifications}, async() => {
                await API.deletenotif(notif_id);
                await this.props.updateNotifNb();
            });
        }
    };

    clickedUser = async(userIdFocus) => {
        // Send notification
        this.props.sWallVisit(userIdFocus);
        // Inner Ref Modal
        this.innerRefModal.current && this.innerRefModal.current.loadUser(userIdFocus);
    };

    updateNotifs = async() => {
        await API.getNotifications()
            .then(async(res) => {
                if (res.status === 200) {
                    this._mounted && this.setState({notifications: res.data.notifications});
                    this.props.updateNotifNb();
                }
            })
    };


    render(){
        const { notifications, interests } = this.state;
        return (
            <Grid columns={1} textAlign={'center'}>
                    <ModalUser
                        interests={interests}
                        s_like={this.props.s_like}
                        s_like_unliked={this.props.s_like_unliked}
                        s_like_likedback={this.props.s_like_likedback}
                        ref={this.innerRefModal} />
                <Grid.Column textAlign={'left'} mobile={16} tablet={8} computer={8} largeScreen={8} widescreen={8}>
                    <div className='NotificationsTitle'>
                        <Grid.Row>
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
                                {notifications.length < 1 ?
                                    <div className={'nothingtoshow'}>
                                        <p>Nothing to show</p>
                                    </div> :
                                    null
                                }
                                {notifications.map((obj, i) => (
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
                                        {i < notifications.length  - 1? <Divider /> : null}
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

export default NotificationsHistory;