import React from 'react';
import EditProfil from '../../components/EditProfil/EditProfil';
import API from "../../utils/API";

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