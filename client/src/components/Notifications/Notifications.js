import React from 'react';
import openSocket from 'socket.io-client';
import ModalUserLike from "./ModalUserLike/ModalUserLike";

class Notifications extends React.Component {

    state = {
        userID: null,
    };
    componentDidMount() {
        this.socket = openSocket('http://localhost:3002');
        this.socket.on("sendlike", (userID) => {
            this.setState({userID: userID})
            console.log(userID);
        })
    }

    handleClose = () => {this.setState({userID: null})};
    render() {
        const { userID } = this.state;
        return (
            <div className="Notifications">
                <ModalUserLike userID={userID} handleClose={this.handleClose}/>
            </div>
        );
    }
}

export default Notifications;