import React from "react";
import VALIDATE from 'Src/utils/validation';
import API from "Src/utils/API";
import { store } from 'react-notifications-component';
import {Container, Image, Form, Button, Dimmer, Loader, Divider} from 'semantic-ui-react';

const DEFAULT_STATE = {
    email: "",
    emailconfirm: "",
    warnings: [],
    loading: false,
    w_email: "",
    w_emailconfirm: "",
};

const DEFAULT_ERRORS = {
    w_email: "",
    w_emailconfirm: "",
};

class ChangeMyEmail extends React.Component {

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
        const {email, emailconfirm} = this.state;
        // Check Validity
        if (this._mounted)
            this.setState({loading: true});
        await VALIDATE.sleepLoader(300)
            .then(async () => {
                if (!VALIDATE.validateEmail(email))
                    this.warnings.w_email = "Please enter a valid email";
                if (!VALIDATE.validateEmail(emailconfirm))
                    this.warnings.w_emailconfirm = "Please enter a valid email";
                if  (email !== emailconfirm)
                    this.warnings.w_emailconfirm = "Emails are not the same";
                if (!VALIDATE.checkWarnings(this.warnings)) {
                    await API.changemyemail(email, emailconfirm)
                        .then(response => {
                            if (response.status === 200) {
                                store.addNotification({
                                    title: 'Your email was successfully updated',
                                    message: "Please log in",
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
                                this.props.history.push("/login");
                            }
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
        const {w_email, w_emailconfirm} = this.state;
        if (event.target.id === "email" && w_email && w_email.length > 0)
            this.setState({w_email: ""});
        if (event.target.id === "emailconfirm" && w_emailconfirm && w_emailconfirm.length > 0)
            this.setState({w_emailconfirm: ""});
        this.setState({[event.target.id]: event.target.value});
    }


    render() {
        const {loading, w_email, w_emailconfirm} = this.state;
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
                <h1 className="loginh1">Change my email</h1>
                <Form className="loginForm">
                    <Form.Field className="inputPassword">
                        <Form.Input
                            error={w_email && w_email.length > 0 ? {content: w_email, pointing: 'below'} : null}
                            icon='mail'
                            iconPosition='left'
                            id="email"
                            onChange={this.handleChange}
                            type="email"
                            size="huge"
                            placeholder="New Email"/>
                    </Form.Field>
                    <Form.Field className="inputPassword">
                        <Form.Input
                            error={w_emailconfirm && w_emailconfirm.length > 0 ? {content: w_emailconfirm, pointing: 'below'} : null}
                            icon='mail'
                            iconPosition='left'
                            id="emailconfirm"
                            onChange={this.handleChange}
                            type="email"
                            size="huge"
                            placeholder="Confirm Email"/>
                    </Form.Field>
                    <Divider hidden />
                    <Button className="loginButton"
                            loading={loading} size='huge'
                            type="submit"
                            onClick={this.send}>
                        Change my email
                    </Button>
                </Form>
                <Divider hidden />
                <Divider hidden />
            </Container>
        );
    }
}

export default ChangeMyEmail;