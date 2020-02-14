import React from 'react';
import {Form, Modal, Input, Divider, Icon } from 'semantic-ui-react'
import API from '../../utils/API';
const moment = require('moment');

class ModalChat extends React.Component {
    constructor(props){
        super(props);
        this._mounted = false;
        this.state = {
            showModal: false,
            user: [],
            messages: [],
        };
        this.innerRef = React.createRef();

    }

    componentDidMount() {
        this._mounted = true;
    }

    // Outside Ref
    handleOpen = async(user) => {
        this._mounted && this.setState({showModal: true, user: user});
        await API.getMessages(user.user_id)
            .then(res => {
                if (res.status === 200)
                    this._mounted && this.setState({messages: res.data.messages});
            })
    };
    handleClose = () => {this._mounted && this.setState({showModal: false, user: [], messages: []})};
    handleSend = async() => {
        const message = this.innerRef.current.inputRef.current.value.toString();
        const { user_id } = this.state;
        await API.sendMessage(user_id, message)
            .then(res => {
                if (res.status === 200) {
                    this.addMessage(message, true);
                    this.props.s_message_send(user_id, message);
                }
            })
    };

    addMessage = (message, bool) => {
        this._mounted && this.setState(prevState => {
            prevState.messages.push({
                user_id: bool,
                user_id_dest: bool,
                timestamp: new Date().getDate(),
                message: message
            })
        });
    };

    render(){
        const { showModal, user } = this.state;
        function userOnline() {
            if (user.online)
                return <span className={'OnlineChat'}> <Icon name={'circle'}/> </span>;
            else
                return <span className={'LastConnectionChat'}> <Icon name={'circle'}/> </span>
        };
        return (
            user ?
                <Modal
                    className={'ModalChat'}
                    size={'tiny'}
                    open={showModal}
                    onClose={this.handleClose}
                    closeIcon>
                    <Modal.Header className={'HeaderChat'}>
                        {userOnline()} {' '}
                        <span className={'chatUserBadge'}>{user.firstname}</span>
                    </Modal.Header>
                    <Divider hidden />
                    <Modal.Content scrolling className={'ModalChatContent'}>
                        <div className={'inputChat'}>
                            <Form onSubmit={this.handleSend}>
                                <Input
                                    size='large'
                                    action={{ icon: 'send' }}
                                    fluid
                                    ref={this.innerRef}
                                    placeholder='Type a message...'
                                />
                            </Form>
                        </div>
                    </Modal.Content>
                </Modal> : null
        )
    }
}

export default ModalChat;