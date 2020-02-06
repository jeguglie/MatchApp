import React, { Component } from "react";
import { Route, Switch, Redirect} from "react-router-dom";
import Signup from "./components/Signup/Signup.js";
import Wall from './containers/Wall/Wall';
import Login from "./components/Login/Login";
import EditProfile from "./components/EditProfil/EditProfil";
import withAuth from "./utils/withAuth";
import './App.scss';
import BootstrapMenu from './components/Menu/BootstrapMenu';
import Footer from './containers/Footer/Footer';
import Notifications from "./components/Notifications/Notifications";
import NotificationsHistory from "./components/Notifications/NotificationsHistory/NotificationsHistory";
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassword from './components/ForgotPassword/ChangePassword';
import ChangeMyEmail from "./components/EditProfil/ChangeMyMail/ChangeMyMail";


class App extends Component {

    constructor(props){
        super(props);
        this._mounted = false;
        this.innerRef = React.createRef();
        this.innerRefSockets = React.createRef();
        this.innerRefNotifHistory = React.createRef();
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
    }

    updateNotifs = () => {
        this.innerRefNotifHistory && this.innerRefNotifHistory.current && this.innerRefNotifHistory.current.updateNotifs();
        this.innerRef && this.innerRef.current.updateNotifNb();
    };
    updateNotifNbNavbar = async() => { this.innerRef && this.innerRef.current.updateNotifNb() };


    // Sockets
    s_wallvisit = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current.s_wallvisit(userIdFocus) };
    s_like_likedback = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current.s_like_likedback(userIdFocus) };
    s_like_unliked = (userIdFocus) => { this.innerRefSockets && this.innerRefSockets.current.s_like_unliked(userIdFocus) };
    s_like = (userIdFocus) => {this.innerRefSockets && this.innerRefSockets.current.s_like(userIdFocus)};
    s_userlogin = () => { this.innerRefSockets && this.innerRefSockets.current.s_userlogin()};
    s_logout = () => {this.innerRefSockets && this.innerRefSockets.current.s_logout()};

    // Handle Connect
    isConnected = (bool) => {this.innerRef && this.innerRef.current.handleConnected(bool)};

    render() {
        return (
            <div>
                <BootstrapMenu ref={this.innerRef} logout={this.s_logout} />
                <Notifications ref={this.innerRefSockets} updateNotifs={this.updateNotifs} push/>
                <div className="content" >
                    <Switch>
                        <Route exact path="/" component={withAuth(() => <Wall sWallVisit={this.s_wallvisit} s_like_likedback={this.s_like_likedback} s_like_unliked={this.s_like_unliked} s_like={this.s_like}/>)}/>
                        <Route exact path="/profile" component={withAuth(EditProfile)} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/forgotpassword/:token" component={ChangePassword} />
                        <Route exact path="/forgotpassword" component={ForgotPassword} />
                        <Route exact path="/changepassword" component={withAuth(ChangePassword)} />
                        <Route exact path="/changemail" component={withAuth(ChangeMyEmail)} />
                        <Route exact path="/notifications" component={withAuth(() => <NotificationsHistory ref={this.innerRefNotifHistory} s_like_likedback={this.s_like_likedback} s_like_unliked={this.s_like_unliked} updateNotifNb={this.updateNotifNbNavbar} sWallVisit={this.s_wallvisit} s_like={this.s_like}/>)}/>
                        <Route exact path="/login" component={ (props) => <Login {...props} s_userlogin={this.s_userlogin} handleConnected={this.isConnected} />}  />
                        <Route exact path={"/login/:token"} component={Login} />
                        <Redirect from="*" to="" />
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}
export default App;