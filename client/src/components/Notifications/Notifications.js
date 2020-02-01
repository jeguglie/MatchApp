import React from 'react';
import openSocket from 'socket.io-client';
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
    }

    componentDidMount() {
        this.socket.on("like:receive like", (data) => {
            store.addNotification({
                title: data.userIDemitter.toString(),
                message: "Liked your profile",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 10000,
                    onScreen: true
                }
            });
        });
        this.socket.on("wall:visit", (data) => {
            store.addNotification({
                title: data.userIDemitter.toString(),
                message: "Visited your profile",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 10000,
                    onScreen: true
                }
            });
        })
    }

    handleClose = () => {this.setState({userID: null})};
    render() {
        return (
            <div className="Notifications">
                <ReactNotification />
            </div>
        );
    }
}

export default Notifications;