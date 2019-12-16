import React from 'react';
import {Divider, Form, TextArea, Grid, Progress, Icon, Select, Loader, Dimmer} from 'semantic-ui-react';
import API from "../../../utils/API";
import VALIDATE from "../../../utils/validation";
import classnames from 'classnames';
import Warnings from "../../Warnings/Warnings";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const countries = VALIDATE.countries;

const genderOptions = [
    { key: 'male', value: 'male', text: 'Male' },
    { key: 'female', value: 'female', text: 'Female' },
];


const DEFAULT_STATE = {
    lastname: "",
    firstname: "",
    interested: "",
    country: '',
    gender: "",
    bio: "",
    email: "",
    birthday: "",
    save: false,
    loading: false,
    complete: 0,
    w_lastname: '',
    w_firstname: '',
    w_gender: '',
    w_interested: '',
    w_country: '',
    w_bio: '',
};

const DEFAULT_ERRORS = {
    w_lastname: '',
    w_firstname: '',
    w_gender: '',
    w_interested: '',
    w_country: '',
    w_bio: '',
};

class BasicsInformations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
        this.state.complete = this.props.complete;
        // Set key for countries
        this.countries = countries;
        this.countries = this.countries.map((item, index) => ({key: index, text: item.value, value: item.value }));
        // Set default errors
        this.warnings = {...DEFAULT_ERRORS};
    }

    componentWillUnmount() {
        this.setState({save: false, loading: false});
        this._mounted = false;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.complete !== prevState.complete)
            return { complete: nextProps.complete}
        return null;
    }


    async componentDidMount() {
        this._mounted = true;
        this.setState({loading: true});
        await this.props.getcomplete();
        this.setState({complete: this.props.complete});
            await API.getEditProfilValues()
                .then((response) => {
                        if (typeof response.data.findProfil !== 'undefined')
                            if (this._mounted === true)
                                this.setState({...response.data.findProfil});
                    })
                .catch((error) => {
                    if (typeof error.response !== 'undefined'
                        && typeof error.response.data !== 'undefined' && typeof error.response.data.warnings !== 'undefined')
                        if(this._mounted === true)
                            this.setState({...error.response.data.warnings});
                })
            this.setState({loading: false});
        }

    handleSave = async() => {
        if (this._mounted) {
            this.warnings = {...DEFAULT_ERRORS};
            // Check country
            let detectCountry = false;
            this.countries.forEach((data) => {
                if (data.value === this.state.country) {
                    detectCountry = true;
                    return;
                }
            });
            // let detectCountry = this.countries.some(data => data.value === this.state.country);
            if (!detectCountry)
                this.warnings.w_country = "Please select a valid country";
            if (!VALIDATE.validateFirstName(this.state.lastname))
                this.warnings.w_lastname = "Only characters are allowed for your lastname. Must contain between 3 and 13 characters";
            if (!VALIDATE.validateFirstName(this.state.firstname))
                this.warnings.w_firstname = "Only characters are allowed for your first name. Must contain between 3 and 13 characters";
            if (this.state.interested !== "male" && this.state.interested !== "female")
                this.warnings.w_interested = "Please select a valid interest option";
            if (this.state.gender !== "male" && this.state.gender !== "female")
                this.warnings.w_gender = "Please select a valid gender option";
            if (this.state.bio && this.state.bio.length > 90)
                this.warnings.w_bio = "Your bio is too long, please use 90 maximum characters. You have " + this.state.bio.length;
            if (!VALIDATE.checkWarnings(this.warnings) === true) {
                await API.updateEditProfilValues(this.state)
                    .then(() => {
                        this.setState({loading: false}, () => {
                            this.props.nextsection();
                        });
                    })
                    .catch(error => {
                        if (typeof error.response !== 'undefined'
                            && typeof error.response.data !== 'undefined' && typeof error.response.data.warnings !== 'undefined')
                            this.setState({...error.response.data.warnings});
                    });
            } else
                this.setState({...this.warnings});
        }
    };
    handleChange = (e, { value, id }) => {
        this.setState({ [id]: value, ["w_" + id]: ''});
    };

    render() {
        const {w_firstname, w_lastname, w_gender, w_interested, w_country, w_bio, complete} = this.state;
        const ProgressBar = () => (
            <Progress
                percent={complete}
                progress
                indicating
                size="medium"/>
        );
        const Warnings = () => {
            if (this.state.warnings && this.state.warnings.length > 0)
                return (
                    <Grid.Row centered textAlign="center">
                        <div className="loginWarnings">
                            <Warnings data={this.state.warnings} />
                        </div>
                    </Grid.Row>
                )
            else return null
        }
        return (
            <div className="container-fluid">
                <div className={classnames("ui middle", "BasicInformations")}>
                    <ProgressBar />
                    <Dimmer active={this.state.loading}>
                        <Loader size='massive'/>
                    </Dimmer>
                    <Grid textAlign="center">
                        <Grid.Row centered>
                            <h1 className="CompleteTitle">Complete Basics Informations</h1>
                        </Grid.Row>
                    </Grid>
                    <div className="shapeBasicsInfos"></div>
                    <Divider hidden />
                    <Grid>
                        <Grid.Row centered className="DatePickerBasics">
                        </Grid.Row>
                    </Grid>
                    <Grid columns={1} doubling>
                        <Grid.Column>
                            <Form className="formEdit">
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        error={w_lastname.length > 0 ? w_lastname : null}
                                        fluid
                                        label='Last Name'
                                        color="white"
                                        id="lastname"
                                        value={this.state.lastname}
                                        onChange={this.handleChange}
                                        placeholder="Last Name"
                                    />
                                    <Form.Input
                                        error={w_firstname.length > 0 ? w_firstname : null}
                                        fluid
                                        label='First Name'
                                        id="firstname"
                                        value={this.state.firstname}
                                        onChange={this.handleChange}
                                        placeholder="First Name"
                                    />
                                </Form.Group>
                                <Form.Group widths='equal' className="DropdownBasic">
                                    <Form.Field
                                        error={w_gender.length > 0 ? w_gender : null}
                                        id="gender"
                                        control={Select}
                                        value={this.state.gender}
                                        options={genderOptions}
                                        label="Select Gender"
                                        placeholder='Gender'
                                        onChange={this.handleChange}
                                    />
                                    <Form.Field
                                        error={w_interested.length > 0 ? w_interested : null}
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
                                        disabled
                                        label='Email'
                                        id="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Field
                                        error={w_country.length > 0 ? w_country : null}
                                        id="country"
                                        control={Select}
                                        value={this.state.country}
                                        options={this.countries}
                                        label="Select Country"
                                        placeholder='Country'
                                        search
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Field
                                    error={w_bio.length > 0 ? w_bio : null}
                                    label='Bio'
                                    control={TextArea}
                                    id="bio"
                                    placeholder="Bio"
                                    value={this.state.bio != null && this.state.bio.length ? this.state.bio : ''}
                                    onChange={this.handleChange}
                                />
                            </Form>
                        </Grid.Column>
                        <Divider hidden />
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow alternate circle right outline'
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