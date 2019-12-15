import React from 'react';
import EditProfil from '../../components/EditProfil/EditProfil';
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";
import Rail from "semantic-ui-react/dist/commonjs/elements/Rail";
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