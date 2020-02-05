import React from 'react';
import { Card, Grid, Image, Icon, Loader, Dimmer } from 'semantic-ui-react';
import equal from 'fast-deep-equal';

const DEFAULT_STATE = {
    users: [],
    loading: false,
};


class UserMiniCard extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
        this._mounted = false;

    }

    componentDidMount() {
        this._mounted = true;
    }

    componentDidUpdate(prevProps) {
        if(!equal(this.props.users[0], prevProps.users[0]))
            this._mounted && this.setState({users: this.props.users});
        if(!equal(this.props.loading, prevProps.loading))
            this._mounted && this.setState({loading: this.props.loading});
    }
    render() {
        const { users, loading } = this.state;
        if (users && users.length) {
            return users.map((user, i) => {
                const {user_id, img_link, firstname, likes, distance,  age} = user;
                return (
                    <Grid.Column key={i} mobile={4} tablet={8} computer={4} largeScreen={4} widescreen={2}>

                        <Card
                            key={i}
                            className="userMinCard"
                            onClick={() => this.props.clickedUser(user_id)}>
                            {
                                this.props.userIdFocus && this.props.userIdFocus === user_id ?
                                    <Dimmer id={'DimmerUserMinCard'} active={loading}>
                                        <Loader />
                                    </Dimmer> : null
                            }
                            <Image
                                src={img_link}
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
                                <span className={'likesSpan'}>
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