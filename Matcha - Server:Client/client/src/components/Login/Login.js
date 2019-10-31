import React from "react";
import API from "../../utils/API";
import './Login.css';
import classnames from 'classnames';
import Warnings from "../Warnings/Warnings";
import { Input, Container, Image, Form, Button } from 'semantic-ui-react';

export class Login extends React.Component {
    state = {
        email: "",
        password: "",
        text: "",
        warnings: [],
        send: false,
        correctEmail: false,
        loading: false
    };

    send = async () => {
        const { email, password } = this.state;
        if ((email || email.length === 0) || (!password || password.length === 0)) {
            const warnings = [];
            if (!email || email.length === 0) {
                warnings.push("Please fill email field");
            if (!password || password.length === 0)
                warnings.push("Please fill password field");
            this.setState({warnings: warnings});
            return;
            }
        }
        this.setState({loading: true});
        try {
            const { data } = await API.login(email, password);
            if (data) {
                console.log(data);
                if (data.token) {
                    console.log(1);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("newUser", data.newUser);
                    window.location = "/";
                } else {
                    this.setState({warnings: data.text});
                    this.setState({send: true});
                }
            }
        } catch (error) {
            console.error(error);
        }
        this.setState({loading: false});
    };
    handleChange = async(event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleChangeMail = async(event) => {
        this.setState({correctEmail: false})
        this.setState({
            [event.target.id]: event.target.value
        });
        try {
            const {data} = await API.checkMail(event.target.value);
            if (data.exist === true)
                this.setState({correctEmail: true});
        }catch (error) {
            console.error(error);
        }
    };
    render() {
        const correctEmail = this.state.correctEmail;
        const loading = this.state.loading;
        const warnings = this.state.warnings;
        return (
            <Container className="login-modal">
                <div className="shape"></div>
                <div className="shape2"></div>
                             <Image className="img-fluid WelcomeLogo"
                                    src="/img/MatchApp-Logo.png"
                                    alt="Responsive image"
                                    size="medium"
                                    centered/>
                            <div className="loginWarnings">
                                    <Warnings data={warnings}/>
                            </div>
                            <div className="divider"></div>
                <h1 className="loginh1">User Login</h1>
                            <div className={classnames("loginForm", correctEmail === true ? "loginEmailTrue" : "")}>
                                <Form>
                                    <Form.Field>
                                        <Input id="email"
                                               icon='users'
                                               iconPosition='left'
                                               placeholder='Search users...'
                                               autoFocus
                                               type="email"
                                               onChange={this.handleChangeMail}
                                               size="huge"
                                               placeholder="Email"/>
                                    </Form.Field>
                                    <Form.Field>
                                        <Input icon='lock' iconPosition='left' placeholder='Search users...'
                                               id="password"
                                               onChange={this.handleChange}
                                               onClick={this.checkMail}
                                               type="password"
                                               size="huge"
                                               placeholder="Password"
                                        required/>
                                    </Form.Field>
                                </Form>
                            </div>
                            <div className="divider"></div>
                            <div className="loginButton">
                                <Button loading={loading} size='huge' onClick={this.send}>Log in</Button>
                            </div>
                            <div className="divider"></div>
                            <div className="loginNoAccount">
                                <p>
                                    No account ? <a href="/signup">Register</a>
                                </p>
                                <p className="loginForgot">
                                    <a href="/signup"><strong>Forgot password ?</strong></a>
                                </p>
                            </div>
            </Container>
        );
    }
}