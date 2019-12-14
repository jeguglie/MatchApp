import React from "react";
import Warnings from "../Warnings/Warnings";
import Divider from "../../components/Divider/Divider";
import VALIDATE from "../../utils/validation";
import API from "../../utils/API";
import { Container, Image, Form, Button, Dimmer, Loader} from 'semantic-ui-react';

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

    componentDidMount() {
        this._mounted = true;
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
                    if (VALIDATE.checkWarnings(this.warnings)) {
                        await API.login(email, password)
                            .then((response) => {
                                if (typeof response.data !== 'undefined' && typeof response.data.connect !== 'undefined')
                                    this.props.history.push('/');
                            })
                            .catch(error => {
                                if (typeof error.response.data !== 'undefined' && typeof error.response.data !== 'undefined') {
                                    if (this._mounted)
                                        this.setState({w_email: error.response.data.w_email});
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
                <Divider />
                     <Image className="img-fluid"
                            src="/img/MatchApp-Logo.png"
                            alt="Responsive image"
                            size="medium"
                            centered />
                    <div className="loginWarnings">
                            <Warnings data={this.state.warnings}/>
                    </div>
                    <div className="shape"></div>
                    <Divider />
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
                            <Divider />
                            <Button className="loginButton"
                                    loading={loading} size='huge'
                                    type="submit"
                                    onClick={this.send}>
                                Log in
                            </Button>
                        </Form>
                    <Divider />
                    <div className="loginNoAccount">
                        <p className="loginForgot">
                            <a href="/signup"><strong>Forgot password ?</strong></a>
                        </p>
                        <p>No account ? <a href="/signup">Register</a></p>
                    </div>
                <Divider />
            </Container>
        );
    }
}

export default Login;