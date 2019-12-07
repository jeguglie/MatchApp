import React from "react";
import { Button } from "react-bootstrap";

class Dashboard extends React.Component {
    disconnect = () => {
        fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    this.props.history.push('/login');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                this.setState({warnings: ["Wrong username or password"]});
            });
    };
    render() {
        return (
            <div className="Dashboard">
                <h1>Dashboard</h1>
                <Button onClick={this.disconnect} block bsize="large" type="submit">
                    Se déconnecter
                </Button>
            </div>
        );
    }
}

export default Dashboard;