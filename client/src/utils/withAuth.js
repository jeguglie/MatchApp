import React from 'react';
import { Redirect } from 'react-router-dom';
import API from 'Src/utils/API';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function withAuth(ComponentToProtect) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false,
            };
            this._mounted = false;
        }
        componentDidMount() {
            this._mounted = true;
            if (cookies.get('token'))
                API.withAuth()
                    .then(res => {
                        if (res.status === 200) {
                            this._mounted && this.setState({loading: false});
                        }
                        else
                            throw new Error(res.error);
                    })
                    .catch(() => {this._mounted && this.setState({loading: false, redirect: true})});
            else
                this._mounted && this.setState({loading: false, redirect: true});
        }

        componentWillUnmount() {
            this._mounted = false;
        }

        render () {
            const { loading, redirect } = this.state;
            if (loading)
                return null;
            if (redirect)
                return <Redirect to="/login" />;
            return <ComponentToProtect {...this.props} />
        }
    }
}

export default withAuth;
