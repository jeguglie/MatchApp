import React from 'react';
import EditProfil from '../../components/EditProfil/EditProfil';
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";
import Rail from "semantic-ui-react/dist/commonjs/elements/Rail";
import {Image, Grid, Divider }from "semantic-ui-react";

class Profil extends React.Component {

    render() {
        return (
                <div className="Profil">
                    <EditProfil />
                </div>
        )
    }
}

export default Profil;