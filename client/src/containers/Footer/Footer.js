import React from 'react';
import {Grid} from "semantic-ui-react";

class Footer extends React.Component {

    render() {
        return (
            <footer>
                <Grid stretched verticalAlign='middle' textAlign='center'>
                    <Grid.Row stretched>
                        <h3>Developed by <a target="_blank" rel="noopener noreferrer" href="https://github.com/jeguglie">jeguglie</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/bajouini">bajouini</a></h3>
                    </Grid.Row>
                </Grid>
            </footer>
        )
    }
}

export default Footer;