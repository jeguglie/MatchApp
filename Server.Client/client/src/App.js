import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Aux from './hoc/Aux';
import Profil from "./containers/Profil/Profil";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Signup from "./components/Signup/Signup.js";
import Login from "./components/Login/Login";
import {Divider, Container} from "semantic-ui-react";
import withAuth from "./utils/withAuth";
import Menu from './components/Menu/Menu'
import FooterMatchApp from './components/Footer/Footer'
import './App.scss';

class App extends Component {
    render() {
        return (
            <Aux>
                <Menu />
                <Container fluid>
                    <Switch>
                        <Route exact path="/" component={withAuth(Profil)} />
                        <Route exact path="/dashboard" component={withAuth(Dashboard)} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/login" component={Login} />
                    </Switch>
                    <Divider hidden />
                    <Divider hidden />
                    <Divider hidden />
                    <Divider hidden />
                </Container>
                <FooterMatchApp />
            </Aux>
        );
    }
}
export default App;