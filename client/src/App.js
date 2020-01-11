import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Aux from './hoc/Aux';
import Signup from "./components/Signup/Signup.js";
import Wall from './containers/Wall/Wall';
import Login from "./components/Login/Login";
import EditProfile from "./components/EditProfil/EditProfil";
import withAuth from "./utils/withAuth";
import './App.scss';
import BootstrapMenu from './components/Menu/BootstrapMenu';
import Footer from './containers/Footer/Footer';
import API from "./utils/API";
import Notifications from "./components/Notifications/Notifications";

class App extends Component {

    state = {
        connected: false,
    };

    isConnected = (bool) => {
        console.log("bool ---> :" + bool);
        this.setState({connected: bool});
    };

    componentDidMount() {
        API.withAuth()
            .then(res => {
                if (res.status === 200) {
                    this.setState({connected: true});
                }
                else
                    throw new Error(res.error);
            })
            .catch(() => {this.setState({connected: false})});
    }

    render() {
        const { connected } = this.state;
        return (
            <Aux>
                <BootstrapMenu isConnected={connected} handleConnected={this.isConnected} />
                <Notifications />
                <div className="content">
                    <Switch>
                        <Route exact path="/wall" component={withAuth(Wall)} />
                        <Route exact path="/profile" component={withAuth(EditProfile)} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/login"
                               render={(props) => <Login {...props} handleConnected={this.isConnected} />}
                        />
                    </Switch>
                </div>
                <Footer />
            </Aux>
        );
    }
}
export default App;