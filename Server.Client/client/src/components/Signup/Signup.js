import React from "react";
import API from "../../utils/API";
import {Segment, Button, Container, Form, Image, Input, Grid, Divider, Rail} from "semantic-ui-react";
import Warnings from "../Warnings/Warnings";
import DividerC from "./../../components/Divider/Divider";

const DEFAULT_STATE = {
    lastName: "",
    firstName: "",
    email: "",
    username: "",
    password: "",
    cpassword: ""
};

class Signup extends React.Component {
    constructor (props){
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    send = () => {
        const warnings = [];
        this.setState({warnings: []});
        const {lastName, firstName, email, username, password, cpassword } = this.state;
        if ((!email || email.length === 0) ||
            (!password || password.length === 0) ||
            (!cpassword || cpassword.length === 0) ||
            (!username || username.length === 0) ||
            (!lastName || lastName.length === 0) ||
            (!firstName || firstName.length === 0)) {
            if (!email || email.length === 0)
                warnings.push("Please fill email field");
            if (!password || password.length === 0)
                warnings.push("Please fill password field");
            if (cpassword.localeCompare(password) !== 0)
                warnings.push("Passwords does not match");
            if (!username || username.length === 0)
                warnings.push("Please fill username field");
            if (!firstName || firstName.length === 0)
                warnings.push("Please fill First Name field");
            if (!lastName || lastName.length === 0)
                warnings.push("Please fill Last Name field");
            this.setState({warnings: warnings});
            return;
        }
        this.setState({loading: true});
        try {
            console.log(1);
            API.signup(lastName, firstName, email, username, password, cpassword)
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
                    this.setState({warnings: ["Error"]});
                });
            this.setState({send: true});
        } catch (error) {
            console.error(error);
        }
        this.setState({loading: false});
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };


    render() {
        return (
            <Container className="signupModal">
                <div className="shapeSignup"></div>
                <DividerC />
                <Image className="img-fluid"
                       src="/img/MatchApp-Logo.png"
                       alt="Responsive image"
                       size="medium"
                       centered/>
                <div className="signupWarnings">
                    <Warnings data={this.state.warnings} />
                </div>
                <DividerC />
                <Container textAlign='center'>
                    <h1 className="signuph1">Create an account</h1>
                </Container>
                <DividerC />
                <Form className="signupForm">
                    <Form.Group widths='equal'>
                            <Form.Input
                                    id="firstName"
                                   icon='user'
                                   iconPosition='left'
                                   autoFocus
                                   onChange={this.handleChange}
                                   size="huge"
                                   placeholder="First Name"
                                   autoComplete="off"
                                   maxLength="13"
                                   required
                            />
                            <Form.Input
                                id="lastName"
                                   icon='user'
                                   iconPosition='left'
                                   autoFocus
                                   onChange={this.handleChange}
                                   size="huge"
                                   placeholder="Last Name"
                                   autoComplete="off"
                                   maxLength="13"
                                   required
                            />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input id="email"
                                   icon='mail'
                                   iconPosition='left'
                                   autoFocus
                                   type="email"
                                   onChange={this.handleChange}
                                   size="huge"
                                   placeholder="Email"
                                   autoComplete="off"
                                   maxLength="30"
                                   required
                         />
                        <Form.Input id="username"
                               icon='user circle'
                               iconPosition='left'
                               autoFocus
                               onChange={this.handleChange}
                               size="huge"
                               placeholder="Choose a username"
                               autoComplete="off"
                               required
                               maxLength="23"
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input icon='lock'
                               iconPosition='left'
                               id="password"
                               onChange={this.handleChange}
                               type="password"
                               size="huge"
                               placeholder="Password"
                               required/>
                        <Form.Input icon='lock' iconPosition='left'
                               id="cpassword"
                               onChange={this.handleChange}
                               type="password"
                               size="huge"
                               placeholder="Confirm Password"
                               required
                        />
                    </Form.Group>
                    </Form>
                <DividerC />
                <Button className="signupButton"
                        loading={this.state.loading}
                        size='huge'
                        onClick={this.send}>
                    Register
                </Button>
                <DividerC />
                <div className="signupNoAccount">
                    <p>
                        Have an account ? <a href="/login">Log in</a>
                    </p>
                </div>
                <DividerC />
            </Container>
        );
    }
}

export default Signup;