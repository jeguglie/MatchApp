import React from "react";
import Warnings from "Src/components/Warnings/Warnings";
import VALIDATE from 'Src/utils/validation';
import API from "Src/utils/API";
import { store } from 'react-notifications-component';
import {Container, Image, Form, Button, Dimmer, Loader, Divider} from 'semantic-ui-react';

const DEFAULT_STATE = {
    email: "",
    password: "",
    warnings: [],
    loading: false,
    w_email: "",
};

const DEFAULT_ERRORS = {
    w_email: "",
};

class ForgotPassword extends React.Component {

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
        const {email} = this.state;
        // Check Validity
        if (this._mounted)
            this.setState({loading: true});
        await VALIDATE.sleepLoader(300)
            .then(async () => {
                if (!VALIDATE.validateEmail(email))
                    this.warnings.w_email = "Please enter a valid email";
                if (!VALIDATE.checkWarnings(this.warnings)) {
                    await API.userforgot(email)
                        .then(response => {
                            if (response.status === 200)
                                store.addNotification({
                                    title: 'Forgot Password',
                                    message: "A reset link as been sent",
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
                            if (error.response.status === 400){
                                this.setState({w_email: error.response.data.warnings});
                            }
                        })
                } else if (this._mounted)
                    this.setState({...this.warnings});
            });
        if (this._mounted)
            this.setState({loading: false});
    };

    handleChange = (event) => {
        const {w_email} = this.state;
        if (event.target.id === "email" && w_email && w_email.length > 0)
            this.setState({w_email: ""});
        this.setState({[event.target.id]: event.target.value});
    }


    render() {
        const {loading, w_email} = this.state;
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
                <div className="loginWarnings">
                    <Warnings data={this.state.warnings}/>
                </div>
                <div className="shape"></div>
                <Divider hidden />
                <h1 className="loginh1">Forgot Password</h1>
                <Warnings />
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
                    <Divider hidden />
                    <Button className="loginButton"
                            loading={loading} size='huge'
                            type="submit"
                            onClick={this.send}>
                        Send reset link
                    </Button>
                </Form>
                <Divider hidden />
                <div className="loginNoAccount">
                    <p>No account ? <a href='# ' onClick={(e) => {e.preventDefault(); this.props.history.push('/signup')}}>Register</a></p>
                </div>
                <Divider hidden />
            </Container>
        );
    }
}

export default ForgotPassword;