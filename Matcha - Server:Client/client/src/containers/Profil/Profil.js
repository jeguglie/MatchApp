import React from 'react';
import EditProfil from '../../components/EditProfil/EditProfil';
import API from "../../utils/API";

class Profil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                email: "",
                year: "",
                firstName: "",
                lastName: "",
                gender: "",
                interested: "",
                bio: "",
                country: "",
            },
            imgSrc: [],
        };
        this.infos = {
            message: null
        }
    }
    update = async(event) => {
        try {
            const { data } = await API.updateEditProfilValues(this.state);
            if (data && data.message === true)
                this.setState({message: data.message});

        } catch (error) {
            console.error(error);
        }
    };

    handleChange = async(event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        return (
                <div className="Profil">
                    <EditProfil values={this.state} message={this.infos.message} update={this.update}/>
                </div>
        )
    }
}

export default Profil;