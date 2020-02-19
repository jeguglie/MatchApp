import React from 'react';
import {Divider, Form, TextArea, Grid, Progress, Icon, Select} from 'semantic-ui-react';
import API from "Src/utils/API";
import VALIDATE from "Src/utils/validation";
import _ from "lodash";
const countries = VALIDATE.countries;
const age = VALIDATE.age;
const genderOptions = [
    { key: 'male', value: 'male', text: 'Male' },
    { key: 'female', value: 'female', text: 'Female' },
];
const interestedOptions = [
    { key: 'homosexual', value: 'homosexual', text: 'Homosexual' },
    { key: 'heterosexual', value: 'heterosexual', text: 'Heterosexual' },
    { key: 'bisexual', value: 'bisexual', text: 'Bisexual' },
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
    age: '',
    loading: false,
    complete: 0,
    w_lastname: '',
    w_age: '',
    w_firstname: '',
    w_gender: '',
    w_interested: '',
    w_country: '',
    w_bio: '',
};

const DEFAULT_ERRORS = {
    w_age: '',
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
        this._mounted = false;
        this.state = {...DEFAULT_STATE};
        this.state.complete = this.props.complete;
        // Set key for countries
        this.countries = countries;
        this.age = age;
        this.age = this.age.map((item, index) => ({key: index, text: item.value, value: item.value }));
        this.countries = this.countries.map((item, index) => ({key: index, text: item.value, value: item.value }));
        // Set default errors
        this.warnings = {...DEFAULT_ERRORS};

    }

    componentWillUnmount() {
        this._mounted = false;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.complete !== prevState.complete)
            return { complete: nextProps.complete};
        return null;
    }

    componentDidMount = async() => {
        window.scrollTo(0, 0);
        this._mounted = true;
        this._mounted && this.setState({complete: this.props.complete});
        await API.getEditProfilValues()
            .then((response) => {
                if (typeof response.data.findProfil !== 'undefined')
                    if (this._mounted === true)
                        this._mounted && this.setState({...response.data.findProfil});
            })
            .catch((error) => {
                if (typeof error.response !== 'undefined'
                    && typeof error.response.data !== 'undefined' && typeof error.response.data.warnings !== 'undefined')
                    if (this._mounted === true)
                        this._mounted && this.setState({...error.response.data.warnings});
            })
    }

    handleSave = async() => {
        if (this._mounted) {
            this.warnings = {...DEFAULT_ERRORS};
            // Check country
            let detectCountry = false;
            let detectAge  = false;
            this.countries.forEach((data) => {
                if (data.value === this.state.country) {
                    detectCountry = true;
                    return;
                }
            });
            this.age.forEach((data) => {
                if (data.value === this.state.age) {
                    detectAge = true;
                    return;
                }
            });
            // let detectCountry = this.countries.some(data => data.value === this.state.country);
            if (!detectCountry)
                this.warnings.w_country = "Please select a valid country";
            if (!detectAge)
                this.warnings.w_age = "Please select your age";
            if (!VALIDATE.validateFirstName(this.state.lastname))
                this.warnings.w_lastname = "Only characters are allowed for your lastname. Must contain between 3 and 13 characters";
            if (!VALIDATE.validateFirstName(this.state.firstname))
                this.warnings.w_firstname = "Only characters are allowed for your first name. Must contain between 3 and 13 characters";
            if (this.state.interested !== "homosexual" && this.state.interested !== "heterosexual" && this.state.interested !== "bisexual")
                this.warnings.w_interested = "Please select a valid interest option";
            if (this.state.gender !== "male" && this.state.gender !== "female")
                this.warnings.w_gender = "Please select a valid gender option";
            if (this.state.bio && this.state.bio.length > 90)
                this.warnings.w_bio = "Your bio is too long, please use 90 maximum characters. You have " + this.state.bio.length;
            if (!VALIDATE.checkWarnings(this.warnings) === true) {
                await API.updateEditProfilValues(this.state)
                    .then(() => {
                        this._mounted && this.setState({loading: false}, () => {
                            this.props.nextsection();
                        });
                    })
                    .catch(error => {
                        if (typeof error.response !== 'undefined'
                            && typeof error.response.data !== 'undefined' && typeof error.response.data.warnings !== 'undefined')
                            this._mounted && this.setState({...error.response.data.warnings});
                    });
            } else
                this._mounted && this.setState({...this.warnings});
        }
    };
    handleChange = _.debounce((e, { value, id }) => {
        this._mounted && this.setState({[id]: value, ["w_" + id]: ''});
    }, 300);

    handleChangeFocus = (e) => {
        let id = e.target.id;
        if (this.state.id !== '')
            this._mounted && this.setState({[id]: ''});
    }

    render() {
        const {w_age, w_firstname, age, w_lastname, w_gender, w_interested, w_country, w_bio, complete} = this.state;
        const ProgressBar = () => (
            <Progress
                percent={complete}
                progress
                indicating
                size="medium"/>
        );
        return (
            <div className="BasicInfosContainer">
                <div className="BasicInformations">
                    <ProgressBar />
                    <Grid textAlign="center">
                        <Grid.Row centered>
                            <h1 className="CompleteTitle">Complete Basics Informations</h1>
                        </Grid.Row>
                    </Grid>
                    <div className="shapeBasicsInfos"></div>
                    <Divider hidden />
                    <Grid columns={1} doubling>
                        <Grid.Column>
                            <Form className="BasicInfosForm">
                                <Form.Field
                                    error={w_age.length > 0 ? w_age : null}
                                    id="age"
                                    control={Select}
                                    value={age ? age.toString() : ''}
                                    options={this.age}
                                    label="Select your age"
                                    placeholder='Your Age'
                                    onChange={this.handleChange}
                                />
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        error={w_lastname.length > 0 ? w_lastname : null}
                                        fluid
                                        label='Last Name'
                                        color="white"
                                        id="lastname"
                                        onClick={this.handleChangeFocus}
                                        onChange={this.handleChange}
                                        placeholder={this.state.lastname}
                                    />
                                    <Form.Input
                                        error={w_firstname.length > 0 ? w_firstname : null}
                                        fluid
                                        label='First Name'
                                        id="firstname"
                                        content={this.state.firstname}
                                        placeholder={this.state.firstname}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal' className="DropdownBasic">
                                    <Form.Field
                                        error={w_gender.length > 0 ? w_gender : null}
                                        id="gender"
                                        control={Select}
                                        value={this.state.gender}
                                        placeholder="Select Gender"
                                        options={genderOptions}
                                        label="Select Gender"
                                        onChange={this.handleChange}
                                    />
                                    <Form.Field
                                        error={w_interested.length > 0 ? w_interested : null}
                                        id="interested"
                                        control={Select}
                                        value={this.state.interested}
                                        options={interestedOptions}
                                        label="Orientation "
                                        placeholder='Orientation'
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid
                                        disabled
                                        label='Email'
                                        id="email"
                                        placeholder={this.state.email}
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
                                    placeholder={this.state.bio != null && this.state.bio.length ? this.state.bio : ''}
                                    onChange={this.handleChange}
                                />
                            </Form>
                        </Grid.Column>
                        <Divider hidden />
                        <Grid.Row centered>
                            <Icon className="EditProfilArrow"
                                  name='arrow circle right'
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