import React from 'react';
// import ModalUserLike from "./ModalUserLike/ModalUserLike";
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
    s_wallvisit(userIdFocus){this.socket.emit("wall:visit", userIdFocus)};
    s_like_likedback(userIdFocus){console.log(2);this.socket.emit("like:likedback", userIdFocus)};
    s_like_unlike(userIdFocus){console.log(1); this.socket.emit("like:unlike", userIdFocus)};
    s_like = (userIdFocus) => {this.socket.emit("like", userIdFocus)};
    s_userlogin = () => {this.socket.emit("userlogin")};
    s_logout = () => {this.socket.emit("disconnectuser")};

    componentDidMount() {
        this.socket.on("like:receive like", (data) => {
            this.props.updateNotifs();
            store.addNotification({
                title: data.useremitter,
                message: "Liked your profile",
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
                title: data.useremitter,
                message: "Visited your profile",
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
            store.addNotification({
                title: data.useremitter,
                message: "Like your profile back",
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
                title: data.useremitter,
                message: "Unlike your profile",
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