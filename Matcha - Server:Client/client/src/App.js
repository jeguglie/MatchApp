import React, { Component } from "react";
import { Switch }from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Signup from "./components/Signup/Signup.js";
import { PrivateRoute, PrivateRouteLoginRegister, PrivateRouteEditProfil } from "./components/PrivateRoute.js";
import Aux from './hoc/Aux';
import './App.scss';
import Profil from "./containers/Profil/Profil";
import {Image} from "semantic-ui-react";
import Divider from "./components/Divider/Divider";
const Login =  require( "./components/Login/Login");
const Logo = require('./../src/img/MatchApp-Logo.png');

class App extends Component {
    render() {
        return (
            <Aux>
                <div className="Menu">
                    <Divider />
                        <Image left src={Logo} size='medium' />
                    <Divider />
                </div>
                    <Switch>
                        <PrivateRouteEditProfil exact path="/" component={Profil} />
                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        <PrivateRouteLoginRegister exact path="/signup" component={Signup} />
                        <PrivateRouteLoginRegister exact path="/login" component={Login} />
                    </Switch>
            </Aux>
        );
    }
}
export default App;