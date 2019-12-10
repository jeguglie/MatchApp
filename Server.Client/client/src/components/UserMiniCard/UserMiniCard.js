import React from 'react';

const DEFAULT_STATE = {
    users: []
};

const Card = (props) => {
    const users = props.users;
    if (users && users.length)
        return users.map((user, i) => {
            return (
                <div className="CardContainer">
                    <span>{user.name}</span>
                </div>
            )
        });
    else
        return null;
}

class UserMiniCard extends React.Component {

    state = {...DEFAULT_STATE};

    constructor(props) {
        super(props);
        this.state.users = this.props.users;
    }
    render() {
        const { users } = this.state;
        console.log(users);
        return(
            <Card
                users={users}
            />
        )
    }
}
export default UserMiniCard;