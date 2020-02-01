import React from 'react';
import { Card, Grid, Image, Icon } from 'semantic-ui-react';
import equal from 'fast-deep-equal';

const DEFAULT_STATE = {
    users: []
};


class UserMiniCard extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    componentDidUpdate(prevProps) {
        if(!equal(this.props.users, prevProps.users)) {
            this.setState({users: this.props.users});
        }
    }
    render() {
        const { users } = this.state;
        if (users && users.length) {
            return users.map((user, i) => {
                const {user_id, img_link, firstname, likes, distance,  age} = user;
                return (
                    <Grid.Column key={i} mobile={4} tablet={8} computer={4} largeScreen={4} widescreen={2}>
                        <Card
                            className="userMinCard"
                            onClick={() => this.props.clickedUser(user_id)}>
                            <Image
                                src={img_link}
                                key={i}
                                wrapped
                                ui={false}
                                size='large' />
                            <Card.Content>
                                <Card.Header>{firstname}<span className="MinCardAge">, {age}</span></Card.Header>
                                <Card.Meta>
                                    <span className='date'>{Math.round(distance)} <strong>km</strong></span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <span>
                                    <Icon name='heart' />
                                    {likes} Likes
                                </span>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                )
            });
        }
        return null;
    }
}
export default UserMiniCard;