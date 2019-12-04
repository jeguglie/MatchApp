import React from "react";
import API from "../../utils/API";
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

class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {...DEFAULT_STATE}
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter')
            this.send();
    };

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }
    send = () =>  {
        // Check Validity Mail and Password
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
        // Set Loader
        this.setState({loading: true});
        // Send Request
            fetch('http://localhost:3000/login', {
                method: 'POST',
                body: JSON.stringify(this.state),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        this.props.history.push('/');
                    } else {
                        const error = new Error(res.error);
                        throw error;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.setState({warnings: ["Wrong username or password"]});
                });
                this.setState({send: true});
        // Unset Loader
        this.setState({loading: false});
    };

    handleChange = async(event) => this.setState({
            [event.target.id]: event.target.value
        });


    render() {
        const loading = this.state.loading;
        return (
            <Container className="loginModal">
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
                                        <Input id="email"
                                               icon='users'
                                               iconPosition='left'
                                               autoFocus
                                               type="email"
                                               onChange={this.handleChange}
                                               size="huge"
                                               placeholder="Email"
                                               required
                                        />
                                    </Form.Field>
                                    <Form.Field className="inputPassword">
                                        <Input icon='lock' iconPosition='left'
                                               id="password"
                                               onChange={this.handleChange}
                                               type="password"
                                               size="huge"
                                               placeholder="Password"
                                               required />
                                    </Form.Field>
                                </Form>
                                <Divider />
                                <Button className="loginButton"
                                        loading={loading} size='huge'
                                        onClick={this.send}>
                                    Log in
                                </Button>
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