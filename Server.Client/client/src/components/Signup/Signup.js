import React from "react";
import API from "../../utils/API";
import {Button, Container, Form, Image, Input} from "semantic-ui-react";
import Warnings from "../Warnings/Warnings";
import Divider from "./../../components/Divider/Divider";

const DEFAULT_STATE = {
    email: "",
    password: "",
    cpassword: ""
}

class Signup extends React.Component {
    constructor (props){
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    componentDidMount() {
    }

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
                        localStorage.setItem("id", data._id);
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
        }
    };
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
            <Container className="loginModal">
                <div className="shape"></div>
                <Image className="img-fluid"
                       src="/img/MatchApp-Logo.png"
                       alt="Responsive image"
                       size="medium"
                       centered/>
                <div className="loginWarnings">
                    <Warnings data={warnings} />
                </div>
                <Divider />
                <h1 className="loginh1">Create an account</h1>
                    <Form className="loginForm">
                        <Form.Field className={correctEmail === true ? "inputUser" : null}>
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
                        <Form.Field className="inputPassword">
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
                        <Form.Field className="inputPassword">
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
                <Divider />
                <Button className="loginButton"
                        loading={loading}
                        size='huge'
                        onClick={this.send}>
                    Register
                </Button>
                <Divider />
                <div className="loginNoAccount">
                    <p>
                        Have an account ? <a href="/login">Log in</a>
                    </p>
                </div>
            </Container>
        );
    }
}

export default Signup;