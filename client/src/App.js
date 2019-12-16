import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Aux from './hoc/Aux';
import Profil from "./containers/Profil/Profil";
import Signup from "./components/Signup/Signup.js";
import Wall from './containers/Wall/Wall';
import Login from "./components/Login/Login";
import { Container } from "semantic-ui-react";
import withAuth from "./utils/withAuth";
import Menu from './components/Menu/Menu'
import './App.scss';

class App extends Component {

    render() {
        return (
            <Aux>
                <Menu />
                <Container fluid>
                    <Switch>
                        <Route exact path="/wall" component={withAuth(Wall)} />
                        <Route exact path="/" component={withAuth(Profil)} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/login" component={Login} />
                    </Switch>
                </Container>
            </Aux>
        );
    }
}
export default App;