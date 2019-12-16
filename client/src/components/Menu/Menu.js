import React from 'react';
import {Icon, Menu, Image,} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { withRouter } from 'react-router';
import API from '../../utils/API'
import Aux from "../../hoc/Aux";

class NavbarMenu extends React.Component {

    state = {
        activeItem: null,
        redirect: null,
        connected: false,
    };

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.setState({activeItem: this.props.location.pathname})
        API.withAuth()
            .then(res => {
                if (res.status === 200) {
                    this.setState({connected: true});
                }
                else
                    throw new Error(res.error);
            })
            .catch(() => {this.setState({connected: false});});
    }

    handleItemClick = (e, { name }) => {
        this.setRedirect(name);
        this.setState({ activeItem: name })
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
    };
    setRedirect = (name) => {
        this.setState({redirect: name})
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
                    this.setState({connected: false})
                    this.props.history.push('/login');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                this.setState({warnings: ["Wrong username or password"]});
            });
    };
    isConnected = () => {
        const { activeItem } = this.state
        if (this.state.connected === false)
            return (
                <Aux>
                <Menu.Item
                    name='/signup'
                    active={activeItem === '/signup'}
                    onClick={this.handleItemClick} >
                    <Icon name='signup' />
                    Sign up
                </Menu.Item>
                <Menu.Item
                    name='/login'
                    active={activeItem === '/login'}
                    onClick={this.handleItemClick} >
                    <Icon name='user' />
                    Log in
                </Menu.Item>
                </Aux>
            )
        else {
            return (
                <div>
                    <Menu.Item
                        name='/logout'
                        active={activeItem === '/logout'}
                        onClick={this.disconnect} >
                        <Icon
                            name='log out'
                        />
                        <span className="itemMenu">Log out</span>
                    </Menu.Item>
                </div>
            )
        }
    }
    render(){
        const { activeItem } = this.state
        return(
                <Menu inverted icon='labeled' stackable size="small" className="Menu">
                    {this.renderRedirect()}

                    <Menu.Item className="Logo">
                        <Image
                            className="NavbarLogo"
                            src='./../../img/MatchApp-Logo.png'
                            size={"small"}/>
                    </Menu.Item>
                    <Menu.Menu icon='labeled'>
                        <Menu.Item
                            name='/wall'
                            active={activeItem === '/wall'}
                            onClick={this.handleItemClick} >
                            <Icon name='gratipay' />
                            <span className="itemMenu">Wall</span>
                        </Menu.Item>
                        <Menu.Item
                            name='/'
                            active={activeItem === '/'}
                            onClick={this.handleItemClick} >
                            <Icon name='user' />
                            <span className="itemMenu">Profile</span>
                        </Menu.Item>
                        <Menu.Item
                            name='/messages'
                            active={activeItem === '/messages'}
                            onClick={this.handleItemClick}>
                            <Icon name='conversation' />
                            <span className="itemMenu">Messages</span>
                        </Menu.Item>
                    </Menu.Menu>
                    <Menu.Item
                        name='/notifications'
                        active={activeItem === '/notifications'}
                        onClick={this.handleItemClick}>
                        <Icon name='bell' />
                        <span className="itemMenu">Notifications</span>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        {this.isConnected()}
                    </Menu.Menu>
                </Menu>

        )
    }
}
export default withRouter(NavbarMenu)