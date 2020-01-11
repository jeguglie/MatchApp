import React from 'react';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3002');

class Notifications extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        socket.on('like')
    }

    render() {
        return (
            <div className="App">
                <p className="App-intro">
                </p>
            </div>
        );
    }
}

export default Notifications;