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
import NotificationsHistory from "./components/Notifications/NotificationsHistory/NotificationsHistory";
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassword from './components/ForgotPassword/ChangePassword';
import ChangeMyEmail from "./components/EditProfil/ChangeMyMail/ChangeMyMail";
import io from 'socket.io-client';


class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            connected: false,
        };
        this._mounted = false;
        this.socket = io('http://localhost:8000');
        this.s_wallvisit = this.s_wallvisit.bind(this);
    }

    // Sockets
    s_wallvisit(userIdFocus){this.socket.emit("wall:visit", userIdFocus)};
    s_like = (userIdFocus) => {this.socket.emit("like", userIdFocus)};
    s_userlogin = () => {this.socket.emit("userlogin")};
    s_logout = () => {this.socket.emit("logout")};
    isConnected = (bool) => {
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
                <Notifications push/>
                <div className="content">
                    <Switch>
                        <Route exact path="/" component={withAuth(Wall, 'test={"test"}')} />
                        <Route exact path="/profile" component={withAuth(EditProfile)} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/forgotpassword/:token" component={ChangePassword} />
                        <Route exact path="/forgotpassword" component={ForgotPassword} />
                        <Route exact path="/changepassword" component={ChangePassword} />
                        <Route exact path="/changemail" component={withAuth(ChangeMyEmail)} />
                        <Route exact path="/notifications" component={withAuth(NotificationsHistory)} />
                        <Route exact isConnected={connected} path="/login" render={(props) => <Login {...props} handleConnected={this.isConnected} />} />
                        <Route exact path={"/login/:token"} component={Login} />
                    </Switch>
                </div>
                <Footer />
            </Aux>
        );
    }
}
export default App;