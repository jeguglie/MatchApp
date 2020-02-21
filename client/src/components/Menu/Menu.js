import React from 'react';
import { ButtonToolbar, Navbar, Button, Nav, ButtonGroup, NavDropdown} from 'react-bootstrap';
import { Icon } from "semantic-ui-react";
import classnames from 'classnames';
import './bootstrap-iso.css';
import { withRouter } from 'react-router';
import Aux from "Src/hoc/Aux";
import API from 'Src/utils/API';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const withRouterAndRef = (WrappedComponent) => {
    class InnerComponentWithRef extends React.Component {
        render() {
            const { forwardRef, ...rest } = this.props;
            return <WrappedComponent {...rest} ref={forwardRef} />;
        }
    }
    const ComponentWithRouter = withRouter(InnerComponentWithRef, { withRef: true });
    return React.forwardRef((props, ref) => {
        return <ComponentWithRouter {...props} forwardRef={ref} />;
    });
}


class Menu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            activeItem: '',
            redirect: '',
            connected: false,
            notifNb: 0,
        };
        this._mounted = false;
        this.innerRefToggle = React.createRef();
    }

    componentDidMount = async() => {
        this._mounted = true;
        if (cookies.get('token'))
            await API.withAuth()
                .then(async(res) => {
                    if (res.status === 200)
                        this.setState({connected: true});
                    await API.getNotifNb()
                        .then(res => {
                            if (res.status === 200)
                                this._mounted && this.setState({notifNb: res.data.notifNb})
                        });
                });
        this._mounted && this.setState({activeItem: this.props.location.pathname});
    };

    updateNotifNb = async() => {
        await API.getNotifNb()
            .then(res => {
                if (res.status === 200)
                    this._mounted && this.setState({notifNb: res.data.notifNb})
            });
    };
    handleConnected = (bool) => {this.setState({connected: bool})};

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isConnected !== this.props.isConnected && this.props.isConnected === true){
            API.getNotifNb()
                .then(res => {
                    if (res.status === 200)
                        this._mounted && this.setState({notifNb: res.data.notifNb, connected: true})
                });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.location.pathname !== prevState.activeItem)
            return{activeItem: nextProps.location.pathname};
        if (nextProps.isConnected !== prevState.isConnected && nextProps.isConnected === true){
            API.getNotifNb()
                .then(res => {
                    if (res.status === 200)
                        return({notifNb: res.data.notifNb, connected: true});
                });
        }
        return null;
    }

    handleItemClick = (e, redirect) => { 
        this.simulateClick();
        this.setState({ activeItem: redirect}, () => this.redirect(redirect)) 
    };
    redirect = (redirect) => { this.props.history.push(redirect) };
    disconnect = () => {
        API.logout()
            .then(res => {
                if (res.status === 200) {
                    this._mounted && this.setState({connected: false});
                    window.location.href = "/login";
                    this.props.logout();
                }
            });
    };

    simulateClick(){ this.innerRefToggle && this.innerRefToggle.current && this.innerRefToggle.current.click() }
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
        const { activeItem, notifNb, connected } = this.state;
        const navDropdownTitle = (
            <Aux>
                <Icon size='large' name='user'/>
                <span className="itemMenu">Profile</span>
            </Aux>
        );
        if (connected === true)
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
                            Change my password
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => this.handleItemClick(null, "/changemail")}>
                            Change my mail
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => this.handleItemClick(null, "/changelocation")}>
                            Change my location
                        </NavDropdown.Item>

                    </NavDropdown>
                    <Nav.Link
                        className={activeItem === '/chat' ? "activeItem" : null}
                        redirect='chat'
                        onClick={() => this.handleItemClick(null, "/chat")}>
                        <Icon size='large' name='conversation' />
                        <span className="itemMenu">Messages</span>
                    </Nav.Link>
                    <Nav.Link
                        className={activeItem === '/notifications' ? "activeItem" : null}
                        id='/notifications'
                        onClick={() => this.handleItemClick(null, "/notifications")}>
                        <Icon size='large' name='bell' />
                        <div className="badgecontainernotif">
                            <span className="itemMenu">Notifications</span>
                            {notifNb > 0 ? <span className="badgenotif">{notifNb}</span> : null}
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
                            <a href='# ' onClick={() => this.props.history.push('/')}>
                                <img
                                    src={'/assets/img/MatchApp-Logo.png'}
                                    height="50"
                                    alt="MatchApp Logo"
                                />
                            </a>
                        </Navbar.Brand>
                        <Navbar.Toggle ref={this.innerRefToggle}/>
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


export default withRouterAndRef(Menu);
