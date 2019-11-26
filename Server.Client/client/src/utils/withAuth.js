import React from 'react';
import { Redirect } from 'react-router-dom';

function withAuth(ComponentToProtect) {
    return class extends React.Component {
        constructor(){
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }
        componentDidMount() {
            try {
                fetch('http://localhost:8800/user/checkToken')
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({ loading: false });
                        } else {
                            const error = new Error (res.error);
                            throw error;
                        }
                    })
                    .catch(err => {
                        console.error("ERROR: " + err);
                        this.setState({ loading: false, redirect: true});
                    });
            } catch (error) {
                console.log(error);
            }
        }
        render () {
            const { loading, redirect } = this.state;
            if (loading)
                return null;
            if (redirect) {
                return <Redirect to="/login" />;
            }
            return <ComponentToProtect {...this.props} />
        }
    }
}


export default withAuth;