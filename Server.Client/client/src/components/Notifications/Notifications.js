import React from 'react';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');


function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

class Notifications extends React.Component {

    state = {
        timestamp: 'nul',
    }
    constructor(props) {
        super(props);
        subscribeToTimer((err, timestamp) => this.setState({
            timestamp
        }));
    }

    render() {
        return (
            <div className="App">
                <p className="App-intro">
                    This is the timer value: {this.state.timestamp}
                </p>
            </div>
        )
    }
}

export default Notifications;