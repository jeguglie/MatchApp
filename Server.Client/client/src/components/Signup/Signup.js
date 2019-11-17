import React from "react";
import API from "../../utils/API";
import {Button, Container, Form, Image, Input, Grid} from "semantic-ui-react";
import Warnings from "../Warnings/Warnings";
import Divider from "./../../components/Divider/Divider";

const DEFAULT_STATE = {
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

    componentDidMount() {
    }

    send = async () => {
        const warnings = [];
        const {email, username, password, cpassword } = this.state;
        if ((!email || !email.length === 0) || (!password || !password.length === 0) ||
            (!cpassword || !cpassword.length === 0) || (!username || !username.length === 0)) {
            if (!email || email.length === 0)
                warnings.push("Please fill email field");
            if (!password || password.length === 0)
                warnings.push("Please fill password field");
            if (cpassword !== password)
                warnings.push("Passwords does not match");
            if (!username || username.length === 0)
                warnings.push("Passwords does not match");
            this.setState({warnings: warnings});
            return;
        }
        this.setState({loading: true});
        try {
            console.log(1);
            const {data} = await API.signup(email, username, password, cpassword);
            console.log(data);
            if (data) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("newUser", data.newUser);
                    localStorage.setItem("id", data._id);
                    window.location = "/";
                } else {
                    this.setState({warnings: data.warnings});
                    this.setState({send: true});
                }
            }
        } catch (error) {console.error(error);}
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
                <Image className="img-fluid"
                       src="/img/MatchApp-Logo.png"
                       alt="Responsive image"
                       size="medium"
                       centered/>
                <div className="signupWarnings">
                    <Warnings data={this.state.warnings} />
                </div>
                <Divider />
                <h1 className="signuph1">Create an account</h1>
                    <Form className="signupForm">
                        <Grid textAlign="center" columns={2} doubling>
                            <Grid.Column>
                                <Form.Field>
                                    <Input id="firstName"
                                           icon='users'
                                           iconPosition='left'
                                           autoFocus
                                           onChange={this.handleChange}
                                           size="huge"
                                           placeholder="First Name"
                                           autoComplete="off"
                                           required
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <Input id="lastName"
                                           icon='users'
                                           iconPosition='left'
                                           autoFocus
                                           onChange={this.handleChange}
                                           size="huge"
                                           placeholder="Last Name"
                                           autoComplete="off"
                                           required
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Divider/>
                        </Grid>
                        <Grid textAlign="center" columns={2} doubling>
                            <Grid.Column>
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
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <Input id="username"
                                           icon='users'
                                           iconPosition='left'
                                           autoFocus
                                           onChange={this.handleChange}
                                           size="huge"
                                           placeholder="Choose a username"
                                           autoComplete="off"
                                           required
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                        <Grid columns={2} textAlign="center" doubling>
                            <Grid.Column>
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
                            </Grid.Column>
                            <Grid.Column>
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
                            </Grid.Column>
                        </Grid>
                    </Form>
                <Divider />
                <Button className="signupButton"
                        loading={this.state.loading}
                        size='huge'
                        onClick={this.send}>
                    Register
                </Button>
                <Divider />
                <div className="signupNoAccount">
                    <p>
                        Have an account ? <a href="/login">Log in</a>
                    </p>
                </div>
            </Container>
        );
    }
}

export default Signup;