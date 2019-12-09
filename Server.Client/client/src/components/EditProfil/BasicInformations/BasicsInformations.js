import React from 'react';
import {Divider, Form, TextArea, Grid, Progress, Icon, Select, Loader, Dimmer} from 'semantic-ui-react';
import API from "../../../utils/API";
import VALIDATE from "../../../utils/validation";
import classnames from 'classnames';
import DividerC from "../../Divider/Divider";
import Warnings from "../../Warnings/Warnings";


const genderOptions = [
    { key: 'male', value: 'male', text: 'Male' },
    { key: 'female', value: 'female', text: 'Female' },
];

const countries = [
    { value: 'Afghanistan', countryCode: 'af' },
    { value: 'Aland Islands', countryCode: 'ax' },
    { value: 'Albania', countryCode: 'al' },
    { value: 'Algeria', countryCode: 'dz' },
    { value: 'American Samoa', countryCode: 'as' },
    { value: 'Andorra', countryCode: 'ad' },
    { value: 'Angola', countryCode: 'ao' },
    { value: 'Anguilla', countryCode: 'ai' },
    { value: 'Antigua', countryCode: 'ag' },
    { value: 'Argentina', countryCode: 'ar' },
    { value: 'Armenia', countryCode: 'am' },
    { value: 'Aruba', countryCode: 'aw' },
    { value: 'Australia', countryCode: 'au' },
    { value: 'Austria', countryCode: 'at' },
    { value: 'Azerbaijan', countryCode: 'az' },
    { value: 'Bahamas', countryCode: 'bs' },
    { value: 'Bahrain', countryCode: 'bh' },
    { value: 'Bangladesh', countryCode: 'bd' },
    { value: 'Barbados', countryCode: 'bb' },
    { value: 'Belarus', countryCode: 'by' },
    { value: 'Belgium', countryCode: 'be' },
    { value: 'Belize', countryCode: 'bz' },
    { value: 'Benin', countryCode: 'bj' },
    { value: 'Bermuda', countryCode: 'bm' },
    { value: 'Bhutan', countryCode: 'bt' },
    { value: 'Bolivia', countryCode: 'bo' },
    { value: 'Bosnia', countryCode: 'ba' },
    { value: 'Botswana', countryCode: 'bw' },
    { value: 'Bouvet Island', countryCode: 'bv' },
    { value: 'Brazil', countryCode: 'br' },
    { value: 'British Virgin Islands', countryCode: 'vg' },
    { value: 'Brunei', countryCode: 'bn' },
    { value: 'Bulgaria', countryCode: 'bg' },
    { value: 'Burkina Faso', countryCode: 'bf' },
    { value: 'Burma', countryCode: 'mm', alias: 'Myanmar' },
    { value: 'Burundi', countryCode: 'bi' },
    { value: 'Caicos Islands', countryCode: 'tc' },
    { value: 'Cambodia', countryCode: 'kh' },
    { value: 'Cameroon', countryCode: 'cm' },
    { value: 'Canada', countryCode: 'ca' },
    { value: 'Cape Verde', countryCode: 'cv' },
    { value: 'Cayman Islands', countryCode: 'ky' },
    { value: 'Central African Republic', countryCode: 'cf' },
    { value: 'Chad', countryCode: 'td' },
    { value: 'Chile', countryCode: 'cl' },
    { value: 'China', countryCode: 'cn' },
    { value: 'Christmas Island', countryCode: 'cx' },
    { value: 'Cocos Islands', countryCode: 'cc' },
    { value: 'Colombia', countryCode: 'co' },
    { value: 'Comoros', countryCode: 'km' },
    { value: 'Congo', countryCode: 'cd' },
    { value: 'Congo Brazzaville', countryCode: 'cg' },
    { value: 'Cook Islands', countryCode: 'ck' },
    { value: 'Costa Rica', countryCode: 'cr' },
    { value: 'Cote Divoire', countryCode: 'ci' },
    { value: 'Croatia', countryCode: 'hr' },
    { value: 'Cuba', countryCode: 'cu' },
    { value: 'Cyprus', countryCode: 'cy' },
    { value: 'Czech Republic', countryCode: 'cz' },
    { value: 'Denmark', countryCode: 'dk' },
    { value: 'Djibouti', countryCode: 'dj' },
    { value: 'Dominica', countryCode: 'dm' },
    { value: 'Dominican Republic', countryCode: 'do' },
    { value: 'Ecuador', countryCode: 'ec' },
    { value: 'Egypt', countryCode: 'eg' },
    { value: 'El Salvador', countryCode: 'sv' },
    { value: 'Equatorial Guinea', countryCode: 'gq' },
    { value: 'Eritrea', countryCode: 'er' },
    { value: 'Estonia', countryCode: 'ee' },
    { value: 'Ethiopia', countryCode: 'et' },
    { value: 'Europeanunion', countryCode: 'eu' },
    { value: 'Falkland Islands', countryCode: 'fk' },
    { value: 'Faroe Islands', countryCode: 'fo' },
    { value: 'Fiji', countryCode: 'fj' },
    { value: 'Finland', countryCode: 'fi' },
    { value: 'France', countryCode: 'fr' },
    { value: 'French Guiana', countryCode: 'gf' },
    { value: 'French Polynesia', countryCode: 'pf' },
    { value: 'French Territories', countryCode: 'tf' },
    { value: 'Gabon', countryCode: 'ga' },
    { value: 'Gambia', countryCode: 'gm' },
    { value: 'Georgia', countryCode: 'ge' },
    { value: 'Germany', countryCode: 'de' },
    { value: 'Ghana', countryCode: 'gh' },
    { value: 'Gibraltar', countryCode: 'gi' },
    { value: 'Greece', countryCode: 'gr' },
    { value: 'Greenland', countryCode: 'gl' },
    { value: 'Grenada', countryCode: 'gd' },
    { value: 'Guadeloupe', countryCode: 'gp' },
    { value: 'Guam', countryCode: 'gu' },
    { value: 'Guatemala', countryCode: 'gt' },
    { value: 'Guinea', countryCode: 'gn' },
    { value: 'Guinea-Bissau', countryCode: 'gw' },
    { value: 'Guyana', countryCode: 'gy' },
    { value: 'Haiti', countryCode: 'ht' },
    { value: 'Heard Island', countryCode: 'hm' },
    { value: 'Honduras', countryCode: 'hn' },
    { value: 'Hong Kong', countryCode: 'hk' },
    { value: 'Hungary', countryCode: 'hu' },
    { value: 'Iceland', countryCode: 'is' },
    { value: 'India', countryCode: 'in' },
    { value: 'Indian Ocean Territory', countryCode: 'io' },
    { value: 'Indonesia', countryCode: 'id' },
    { value: 'Iran', countryCode: 'ir' },
    { value: 'Iraq', countryCode: 'iq' },
    { value: 'Ireland', countryCode: 'ie' },
    { value: 'Israel', countryCode: 'il' },
    { value: 'Italy', countryCode: 'it' },
    { value: 'Jamaica', countryCode: 'jm' },
    { value: 'Jan Mayen', countryCode: 'sj', alias: 'Svalbard' },
    { value: 'Japan', countryCode: 'jp' },
    { value: 'Jordan', countryCode: 'jo' },
    { value: 'Kazakhstan', countryCode: 'kz' },
    { value: 'Kenya', countryCode: 'ke' },
    { value: 'Kiribati', countryCode: 'ki' },
    { value: 'Kuwait', countryCode: 'kw' },
    { value: 'Kyrgyzstan', countryCode: 'kg' },
    { value: 'Laos', countryCode: 'la' },
    { value: 'Latvia', countryCode: 'lv' },
    { value: 'Lebanon', countryCode: 'lb' },
    { value: 'Lesotho', countryCode: 'ls' },
    { value: 'Liberia', countryCode: 'lr' },
    { value: 'Libya', countryCode: 'ly' },
    { value: 'Liechtenstein', countryCode: 'li' },
    { value: 'Lithuania', countryCode: 'lt' },
    { value: 'Luxembourg', countryCode: 'lu' },
    { value: 'Macau', countryCode: 'mo' },
    { value: 'Macedonia', countryCode: 'mk' },
    { value: 'Madagascar', countryCode: 'mg' },
    { value: 'Malawi', countryCode: 'mw' },
    { value: 'Malaysia', countryCode: 'my' },
    { value: 'Maldives', countryCode: 'mv' },
    { value: 'Mali', countryCode: 'ml' },
    { value: 'Malta', countryCode: 'mt' },
    { value: 'Marshall Islands', countryCode: 'mh' },
    { value: 'Martinique', countryCode: 'mq' },
    { value: 'Mauritania', countryCode: 'mr' },
    { value: 'Mauritius', countryCode: 'mu' },
    { value: 'Mayotte', countryCode: 'yt' },
    { value: 'Mexico', countryCode: 'mx' },
    { value: 'Micronesia', countryCode: 'fm' },
    { value: 'Moldova', countryCode: 'md' },
    { value: 'Monaco', countryCode: 'mc' },
    { value: 'Mongolia', countryCode: 'mn' },
    { value: 'Montenegro', countryCode: 'me' },
    { value: 'Montserrat', countryCode: 'ms' },
    { value: 'Morocco', countryCode: 'ma' },
    { value: 'Mozambique', countryCode: 'mz' },
    { value: 'Namibia', countryCode: 'na' },
    { value: 'Nauru', countryCode: 'nr' },
    { value: 'Nepal', countryCode: 'np' },
    { value: 'Netherlands', countryCode: 'nl' },
    { value: 'Netherlandsantilles', countryCode: 'an' },
    { value: 'New Caledonia', countryCode: 'nc' },
    { value: 'New Guinea', countryCode: 'pg' },
    { value: 'New Zealand', countryCode: 'nz' },
    { value: 'Nicaragua', countryCode: 'ni' },
    { value: 'Niger', countryCode: 'ne' },
    { value: 'Nigeria', countryCode: 'ng' },
    { value: 'Niue', countryCode: 'nu' },
    { value: 'Norfolk Island', countryCode: 'nf' },
    { value: 'North Korea', countryCode: 'kp' },
    { value: 'Northern Mariana Islands', countryCode: 'mp' },
    { value: 'Norway', countryCode: 'no' },
    { value: 'Oman', countryCode: 'om' },
    { value: 'Pakistan', countryCode: 'pk' },
    { value: 'Palau', countryCode: 'pw' },
    { value: 'Palestine', countryCode: 'ps' },
    { value: 'Panama', countryCode: 'pa' },
    { value: 'Paraguay', countryCode: 'py' },
    { value: 'Peru', countryCode: 'pe' },
    { value: 'Philippines', countryCode: 'ph' },
    { value: 'Pitcairn Islands', countryCode: 'pn' },
    { value: 'Poland', countryCode: 'pl' },
    { value: 'Portugal', countryCode: 'pt' },
    { value: 'Puerto Rico', countryCode: 'pr' },
    { value: 'Qatar', countryCode: 'qa' },
    { value: 'Reunion', countryCode: 're' },
    { value: 'Romania', countryCode: 'ro' },
    { value: 'Russia', countryCode: 'ru' },
    { value: 'Rwanda', countryCode: 'rw' },
    { value: 'Saint Helena', countryCode: 'sh' },
    { value: 'Saint Kitts and Nevis', countryCode: 'kn' },
    { value: 'Saint Lucia', countryCode: 'lc' },
    { value: 'Saint Pierre', countryCode: 'pm' },
    { value: 'Saint Vincent', countryCode: 'vc' },
    { value: 'Samoa', countryCode: 'ws' },
    { value: 'San Marino', countryCode: 'sm' },
    { value: 'Sandwich Islands', countryCode: 'gs' },
    { value: 'Sao Tome', countryCode: 'st' },
    { value: 'Saudi Arabia', countryCode: 'sa' },
    { value: 'Scotland', countryCode: 'gb sct' },
    { value: 'Senegal', countryCode: 'sn' },
    { value: 'Serbia', countryCode: 'cs' },
    { value: 'Serbia', countryCode: 'rs' },
    { value: 'Seychelles', countryCode: 'sc' },
    { value: 'Sierra Leone', countryCode: 'sl' },
    { value: 'Singapore', countryCode: 'sg' },
    { value: 'Slovakia', countryCode: 'sk' },
    { value: 'Slovenia', countryCode: 'si' },
    { value: 'Solomon Islands', countryCode: 'sb' },
    { value: 'Somalia', countryCode: 'so' },
    { value: 'South Africa', countryCode: 'za' },
    { value: 'South Korea', countryCode: 'kr' },
    { value: 'Spain', countryCode: 'es' },
    { value: 'Sri Lanka', countryCode: 'lk' },
    { value: 'Sudan', countryCode: 'sd' },
    { value: 'Suriname', countryCode: 'sr' },
    { value: 'Swaziland', countryCode: 'sz' },
    { value: 'Sweden', countryCode: 'se' },
    { value: 'Switzerland', countryCode: 'ch' },
    { value: 'Syria', countryCode: 'sy' },
    { value: 'Taiwan', countryCode: 'tw' },
    { value: 'Tajikistan', countryCode: 'tj' },
    { value: 'Tanzania', countryCode: 'tz' },
    { value: 'Thailand', countryCode: 'th' },
    { value: 'Timorleste', countryCode: 'tl' },
    { value: 'Togo', countryCode: 'tg' },
    { value: 'Tokelau', countryCode: 'tk' },
    { value: 'Tonga', countryCode: 'to' },
    { value: 'Trinidad', countryCode: 'tt' },
    { value: 'Tunisia', countryCode: 'tn' },
    { value: 'Turkey', countryCode: 'tr' },
    { value: 'Turkmenistan', countryCode: 'tm' },
    { value: 'Tuvalu', countryCode: 'tv' },
    { value: 'U.A.E.', countryCode: 'ae', alias: 'United Arab Emirates' },
    { value: 'Uganda', countryCode: 'ug' },
    { value: 'Ukraine', countryCode: 'ua' },
    { value: 'United Kingdom', countryCode: 'gb', alias: 'uk' },
    { value: 'United States', countryCode: 'us', alias: 'America' },
    { value: 'Uruguay', countryCode: 'uy' },
    { value: 'US Minor Islands', countryCode: 'um' },
    { value: 'US Virgin Islands', countryCode: 'vi' },
    { value: 'Uzbekistan', countryCode: 'uz' },
    { value: 'Vanuatu', countryCode: 'vu' },
    { value: 'Vatican City', countryCode: 'va' },
    { value: 'Venezuela', countryCode: 've' },
    { value: 'Vietnam', countryCode: 'vn' },
    { value: 'Wales', countryCode: 'gb wls' },
    { value: 'Wallis and Futuna', countryCode: 'wf' },
    { value: 'Western Sahara', countryCode: 'eh' },
    { value: 'Yemen', countryCode: 'ye' },
    { value: 'Zambia', countryCode: 'zm' },
    { value: 'Zimbabwe', countryCode: 'zw' },
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
        this.countries = countries.map((item, index) => ({key: index, text: item.value, value: item.value }));
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
            if (VALIDATE.checkWarnings(this.warnings) === true) {
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
        // Unset warnings if change
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
                        <Loader size='massive'>Get profile...</Loader>
                    </Dimmer>
                    <Grid textAlign="center">
                        <Grid.Row centered>
                            <h1 className="CompleteTitle">Complete Basics Informations</h1>
                        </Grid.Row>
                    </Grid>
                    <Divider hidden />
                    <Divider hidden />
                    <div className="shapeBasicsInfos"></div>
                    <Grid textAlign="center">
                        <Warnings/>
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
                        <DividerC vertically={false}/>
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