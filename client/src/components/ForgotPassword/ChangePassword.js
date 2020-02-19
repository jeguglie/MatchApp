import React from "react";
import VALIDATE from 'Src/utils/validation';
import API from "Src/utils/API";
import { store } from 'react-notifications-component';
import {Container, Image, Form, Button, Dimmer, Loader, Divider} from 'semantic-ui-react';

const DEFAULT_STATE = {
    password: "",
    passwordconfirm : "",
    warnings: [],
    loading: false,
    w_password: "",
    w_passwordconfirm: "",
};

const DEFAULT_ERRORS = {
    w_password: "",
    w_passwordconfirm: "",
};

class ChangePassword extends React.Component {

    constructor (props) {
        super(props);
        this.state = {...DEFAULT_STATE};
        this.warnings = {...DEFAULT_ERRORS};
        this._mounted = false;
        this.params = null;
    };

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
        this.params = this.props.match.params;
    }

    send = async() => {
        // Clear warnings
        this.warnings = {...DEFAULT_ERRORS};
        const {password, passwordconfirm} = this.state;
        // Check Validity
        if (this._mounted)
            this.setState({loading: true});
        await VALIDATE.sleepLoader(300)
            .then(async () => {
                if (!VALIDATE.validatePassword(password) || !VALIDATE.validatePassword(passwordconfirm))
                    this.warnings.w_password = "Please enter a strong password";
                if  (password !== passwordconfirm)
                    this.warnings.w_passwordconfirm = "Passwords are not the same";
                if (!VALIDATE.checkWarnings(this.warnings)) {
                    await API.changepassword(this.params.token, password, passwordconfirm)
                        .then(response => {
                            if (response.status === 200)
                                store.addNotification({
                                    title: 'Password updated',
                                    message: "Your password has been successfully updated",
                                    type: "success",
                                    insert: "top",
                                    container: "top-right",
                                    animationIn: ["animated", "fadeIn"],
                                    animationOut: ["animated", "fadeOut"],
                                    dismiss: {
                                        duration: 10000,
                                        onScreen: true
                                    }
                                });
                            if (typeof this.props.match.params.token !== 'undefined')
                                this.props.history.push("/login");
                        })
                        .catch(error => {
                            if (error.response.status === 400){
                                this.setState({w_password: error.response.data.warnings});
                            }
                        })
                } else if (this._mounted)
                    this.setState({...this.warnings});
            });
        if (this._mounted)
            this.setState({loading: false});
    };

    handleChange = (event) => {
        const {w_password} = this.state;
        if (event.target.id === "password" && w_password && w_password.length > 0)
            this.setState({w_password: ""});
        this.setState({[event.target.id]: event.target.value});
    }


    render() {
        const {loading, w_password, w_passwordconfirm} = this.state;
        const HelpLinks = () => {
            if (typeof this.props.match.params.token !== 'undefined')
                return (
                    <div className="loginNoAccount">
                        <p className="loginForgot">
                            <a  href="/forgotpassword"
                            >
                                <strong>Send a reset link</strong>
                            </a>
                        </p>
                        <p>No account ? <a href="/signup">Register</a></p>
                    </div>
                )
            else return null;
        }
        return (
            <Container className="loginModal">
                <Dimmer active={loading}>
                    <Loader size='big'>Request...</Loader>
                </Dimmer>
                <Divider hidden />
                <Image className="img-fluid"
                       src={'/assets/img/MatchApp-Logo.png'}
                       alt="Responsive image"
                       size="medium"
                       centered />
                <div className="shape"></div>
                <Divider hidden />
                <h1 className="loginh1">Change Password</h1>
                <Form className="loginForm">
                    <Form.Field className="inputPassword">
                        <Form.Input
                            error={w_password && w_password.length > 0 ? {content: w_password, pointing: 'below'} : null}
                            icon='lock'
                            iconPosition='left'
                            id="password"
                            onChange={this.handleChange}
                            type="password"
                            size="huge"
                            placeholder="Password"/>
                    </Form.Field>
                    <Form.Field className="inputPassword">
                        <Form.Input
                            error={w_passwordconfirm && w_passwordconfirm.length > 0 ? {content: w_passwordconfirm, pointing: 'below'} : null}
                            icon='lock'
                            iconPosition='left'
                            id="passwordconfirm"
                            onChange={this.handleChange}
                            type="password"
                            size="huge"
                            placeholder="Confirm Password"/>
                    </Form.Field>
                    <Divider hidden />
                    <Button className="loginButton"
                            loading={loading} size='huge'
                            type="submit"
                            onClick={this.send}>
                        Reset my password
                    </Button>
                </Form>
                <Divider hidden />
                <HelpLinks />
                <Divider hidden />
            </Container>
        );
    }
}

export default ChangePassword;