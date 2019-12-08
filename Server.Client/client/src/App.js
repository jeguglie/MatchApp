import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Aux from './hoc/Aux';
import Profil from "./containers/Profil/Profil";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Signup from "./components/Signup/Signup.js";
import Login from "./components/Login/Login";
import {Divider} from "semantic-ui-react";
import withAuth from "./utils/withAuth";
import './App.scss';

class App extends Component {
    render() {
        return (
            <Aux>
                <Divider hidden />
                <Switch>
                    {/*<Route exact path="/wall" component={withAuth(Wall)} />*/}
                    <Route exact path="/" component={withAuth(Profil)} />
                    <Route exact path="/dashboard" component={withAuth(Dashboard)} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/login" component={Login} />
                </Switch>
            </Aux>
        );
    }
}
export default App;