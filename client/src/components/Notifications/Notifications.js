import React from 'react';
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';
import './react-notifications-component.css';
import io from 'socket.io-client';

const url = process.env.SERVER_LOCALHOST === JSON.stringify(true) ? 'http://localhost:5000' : `https://matchappli.herokuapp.com`;

class Notifications extends React.Component {

    constructor(props){
     super(props);
        this.state = { userID: null };
        this.socket = io(url);
        this._mounted = false;
    };
    // Sockets chat
    s_message_send(to_user_id, message){this.socket.connected && this.socket.emit("message:send", to_user_id, message)};
    // Sockets
    s_wallvisit(userIdFocus){this.socket.connected && this.socket.emit("wall:visit", userIdFocus)};
    s_like_likedback(userIdFocus){this.socket.connected && this.socket.emit("like:likedback", userIdFocus)};
    s_like_likedbackreturn(userIdFocus){this.socket.connected && this.socket.emit("like:likedbackreturn", userIdFocus)};
    s_like_unliked(userIdFocus){this.socket.connected && this.socket.emit("like:unlike", userIdFocus)};
    s_like = (userIdFocus) => {this.socket.connected && this.socket.emit("like", userIdFocus)};
    s_userlogin = (token) => {this.socket.connected && this.socket.emit("userlogin", token)};
    s_logout = () => {this.socket.connected && this.socket.emit("disconnect")};

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
            this.socket.on("message:receive", (data) => {
                if (window.location.pathname !== '/chat') {
                    this.props.updateNotifs();
                    store.addNotification({
                        message: data.useremitter + " send you a message",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }
            this.props.s_message_receive(data.message, data.user_id_emitter, data.user_id_receiver)
        });
        this.socket.on("like:receive like", (data) => {
            this.props.updateNotifs();
            store.addNotification({
                message: data.useremitter + " liked your profile",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        });
        this.socket.on("wall:visit", (data) => {
            this.props.updateNotifs();
            store.addNotification({
                message: data.useremitter + " visited your profile",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        });
        this.socket.on("like:likedback", (data) => {
            this.props.updateNotifs();
            this.s_like_likedbackreturn(parseInt(data.userIDemitter));
            store.addNotification({
                message: data.useremitter + " like your profile back. It's a Match !",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });

        });
        this.socket.on("like:likedbackreturn", (data) => {
            this.props.updateNotifs();
            store.addNotification({
                title: "It's a Match!",
                message: "You and " + data.useremitter + " like each others.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        });
        this.socket.on("like:unlike", (data) => {
            this.props.updateNotifs();
            store.addNotification({
                message: data.useremitter + " unlike your profile",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        });
    }

    render() {
        return (
            <div className="Notifications">
                <ReactNotification />
            </div>
        )
    }
}

export default Notifications;