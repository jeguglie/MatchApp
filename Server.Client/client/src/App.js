import React, { Component } from "react";
import { Switch }from "react-router-dom";
import { PrivateRoute, PrivateRouteLoginRegister, PrivateRouteEditProfil } from "./components/PrivateRoute.js";
import Aux from './hoc/Aux';
import Divider from "./components/Divider/Divider";
import Profil from "./containers/Profil/Profil";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Signup from "./components/Signup/Signup.js";
import { Image } from "semantic-ui-react";
import './App.scss';
import Login from "./components/Login/Login";

class App extends Component {
    render() {
        return (
            <Aux>
                <div className="Menu">
                    <Divider />
                        <Image left="true" src="/img/MatchApp-Logo.png" size='medium' />
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