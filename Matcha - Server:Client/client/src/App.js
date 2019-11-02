import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard.js";
import { Login } from "./components/Login/Login.js";
import { Signup } from "./components/Signup/Signup.js";
import { PrivateRoute, PrivateRouteLoginRegister } from "./components/PrivateRoute.js";
import Aux from './hoc/Aux';
import Profil from '../src/containers/Profil/Profil';

import "./App.css";

class App extends Component {
    render() {
        return (
            <Aux>
            <div className="App">
                <div className="App-content">
                    <Switch>
                        <Route exact path="/profil" component={Profil} />
                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        <PrivateRouteLoginRegister exact path="/signup" component={Signup} />
                        <PrivateRouteLoginRegister exact path="/login" component={Login} />
                    </Switch>
                </div>
            </div>
            </Aux>
        );
    }
}
export default App;