import React from 'react';
import {List, Button, Transition, Grid, Divider} from 'semantic-ui-react';
import API from 'Src/utils/API';

class Admin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
           users: []
        };
        this._mounted = false;
    }

    componentDidMount = async() => {
        this._mounted = true;
        await API.admin()
            .then(res => {
                if (res.status === 200)
                    this._mounted && this.setState({users: res.data.users})
            });
    };

    componentWillUnmount() { this._mounted = false; }

    handleDismiss = async(i, user_id) => {
        if (this._mounted) {
            this.state.users.splice(i, 1);
            this._mounted && this.setState({users: this.state.users}, async() => { await API.kickuser(user_id) });
        }
    };

    render(){
        const { users} = this.state;
        return (
            <Grid columns={1} textAlign={'center'}>
                <Grid.Column textAlign={'left'} mobile={16} tablet={8} computer={8} largeScreen={8} widescreen={8}>
                    <div className='NotificationsTitle'>
                        <Grid.Row>
                            <h1>Reported users</h1>
                        </Grid.Row>
                    </div>
                    <div className={"NotificationsHistoric"}>
                        <Grid.Row>
                            <Transition.Group
                                as={List}
                                duration={200}
                                verticalAlign='middle'
                            >
                                {users.length < 1 ?
                                    <div className={'nothingtoshow'}>
                                        <p>Nothing to show</p>
                                    </div> :
                                    null
                                }
                                {users.map((obj, i) => (
                                    <List.Item key={i}>
                                        <List.Content>
                                            <List.Content floated='right'>
                                                <Button
                                                    onClick={() => this.handleDismiss(i, obj.user_id_reported)}>
                                                    Dismiss
                                                </Button>
                                            </List.Content>
                                            <List.Content
                                                as='a'
                                                className={"NotifFirstname"}
                                            >
                                                {' '} {obj.user_id_reported}</List.Content>
                                        </List.Content>
                                        {i < users.length  - 1? <Divider /> : null}
                                    </List.Item>
                                ))}
                            </Transition.Group>
                        </Grid.Row>
                    </div>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Admin;