import React from 'react';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import io from 'socket.io-client';
class Notifications extends React.Component {

    state = {
        userID: null,
    };
    constructor(props){
     super(props);
     this.socket = io('http://localhost:8000');
    };

    // Sockets
    s_wallvisit(userIdFocus){this.socket.connected && this.socket.emit("wall:visit", userIdFocus)};
    s_like_likedback(userIdFocus){this.socket.connected && this.socket.emit("like:likedback", userIdFocus)};
    s_like_likedbackreturn(userIdFocus){this.socket.connected && this.socket.emit("like:likedbackreturn", userIdFocus)};
    s_like_unliked(userIdFocus){this.socket.connected && this.socket.emit("like:unlike", userIdFocus)};
    s_like = (userIdFocus) => {this.socket.connected && this.socket.emit("like", userIdFocus)};
    s_userlogin = () => {this.socket.connected && this.socket.emit("userlogin")};
    s_logout = () => {this.socket.connected && this.socket.emit("disconnectuser")};

    componentDidMount() {
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
        );
    }
}

export default Notifications;