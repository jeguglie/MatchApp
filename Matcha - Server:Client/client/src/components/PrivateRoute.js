import React from "react";
import API from "../utils/API.js";
import { Route, Redirect } from "react-router-dom";
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (API.isAuth() === false) {
                return <Redirect to="/login" />;
            }
            else if (localStorage.getItem('newUser')
                && props.match.path !== "/dashboard"
                && props.match.path !== "/profil")
                return <Redirect to="/profil"/>;
            else {
                return <Component {...props} />;
            }
        }}
    />
);

export const PrivateRouteLoginRegister = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (API.isAuth() === true) {
                return <Redirect to="/" />;
            }
            else {
                return <Component {...props} />;
            }
        }}
    />
);

export const PrivateRouteEditProfil = ({ component: Component, ...rest }) => (
    <Route
            {...rest}
            render={(props) => {
            if (localStorage.getItem('newUser')){
                return <Component {...props.Profil} />;
            }
            else {
                return <Redirect to="/login"/>;
            }
        }}
    />
)