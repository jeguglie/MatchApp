import React from 'react';
import {List, Image, Button, Transition, Grid, Divider, Icon} from 'semantic-ui-react';
import API from 'Src/utils/API';
import ModalUser from "Src/components/ModalUser/ModalUser";
import ModalChat from 'Src/components/ModalChat/ModalChat';
const moment = require('moment');

class Chat extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            matchedusers: [],
            interests: [],
            userIdFocus: null
        };
        this._mounted = false;
        this.innerRefModal = React.createRef();
        this.innerRefModalChat = React.createRef();
    }

    // Sockets
    s_message_receive = (message, user_id_emitter, user_id_receiver) => { this.innerRefModalChat && this.innerRefModalChat.current && this.innerRefModalChat.current.addMessage(message, user_id_emitter, user_id_receiver)};

    componentDidMount = async() => {
        this._mounted = true;
        await API.getMatchedUsers()
            .then(res => {
                if (res.status === 200) {
                    this._mounted && this.setState({matchedusers: res.data.matchedusers})
                }
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

    clickedUser = async(userIdFocus) => {
        // Send notification
        this.props.sWallVisit(userIdFocus);
        // Inner Ref Modal
        this.innerRefModal.current && this.innerRefModal.current.loadUser(userIdFocus);
    };


    // Open modal chat with ref
    handleOpenChat = async(user) => { this.innerRefModalChat.current && this.innerRefModalChat.current.handleOpen(user) };
    render(){
        const { matchedusers, interests } = this.state;
        return (
            <Grid columns={1} textAlign={'center'}>
                <ModalUser
                    interests={interests}
                    s_like={this.props.s_like}
                    s_like_unliked={this.props.s_like_unliked}
                    s_like_likedback={this.props.s_like_likedback}
                    ref={this.innerRefModal} />
                <ModalChat
                    ref={this.innerRefModalChat}
                    s_message_send={this.props.s_message_send}
                />
                <Grid.Column textAlign={'left'} mobile={16} tablet={8} computer={8} largeScreen={8} widescreen={8}>
                    <div className='ChatTitle'>
                        <Grid.Row>
                            <h1>Matched users chat</h1>
                        </Grid.Row>
                    </div>
                    <div className={"ChatHistoric"}>
                        <Grid.Row>
                            <Transition.Group
                                as={List}
                                duration={200}
                                verticalAlign='middle'
                            >
                                {matchedusers.length < 1 ?
                                    <div className={'nothingtoshow'}>
                                        <p>No matched users</p>
                                    </div> :
                                    null
                                }
                                {matchedusers.map((obj, i) => (
                                    <List.Item key={i}>
                                        <List.Content>
                                            <List.Content floated='right'>
                                                <Button
                                                    onClick={() => this.handleOpenChat(obj)}>
                                                    Open chat
                                                </Button>
                                            </List.Content>
                                            <Image avatar src={obj.img_link}/>
                                            <List.Content
                                                as='a'
                                                className={"ChatFirstname"}
                                                onClick={() => this.clickedUser(obj.user_id)}>
                                                {' '} {obj.firstname}</List.Content>
                                            <List.Description className={"ChatDesc"}>
                                                <p>
                                                    {obj.online ?
                                                        <span className={'OnlineChat'}>
                                                            <Icon name={'circle'} />
                                                            Online
                                                        </span> :
                                                        <span className={'LastConnectionChat'}>
                                                            <Icon name={'circle'} />
                                                            Online {moment(obj.last_date_online).fromNow()}
                                                        </span>
                                                    }
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                        {i < matchedusers.length - 1? <Divider /> : null}
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

export default Chat;