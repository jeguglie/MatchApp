import React from 'react';
import { Form, Modal, Input, Icon } from 'semantic-ui-react'
import API from 'Src/utils/API';

class ModalChat extends React.Component {
    constructor(props){
        super(props);
        this._mounted = false;
        this.state = {
            showModal: false,
            user: [],
            messages: [],
            message: ''
        };
        this.innerRefScroll = React.createRef();
    }

    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }

    // Outside Ref
    handleOpen = async(user) => {
        this._mounted && this.setState({showModal: true, user: user});
        await API.getMessages(user.user_id)
            .then(res => {
                if (res.status === 200)
                    this._mounted && this.setState({messages: res.data.messages}, () => {
                        this.innerRefScroll && this.innerRefScroll.current && this.innerRefScroll.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'end',
                            inline: 'end',
                        });
                    });
            })
    };
    handleClose = () => {this._mounted && this.setState({showModal: false, user: [], messages: []})};
    handleSend = async() => {
        const message = this.state.message;
        const user_id = this.state.user.user_id;
        // Clear value in input
        if (message && message.length)
            await API.sendMessage(user_id, message)
                .then(res => {
                    if (res.status === 200) {
                        this.addMessage(message, true);
                        this._mounted && this.props.s_message_send(user_id, message);
                    }
                })
    };

    addMessage = (message, user_id_emitter, user_id_receiver) => {
        let messages = this.state.messages;
        messages.push({
            user_id: user_id_emitter,
            user_id_dest: user_id_receiver,
            timestamp: new Date().getDate(),
            message: message
        });
        this._mounted && this.setState({messages: messages, message: ''}, () => {
            this.innerRefScroll && this.innerRefScroll.current && this.innerRefScroll.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'end',
            });
        });
    };

    handleChange = (e, { value}) => { this._mounted && this.setState({message: value}); };

    render(){
        const { showModal, user, messages, message } = this.state;
        function userOnline() {
            if (user.online)
                return <span className={'OnlineChat'}> <Icon name={'circle'}/> </span>;
            else
                return <span className={'LastConnectionChat'}> <Icon name={'circle'}/> </span>
        }
        function messagesRows() {
            let user_id = user.user_id;
            if (messages && messages.length){
                return messages.map( (obj, i) => {
                    return (
                        <div key={i} className={obj.user_id === user_id ? 'yours messages' : 'mine messages'}>
                            <div  className={'message'}>
                                <p> {obj.message} </p>
                            </div>
                        </div>
                    )
                })
            }
        }
        return (
            user ?
                <Modal
                    className={'ModalChat'}
                    size={'tiny'}
                    open={showModal}
                    onClose={this.handleClose}
                    closeIcon >
                    <Modal.Header className={'HeaderChat'}>
                        {userOnline()} {' '}
                        <span className={'chatUserBadge'}>{user.firstname}</span>
                    </Modal.Header>
                    <Modal.Content scrolling className={'ModalChatContent'}>
                        <div className={'messagesRows'}>
                            <div ref={this.innerRefScroll} className={'chat'}>
                                    {messagesRows()}
                            </div>
                        </div>
                    </Modal.Content>
                    <Modal.Actions className={'inputChat'}>
                            <Form onSubmit={this.handleSend}>
                                <Input
                                    size='large'
                                    action={{ icon: 'send' }}
                                    fluid
                                    value={message}
                                    onChange={this.handleChange}
                                    placeholder='Type a message...'
                                />
                            </Form>
                    </Modal.Actions>
                </Modal> : null
        )
    }
}

export default ModalChat;