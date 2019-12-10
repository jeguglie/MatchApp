import React from 'react';
import { Grid, Image, Icon } from 'semantic-ui-react';
const DEFAULT_STATE = {
    users: []
};
class UserMiniCard extends React.Component {

    state = {...DEFAULT_STATE};

    constructor(props) {
        super(props);
        this.state.users = this.props.users;
    }
    render() {
        const { users } = this.state;
            if (users && users.length) {
                console.log(1);
                return users.map((user, i) => {
                    const {img, name, distance} = user;
                    return (
                        <div className="CardContainer">
                            <div className="TopCardContainer">
                                <Image
                                    className="ImageCardContainer"
                                    centered
                                    src={img}
                                    key={i}
                                />
                            </div>
                            <div className="BottomCardContainer">
                                <Grid columns={2} verticalAlign='middle' centered>
                                    <Grid.Column>
                                        <Grid.Row>
                                            <span className="LastnameUserMinCard">{name}</span><br />
                                            <span className="LastnameUserMinCard">{distance}</span>
                                        </Grid.Row>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Grid.Row>
                                            <Icon circular name='add' color='white' />
                                        </Grid.Row>
                                    </Grid.Column>
                                </Grid>
                            </div>
                        </div>
                    )
                });
            }
    }
}
export default UserMiniCard;