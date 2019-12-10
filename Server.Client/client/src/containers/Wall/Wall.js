import React from 'react';
import UserMiniCard from "../../components/UserMiniCard/UserMiniCard";

class Wall extends React.Component {
    state = {
        users: [
            {
                firstImg: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea",
                name: "Justine",
                distance: "14km"
            }
        ]
    };
    render() {
        const { users } = this.state;
        if (users.length)
            return (
                <UserMiniCard
                    users={users}
                />
            );
        return null;
    }
}


export default Wall;