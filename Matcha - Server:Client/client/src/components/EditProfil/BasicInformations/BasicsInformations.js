import React from 'react';
import {Form, TextArea, Grid, Progress, Icon, Select} from 'semantic-ui-react';
import API from "../../../utils/API";
import classnames from 'classnames';
import DividerC from "../../Divider/Divider";
const mongoose = require('mongoose');
const DEFAULT_STATE = {
    email: "",
    firstName: "",
    lastName: "",
    interested: "",
    bio: "",
    gender: "",
    interests: [],
    country: "",
    birthday: "",
    messages : {
        save: false,
        warnings: []
    },
    complete : 0
};

const genderOptions = [
    { key: 'male', value: 'male', text: 'Male' },
    { key: 'female', value: 'female', text: 'Female' },
];

const countryOptions = [
    { key: 'fr', value: 'France', text: 'France' }
];


const ProgressBar = () => (
    <Progress
        percent={70}
        className="ProgressBarProfile"
        indicating
        progress
        size="large"/>
);
class BasicsInformations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    async componentDidMount() {
        try {
            const ObjectId = mongoose.Types.ObjectId(localStorage.getItem('id'));
            const {data} = await API.getEditProfilValues(ObjectId);
            if (data && data.message === true)
                this.setState({warnings: data.message});
            const newState = data.findProfil;
            if (data.findProfil) {
                this.setState({...newState});
            }
        } catch (error) {
            console.error(error);
        }
    }
    handleSave = async(props) => {
        this.props.nextSection();
        try {
            const ObjectId2 = mongoose.Types.ObjectId(localStorage.getItem('id'));
            const data = await API.updateEditProfilValues(this.state, ObjectId2);
            if (Array.isArray(data.warnings) && data.warnings.length)
                this.setState({warnings: data.warnings});
            else
                this.setState({save: true});
        } catch (error) {
            console.error(error);
        }
    };

    handleChange = (e, { value, id }) => {
        this.setState({ [id]: value });
    };

    render() {
        return (
            <div className="container-fluid">
                <div className={classnames("ui middle", "EditProfil")}>
                    <Grid columns={2} doubling>
                        <Grid.Column>
                            <h1 className="CompleteTitle">Complete Basics Informations</h1>
                        </Grid.Column>
                        <Grid.Column>
                            <ProgressBar />
                        </Grid.Column>
                    </Grid>
                    <Grid columns={1} doubling>
                        <DividerC />
                        <Grid.Column>
                            <Form  className="formEdit">
                                <Form.Group widths='equal'>
                                    <Form.Input fluid
                                                label='Last Name'
                                                color="white"
                                                id="lastName"
                                                value={this.state.lastName}
                                                onChange={this.handleChange}
                                                placeholder="Last Name"
                                    />
                                    <Form.Input fluid
                                                label='First Name'
                                                id="firstName"
                                                value={this.state.firstName}
                                                onChange={this.handleChange}
                                                placeholder="First Name"
                                    />
                                </Form.Group>
                                <Form.Group widths='equal' className="DropdownEdit">
                                    <Form.Field
                                        id="gender"
                                        control={Select}
                                        value={this.state.gender}
                                        options={genderOptions}
                                        label="Select Gender"
                                        placeholder='Gender'
                                        onChange={this.handleChange}
                                    />
                                    <Form.Field
                                        id="interested"
                                        control={Select}
                                        value={this.state.interested}
                                        options={genderOptions}
                                        label="Interested by "
                                        placeholder='Interested by'
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid
                                        label='Email'
                                        id="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Field
                                        id="country"
                                        control={Select}
                                        value={this.state.country}
                                        options={countryOptions}
                                        label="Select Country"
                                        placeholder='Country'
                                        search
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Field
                                    label='Bio'
                                    control={TextArea}
                                    id="bio"
                                    placeholder="Bio"
                                    value={this.state.bio}
                                    onChange={this.handleChange}
                                />
                            </Form>
                        </Grid.Column>
                        <DividerC/>
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right'
                                  size="huge"
                                  onClick={this.handleSave}/>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}
export default BasicsInformations;