import React from "react";
import { Button } from "react-bootstrap";

import API from "../../utils/API";

class Dashboard extends React.Component {
    disconnect = () => {
        API.logout();
        window.location = "/";
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