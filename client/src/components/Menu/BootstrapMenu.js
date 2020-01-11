import React from 'react';
import { ButtonToolbar, Navbar, Button, Nav, ButtonGroup } from 'react-bootstrap';
import '../../Assets/global-styles/bootstrap-iso.css';
import { Icon } from "semantic-ui-react";
import API from "../../utils/API";
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import Aux from "../../hoc/Aux";
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3002');

class NavbarBootstrap extends React.Component {

    state = {
        activeItem: '',
        redirect: '',
        connected: false,
    };

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.setState({activeItem: this.props.location.pathname, connected: this.props.isConnected});
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.isConnected !== prevState.connected)
            return { connected: nextProps.isConnected};
        if(nextProps.location.pathname !== prevState.activeItem)
            return { activeItem: nextProps.location.pathname};
        return null;
    }

    handleItemClick = (e, redirect) => {
        this.setState({ activeItem: redirect}, () => this.redirect(redirect));
    };

    redirect = (redirect) => {
        this.props.history.push(redirect);
    };
    disconnect = () => {
        fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    this.props.handleConnected(false);
                    this.props.history.push('/login');
                    socket.emit("logout");
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                this.setState({warnings: ["Wrong username or password"]});
            });
    };

    isConnected = () => {
        const { activeItem } = this.state;
        if (this.state.connected === false)
            return (
                <Aux>
                    <ButtonGroup>
                        <Button
                            className={activeItem === '/login' ? classnames("activeItemButton") : null}
                            size="md"
                            id="loginButton"
                            variant="outline-primary"
                            onClick={() => this.handleItemClick(null, "/login")}>Log in</Button>
                        <Button
                            className={activeItem === '/signup' ? classnames("activeItemButton", "mr-3") : "mr-3"}
                            id="signupButton"
                            variant="outline-primary"
                            onClick={() => this.handleItemClick(null, "/signup")}>Sign up</Button>
                    </ButtonGroup>
                </Aux>
            );
        else {
            return (
                <div>
                    <ButtonToolbar className='mr-3'>
                            <Button
                                size="md"
                                variant="outline-primary"
                                onClick={this.disconnect}>Log out</Button>
                    </ButtonToolbar>
                </div>
            )
        }
    };
    render() {
        const { activeItem } = this.state;
        return (
            <div className='bootstrap-iso'>
                <div className="Menu">
                    <Navbar sticky="top" collapseOnSelect expand="sm">
                        <Navbar.Brand
                            className="ml-3"
                            id='/wall'>
                            <img
                                src='./../../img/MatchApp-Logo.png'
                                height="50"
                                alt="MatchApp Logo"/>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                        <Navbar.Collapse>
                            <Nav className='mr-auto'>
                                <Nav.Link
                                    className={activeItem === '/wall' ? "activeItem" : null}
                                    onClick={() => this.handleItemClick(null, "/wall")}>
                                    <Icon size='large' name='gratipay' />
                                    <span className="itemMenu">Wall</span>
                                </Nav.Link>
                                <Nav.Link
                                    className={activeItem === '/profile' ? "activeItem" : null}
                                    onClick={() => this.handleItemClick(null, "/profile")}>
                                    <Icon size='large' name='user' />
                                    <span className="itemMenu">Profile</span>
                                </Nav.Link>
                                <Nav.Link
                                    className={activeItem === '/messages' ? "activeItem" : null}
                                    redirect='messages'
                                    onClick={() => this.handleItemClick(null, "/messages")}>
                                    <Icon size='large' name='conversation' />
                                    <span className="itemMenu">Messages</span>
                                </Nav.Link>
                                <Nav.Link
                                    className={activeItem === '/notifications' ? "activeItem" : null}
                                    id='/notifications'
                                    onClick={() => this.handleItemClick(null, "/notifications")}>
                                    <Icon size='large' name='bell' />
                                    <span className="itemMenu">Notifications</span>
                                </Nav.Link>
                            </Nav>
                            <Nav>
                                <div className="ConnectionNav m-1">
                                    {this.isConnected()}
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        )
    }
}

export default withRouter(NavbarBootstrap);
