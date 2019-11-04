import React, { Component } from "react";
import { Switch }from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Signup from "./components/Signup/Signup.js";
import { PrivateRoute, PrivateRouteLoginRegister, PrivateRouteEditProfil } from "./components/PrivateRoute.js";
import Aux from './hoc/Aux';
import './App.scss';
import EditProfil from "./components/EditProfil/EditProfil";


const login =  require( "./components/Login/Login");
const Login = login.Login;
class App extends Component {
    render() {
        return (
            <Aux>
            <div className="App">
                <div className="App-content">
                    <Switch>
                        <PrivateRouteEditProfil exact path="/" component={EditProfil} />
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