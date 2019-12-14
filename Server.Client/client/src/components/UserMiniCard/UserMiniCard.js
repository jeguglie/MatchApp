import React from 'react';
import { Card, Grid, Image, Icon } from 'semantic-ui-react';
import equal from 'fast-deep-equal';

const DEFAULT_STATE = {
    users: []
};

const usersMinCard = (props) => {}

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
                const {img_link, firstname, likes, distance, age} = user;
                return (
                    <Grid.Column mobile={16} tablet={8} computer={4}>
                        <Card className="userMinCard">
                            <Image
                                src={img_link}
                                key={i}
                                wrapped
                                ui={false}
                                size='large' />
                            <Card.Content>
                                <Card.Header>{firstname}<span className="MinCardAge">, {age}</span></Card.Header>
                                <Card.Meta>
                                    <span className='date'>{distance} <strong>km</strong></span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <a>
                                    <Icon name='heart' />
                                    {likes} Likes
                                </a>
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
//
// <div className="CardContainer">
//     <div className="TopCardContainer">
//         <Image
//             className="ImageCard"
//             centered
//             src={img_link}
//             key={i}
//         />
//     </div>
//     <Grid
//         columns={2}
//         verticalAlign='middle'
//         centered
//         className="BottomCardGrid">
//         <Grid.Column floated='left'>
//             <Grid.Row>
//                 <span className="LastnameUserMinCard">{firstname.trim()}</span><br />
//                 <span className="DistanceUserMinCard">{firstname.trim()}</span>
//             </Grid.Row>
//         </Grid.Column>
//         <Grid.Column  textAlign='right' floated='right' >
//             <Grid.Row>
//                 <Icon
//                     circular
//                     name='add'
//                     color='white'
//                     className='SeeIcon'
//                 />
//             </Grid.Row>
//         </Grid.Column>
//     </Grid>
// </div>