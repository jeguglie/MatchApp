import React from "react";
import API from "../../utils/API";
import {Button, Container, Form, Image, Input} from "semantic-ui-react";
import Warnings from "../Warnings/Warnings";
import classnames from "classnames";

export class Signup extends React.Component {
    state = {
        email: "",
        password: "",
        cpassword: ""
    };
    send = async () => {
        const {email, password, cpassword} = this.state;
        if ((email || email.length === 0) || (!password || password.length === 0)
            || (!cpassword || cpassword.length === 0)) {
            const warnings = [];
            if (!email || email.length === 0) {
                warnings.push("Please fill email field");
                if (!password || password.length === 0)
                    warnings.push("Please fill password field");
                if (cpassword !== password)
                    warnings.push("Passwords does not match");
                this.setState({warnings: warnings});
                return;
            }
            this.setState({loading: true});
            try {
                const {data} = await API.signup(email, password, cpassword);
                if (data) {
                    if (data.token) {
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
    }
    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };


    render() {
        const correctEmail = this.state.correctEmail;
        const loading = this.state.loading;
        const warnings = this.state.warnings;
        return (
            <Container className="login-modal">
                <div className="shape"></div>
                <Image className="img-fluid WelcomeLogo"
                       src="/img/MatchApp-Logo.png"
                       alt="Responsive image"
                       size="medium"
                       centered/>
                <div className="loginWarnings">
                    <Warnings data={warnings} />
                </div>
                <div className="divider"></div>
                <h1 className="createAccounth1">Create an account</h1>
                <div className={classnames("loginForm", correctEmail === true ? "loginEmailTrue" : "")}>
                    <Form>
                        <Form.Field>
                            <Input id="email"
                                   icon='users'
                                   iconPosition='left'
                                   autoFocus
                                   type="email"
                                   onChange={this.handleChange}
                                   size="huge"
                                   placeholder="Email"
                                   autoComplete="off"
                                   required
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input icon='lock'
                                   iconPosition='left'
                                   id="password"
                                   onChange={this.handleChange}
                                   onClick={this.checkMail}
                                   type="password"
                                   size="huge"
                                   placeholder="Password"
                                   required/>
                        </Form.Field>
                        <Form.Field>
                            <Input icon='lock' iconPosition='left'
                                   id="cpassword"
                                   onChange={this.handleChange}
                                   onClick={this.checkMail}
                                   type="password"
                                   size="huge"
                                   placeholder="Confirm Password"
                                   required/>
                        </Form.Field>
                    </Form>
                </div>
                <div className="divider"></div>
                <div className="loginButton">
                    <Button loading={loading} size='huge' onClick={this.send}>Register</Button>
                </div>
                <div className="divider"></div>
                <div className="loginNoAccount">
                    <p>
                        Have an account ? <a href="/login">Log in</a>
                    </p>
                </div>
            </Container>
        );
    }
}