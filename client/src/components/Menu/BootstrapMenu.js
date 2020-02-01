import React from 'react';
import { ButtonToolbar, Navbar, Button, Nav, ButtonGroup, NavDropdown} from 'react-bootstrap';
import '../../Assets/global-styles/bootstrap-iso.css';
import { Icon } from "semantic-ui-react";
import classnames from 'classnames';
import { withRouter } from 'react-router';
import Aux from "../../hoc/Aux";
import API from '../../utils/API';
import io from 'socket.io-client'; // The default import should be called io.

class NavbarBootstrap extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            activeItem: '',
            redirect: '',
            connected: false,
            notifNb: 0,
        };
        this._mounted = false;
        this.socket = io('http://localhost:8000');
    }

    componentDidMount = async() => {
        this._mounted = true;
        this._mounted && this.setState({activeItem: this.props.location.pathname, connected: this.props.isConnected});
        this.socket.on("getnotif", () => { this._mounted && this.setState((prevState) => ( {notifNb: prevState.notifNb + 1} )) });
        await API.getNotifications()
            .then(res => {
                if (res.status === 200)
                    this._mounted && this.setState({notifNb: res.data.notifications.length})
            })
            .catch(e => console.log(e));
    };

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
        fetch('http://localhost:5000/logout', {
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
                    this.props.s_logout();
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

    showMenu = () => {
        const { activeItem, notifNb } = this.state;
        const navDropdownTitle = (
            <Aux>
                <Icon size='large' name='user'/>
                <span className="itemMenu">Profile</span>
            </Aux>
        );
        if (this.state.connected === true)
            return (
                <Nav className='mr-auto'>
                    <Nav.Link
                        className={activeItem === '/' ? "activeItem" : null}
                        onClick={() => this.handleItemClick(null, "/")}>
                        <Icon size='large' name='gratipay' />
                        <span className="itemMenu">Wall</span>
                    </Nav.Link>
                    <NavDropdown
                        title={navDropdownTitle}
                        className={activeItem === '/profile' ? "activeItem" : null}>
                        <NavDropdown.Item
                            onClick={() => this.handleItemClick(null, "/profile")}>
                            Edit my profile
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                            onClick={() => this.handleItemClick(null, "/changepassword")}>
                            Edit my password
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => this.handleItemClick(null, "/changemail")}>
                            Edit my mail
                        </NavDropdown.Item>

                    </NavDropdown>
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
                        <div class="badgecontainernotif">
                            <span className="itemMenu">Notifications</span>
                            {notifNb > 0 ? <span class="badgenotif">{notifNb}</span> : null}
                        </div>
                    </Nav.Link>
                </Nav>
            )
        else
            return null;
    }
    render() {
        return (
            <div className='bootstrap-iso'>
                <div className="Menu">
                    <Navbar sticky="top" collapseOnSelect expand="sm">
                        <Navbar.Brand
                            className="ml-3"
                            id='/'>
                            <img
                                src='./../../img/MatchApp-Logo.png'
                                height="50"
                                alt="MatchApp Logo"/>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                        <Navbar.Collapse>
                            {this.showMenu()}
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
