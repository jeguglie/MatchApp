import React from 'react';
import { subscribeToTimer } from '../../utils/socket';

class Notifications extends React.Component {

    state = {
        timestamp: 'no timestamp yet'
    };

    constructor(props) {
        super(props);  subscribeToTimer((err, timestamp) => this.setState({
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
        );
    }
}

export default Notifications;