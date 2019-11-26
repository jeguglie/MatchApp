import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Aux from './hoc/Aux';
import Profil from "./containers/Profil/Profil";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Signup from "./components/Signup/Signup.js";
import Login from "./components/Login/Login";
import './App.scss';

class App extends Component {
    render() {
        return (
            <Aux>
                    <Switch>
                        {/*<Route path="/" component={Profil} />*/}
                        {/*<Route path="/dashboard" component={Dashboard} />*/}
                        <Route path="/signup" component={Signup} />
                        <Route path="/login" component={Login} />
                    </Switch>
            </Aux>
        );
    }
}
export default App;