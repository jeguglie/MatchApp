import React from "react";
import Warnings from "Src/components/Warnings/Warnings";
import VALIDATE from 'Src/utils/validation';
import API from "Src/utils/API";
import {Container, Image, Form, Button, Dimmer, Loader, Divider} from 'semantic-ui-react';
import { store } from 'react-notifications-component';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DEFAULT_STATE = {
    email: "",
    password: "",
    warnings: [],
    loading: false,
    w_email: "",
    w_password: "",
};

const DEFAULT_ERRORS = {
    w_email: "",
    w_password: "",
};

class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {...DEFAULT_STATE};
        this.warnings = {...DEFAULT_ERRORS};
        this._mounted = false;
    };

    componentWillUnmount() {
        this._mounted = false;
    }

    async componentDidMount() {
        if (cookies.get('token'))
            await API.withAuth()
                .then(res => {
                    if (res.status === 200) {
                        this.props.s_userlogin();
                        this.props.history.push('/profile');
                    }
                })
                .catch(() => cookies.remove('token'));
        this._mounted = true;
        this.params = this.props.match.params;
        if (this.params.token){
            await API.activeaccount(this.params.token)
                .then (response => {
                    if (response.status === 200){
                        store.addNotification({
                            title: 'Account validation',
                            message: 'Your account was successfully activated. You can now log in.',
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
                    }
                    else
                        store.addNotification({
                            title: 'Error validation',
                            message: 'Token or mail are not valids.',
                            type: "warning",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 10000,
                                onScreen: true
                            }
                        });
                })
                .catch(error => {
                    store.addNotification({
                        title: 'Error validation',
                        message: 'Token or mail are not valids.',
                        type: "warning",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 10000,
                            onScreen: true
                        }
                    });
                });
            this.props.history.push('/login');
        }
    }

    send = async() => {
            // Clear warnings
            this.warnings = {...DEFAULT_ERRORS};
            const {email, password} = this.state;
            // Check Validity
            if (this._mounted)
                this.setState({loading: true});
            await VALIDATE.sleepLoader(300)
                .then(async () => {
                    if (!VALIDATE.validateEmail(email))
                        this.warnings.w_email = "Please enter a valid email";
                    if (!VALIDATE.validatePassword(password))
                        this.warnings.w_password = "Please enter a valid password";
                    if (!VALIDATE.checkWarnings(this.warnings)) {
                        await API.login(email, password)
                            .then((response) => {
                                if (typeof response.data !== 'undefined' && typeof response.data.connect !== 'undefined')
                                    this.props.handleConnected(true);
                                        window.location.href = "/profile";
                            })
                            .catch(error => {
                                if (typeof error.response !== 'undefined' && typeof error.response.data !== 'undefined') {
                                    if (this._mounted) {
                                        this.setState({w_email: error.response.data.w_email});
                                        if (error.response.data.w_emailconfirm)
                                            store.addNotification({
                                                title: 'Account not active',
                                                message: 'A confirmation link was sent to your mail',
                                                type: "warning",
                                                insert: "top",
                                                container: "top-right",
                                                animationIn: ["animated", "fadeIn"],
                                                animationOut: ["animated", "fadeOut"],
                                                dismiss: {
                                                    duration: 10000,
                                                    onScreen: true
                                                }
                                            });
                                    }
                                }
                            });
                    } else if (this._mounted)
                        this.setState({...this.warnings});
                });
            if (this._mounted)
                this.setState({loading: false});
    };

    handleChange = (event) => {
        const {w_email, w_password} = this.state;
        if (event.target.id === "email" && w_email && w_email.length > 0)
            this.setState({w_email: ""});
        if (event.target.id === "password" && w_password && w_password.length > 0)
            this.setState({w_password: ""});
        this.setState({[event.target.id]: event.target.value});
    }


    render() {
        const {loading, w_email, w_password} = this.state;
        return (
            <Container className="loginModal">
                <Dimmer active={loading}>
                    <Loader size='big'>Connecting to MatchApp...</Loader>
                </Dimmer>
                <Divider hidden />
                     <Image className="img-fluid"
                            src={'/assets/img/MatchApp-Logo.png'}
                            alt="Responsive image"
                            size="medium"
                            centered />
                    <div className="loginWarnings">
                            <Warnings data={this.state.warnings}/>
                    </div>
                    <div className="shape"></div>
                    <Divider hidden />
                    <h1 className="loginh1">User Login</h1>
                        <Form className="loginForm">
                            <Form.Field>
                                <Form.Input
                                       error={w_email && w_email.length > 0 ? {content: w_email, pointing: 'below'} : null}
                                       id="email"
                                       icon='users'
                                       iconPosition='left'
                                       autoFocus
                                       onChange={this.handleChange}
                                       size="huge"
                                       placeholder="Email" />
                            </Form.Field>
                            <Form.Field className="inputPassword">
                                <Form.Input
                                    error={w_password && w_password.length > 0 ? {content: w_password, pointing: 'below'} : null}
                                    icon='lock'
                                    iconPosition='left'
                                    id="password"
                                    onChange={this.handleChange}
                                    type="password"
                                    size="huge"
                                    placeholder="Password" />
                            </Form.Field>
                            <Divider hidden />
                            <Button className="loginButton"
                                    loading={loading} size='huge'
                                    type="submit"
                                    onClick={this.send}>
                                Log in
                            </Button>
                        </Form>
                    <Divider hidden />
                    <div className="loginNoAccount">
                        <p className="loginForgot">
                            <a href='# ' onClick={(e) => {e.preventDefault(); this.props.history.push('/forgotpassword')}}>
                                <strong>Forgot password ?</strong>
                            </a>
                        </p>
                        <p>No account ? <a href='# ' onClick={(e) => {e.preventDefault(); this.props.history.push('/signup')}}>Register</a></p>
                    </div>
                <Divider hidden />
            </Container>
        );
    }
}

export default Login;