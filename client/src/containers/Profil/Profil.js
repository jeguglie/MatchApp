import React from 'react';
import EditProfil from '../../components/EditProfil/EditProfil';
import {Container }from "semantic-ui-react";

class Profil extends React.Component {

    render() {
        return (
                <Container fluid>
                    <EditProfil />
                </Container>
        )
    }
}

export default Profil;