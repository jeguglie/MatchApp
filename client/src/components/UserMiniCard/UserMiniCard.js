import React from 'react';
import { Card, Grid, Image, Icon } from 'semantic-ui-react';
import equal from 'fast-deep-equal';

const DEFAULT_STATE = {
    users: [],
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
        if(!equal(this.props.users, prevProps.users)) {
            this._mounted && this.setState({users: this.props.users});
        }
    }

    // Filters
    ageFilter = (order) => {
        let users = this.state.users;
        if (order === true) {
            users.sort(function (a, b) {
                if (b.age === a.age)
                    return b.points - a.points;
                return b.age - a.age;
            });
            this._mounted && this.setState({users: users});
            return ;
        }
        else{
            users.sort(function (a, b) {
                if (b.age === a.age)
                    return b.points - a.points;
                return a.age - b.age;
            });
            this._mounted && this.setState({users: users});
        }
    };

    distanceFilter = (order) => {
        let users = this.state.users;
        if (order) {
            users.sort(function (a, b) {
                if (b.distance === a.distance)
                    return b.points - a.points;
                return b.distance - a.distance;
            });
            this._mounted && this.setState({users: users});
            return ;
        }
        else {
            users.sort(function (a, b) {
                if (b.distance === a.distance)
                    return b.points - a.points;
                return a.distance - b.distance;
            });
            this._mounted && this.setState({users: users});
        }
    };

    render() {
        const { users} = this.state;
        if (users && users.length) {
            return users.map((user, i) => {
                const {user_id, img_link, firstname, likes, distance,  age} = user;
                return (
                    <Grid.Column key={i} mobile={4} tablet={8} computer={4} largeScreen={4} widescreen={2}>

                        <Card
                            key={i}
                            className="userMinCard"
                            onClick={() => this.props.clickedUser(user_id)}>
                            <Image
                                src={img_link}
                                wrapped
                                ui={false}
                                size='large' />
                            <Card.Content className={'contentUserMinCard'}>
                                <Card.Header>{firstname}<span className="MinCardAge">, {age}</span></Card.Header>
                                <Card.Meta>
                                    <span className='date'>{Math.round(distance)} <strong>km</strong></span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <span className={'likesSpan'}>
                                    <Icon name='heart' />
                                    {likes}
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