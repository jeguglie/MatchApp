import './App.scss';
import React, { Component } from "react";
import { Route, Switch, Redirect} from "react-router-dom";
import Signup from "./components/Signup/Signup.js";
import Wall from './containers/Wall/Wall';
import Admin from './containers/Admin/Admin';
import Chat from './containers/Chat/Chat';
import Login from "./components/Login/Login";
import EditProfile from "./components/EditProfil/EditProfil";
import withAuth from "./utils/withAuth";
import withAuthAdmin from "./utils/withAuthAdmin";
import Menu from './components/Menu/Menu';
import Notifications from "./components/Notifications/Notifications";
import NotificationsHistory from "./components/Notifications/NotificationsHistory/NotificationsHistory";
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassword from './components/ForgotPassword/ChangePassword';
import ChangeMyEmail from "./components/EditProfil/ChangeMyMail/ChangeMyMail";
import ChangeLocation from "./components/EditProfil/ChangeLocation/ChangeLocation";
import Cookies from "universal-cookie";
const cookies = new Cookies();

class App extends Component {

    constructor(props) {
        super(props);
        this._mounted = false;
        this.innerRef = React.createRef();
        this.innerRefChat = React.createRef();
        this.innerRefSockets = React.createRef();
        this.innerRefNotifHistory = React.createRef();
        this._mounted = false;
    }

    componentDidMount() { this._mounted = true }

    // Notifications update
    updateNotifs = () => {
        this.innerRefNotifHistory && this.innerRefNotifHistory.current && this.innerRefNotifHistory.current.updateNotifs();
        this.innerRef && this.innerRef.current && this.innerRef.current.updateNotifNb();
    };
    updateNotifNbNavbar = async () => { this.innerRef &&  this.innerRef.current && this.innerRef.current.updateNotifNb() };

    // Chat Sockets
    s_message_send = (to_user_id, message, timestamp) => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_message_send(to_user_id, message, timestamp); };
    s_message_receive = (message, user_id_emitter, user_id_receiver) => { this.innerRefChat && this.innerRefChat.current && this.innerRefChat.current.s_message_receive(message, user_id_emitter, user_id_receiver) };

    // Sockets
    s_wallvisit = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_wallvisit(userIdFocus) };
    s_like_likedback = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_like_likedback(userIdFocus) };
    s_like_unliked = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_like_unliked(userIdFocus) };
    s_like = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_like(userIdFocus) };
    s_userlogin = (token) => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_userlogin(token) };
    s_logout = () => { this.innerRefSockets && this.innerRefSockets.current && this.innerRefSockets.current.s_logout() };

    // Handle Connect
    isConnected = (bool) => {
        this.innerRef && this.innerRef.current.handleConnected(bool);
        if (bool) {
            if (cookies.get('token'))
                this.s_userlogin(cookies.get('token'));
        }
    };

    render() {
        return (
            <div className={'Content'}>
                <Menu
                    ref={this.innerRef}
                    logout={this.s_logout}
                />
                <Notifications
                    ref={this.innerRefSockets}
                    s_message_receive={this.s_message_receive}
                    updateNotifs={this.updateNotifs}
                    push
                />
                <div className="content">
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={withAuth(() =>
                                <Wall
                                    sWallVisit={this.s_wallvisit}
                                    s_like_likedback={this.s_like_likedback}
                                    s_like_unliked={this.s_like_unliked}
                                    s_like={this.s_like} />)}
                        />
                        <Route exact path="/profile" component={withAuth(EditProfile)}/>
                        <Route exact path="/signup" component={Signup}/>
                        <Route exact path="/admin" component={withAuthAdmin(Admin)}/>
                        <Route exact path="/forgotpassword/:token" component={ChangePassword}/>
                        <Route exact path="/forgotpassword" component={ForgotPassword}/>
                        <Route exact path="/changepassword" component={withAuth(ChangePassword)}/>
                        <Route exact path="/changemail" component={withAuth(ChangeMyEmail)}/>
                        <Route exact path="/changelocation" component={withAuth(ChangeLocation)}/>
                        <Route
                            exact
                            path="/chat"
                            component={withAuth(() =>
                                <Chat
                                    ref={this.innerRefChat}
                                    s_message_send={this.s_message_send}
                                    sWallVisit={this.s_wallvisit}
                                    s_like_likedback={this.s_like_likedback}
                                    s_like_unliked={this.s_like_unliked}
                                    s_like={this.s_like} />)}
                        />
                        <Route
                            exact
                            path="/notifications"
                            component={withAuth(() =>
                            <NotificationsHistory ref={this.innerRefNotifHistory}
                               s_like_likedback={this.s_like_likedback}
                               s_like_unliked={this.s_like_unliked}
                               updateNotifNb={this.updateNotifNbNavbar}
                               sWallVisit={this.s_wallvisit}
                               s_like={this.s_like} />)}
                        />
                        <Route
                            exact
                            path="/login"
                            component={ (props) =>
                               <Login
                                   {...props}
                                   s_userlogin={this.s_userlogin}
                                   handleConnected={this.isConnected} />}
                        />
                        <Route exact path={"/login/:token"} component={Login}/>
                        <Redirect from="*" to=""/>
                    </Switch>
                </div>
            </div>
        );
    }
}
export default App;