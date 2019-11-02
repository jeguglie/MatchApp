import React from "react";
import API from "../../utils/API";
import styles from './Login.module.css';
import './LoginMediaQueries.css';
import classNames from 'classnames';
import Warnings from "../Warnings/Warnings";
import Divider from "../../components/Divider/Divider";
import { Input, Container, Image, Form, Button } from 'semantic-ui-react';

const DEFAULT_STATE = {
    email: "",
    password: "",
    text: "",
    warnings: [],
    send: false,
    correctEmail: false,
    loading: false
};

export class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {...DEFAULT_STATE}
    };

    send = async () => {
        const { email, password } = this.state;
        if ((!email || email.length === 0) || (!password || password.length === 0)) {
            const warnings = [];
            if (!email || email.length === 0)
                warnings.push("Please fill email field");
            if (!password || password.length === 0)
                warnings.push("Please fill password field");
            this.setState({warnings: warnings});
            return;
        }
        this.setState({loading: true});
        try {
            const { data } = await API.login(email, password);
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

    handleChange = async(event) => this.setState({
            [event.target.id]: event.target.value
        });

    handleChangeMail = async(event) => {
        this.setState({correctEmail: false});
        this.setState({ [event.target.id]: event.target.value });
        try {
            const {data} = await API.checkMail(event.target.value);
            if (data.exist === true)
                this.setState({correctEmail: true});
        }   catch (error) {
                console.error(error);
            }
    };

    render() {
        const correctEmail = this.state.correctEmail;
        const loading = this.state.loading;
        const warnings = this.state.warnings;
        return (
            <Container className={styles.loginModal}>
                             <Image className="img-fluid"
                                    src="/img/MatchApp-Logo.png"
                                    alt="Responsive image"
                                    size="medium"
                                    centered />
                            <div className={styles.loginWarnings}>
                                    <Warnings data={warnings}/>
                            </div>
                            <div className={styles.shape}></div>
                            <Divider />
                            <h1 className={styles.loginh1}>User Login</h1>
                                <Form className={ classNames([styles.loginForm])}>
                                    <Form.Field className={correctEmail === true ? styles.inputUser : null}>
                                        <Input id="email"
                                               icon='users'
                                               iconPosition='left'
                                               autoFocus
                                               type="email"
                                               onChange={this.handleChangeMail}
                                               size="huge"
                                               placeholder="Email"
                                               required
                                        />
                                    </Form.Field>
                                    <Form.Field className={styles.inputPassword}>
                                        <Input icon='lock' iconPosition='left'
                                               id="password"
                                               onChange={this.handleChange}
                                               onClick={this.checkMail}
                                               type="password"
                                               size="huge"
                                               placeholder="Password"
                                               required />
                                    </Form.Field>
                                </Form>
                                <Divider />
                                <Button className={styles.loginButton}
                                        loading={loading} size='huge'
                                        onClick={this.send}>
                                    Log in
                                </Button>
                            <Divider />
                            <div className={styles.loginNoAccount}>
                                <p>No account ? <a href="/signup">Register</a></p>
                                <p className={styles.loginForgot}>
                                    <a href="/signup"><strong>Forgot password ?</strong></a>
                                </p>
                            </div>
            </Container>
        );
    }
}