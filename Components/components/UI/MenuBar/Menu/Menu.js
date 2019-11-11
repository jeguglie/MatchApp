import React from 'react';
import './Menu.css';
import Logo from '../../img/logo/MatchApp-Logo.png';
import classes from 'classnames';
import {Grid, Image} from 'semantic-ui-react';
function Menu(props){
    return (
        <Grid columns={1}>
            <Grid.Column>
                <Image centered size='medium' src={Logo} />
            </Grid.Column>
        </Grid>
    );
}

export default Menu;