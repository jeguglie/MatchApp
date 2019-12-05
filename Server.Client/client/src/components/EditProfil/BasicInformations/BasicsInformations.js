import React from 'react';
import {Form, TextArea, Grid, Progress, Icon, Select} from 'semantic-ui-react';
import API from "../../../utils/API";
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
    complete_basics : 0,
    loading: false,
    w_lastname: false,
    w_firstname: false,
    w_gender: false,
    w_interested: false,
    w_country: false,
    w_bio: false,
};

class BasicsInformations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
        // Set key for countries
        this.countries = countries.map((item, index) => ({key: index, text: item.value, value: item.value }));
    }

    componentWillUnmount() {
        this.setState({save: false, loading: false})
    }

    async componentDidMount() {
        try {
            const {data} = await API.getEditProfilValues();
            if (data.findProfil)
                this.setState({...data.findProfil}, () => this.props.increaseComplete(data.findProfil.complete_basics));
        } catch (error) {
            console.error(error);
        }
    }
    handleSave = async(props) => {
        // Init errors
        let errors = false;
        // Check Country
        const country = this.countries;
        let find = false;
        country.map((data) => {
            if (data.value === this.state.country)
                find = true;
        });
        if (!find)
            this.state.w_country = "Please select a valid country"
        // Check Name and Last Name
        const regex = new RegExp("[^A-Za-z]");
        if (regex.test(this.state.lastname)){
           this.setState({w_lastname : "Only characters are allowed for your lastname. Must contain between 3 and 13 characters."});
            errors = true;
        }
        if (regex.test(this.state.firstname)) {
            this.setState({w_firstname: "Only characters are allowed for your first name. Must contain between 3 and 13 characters."});
            errors = true;
        }
        // Check Gender and Interested by
        if (this.state.interested !== "male" && this.state.interested !== "female"){
            this.setState({w_interested : "Please select a valid interest option"});
            errors = true;
        }
        if (this.state.gender !== "male" && this.state.gender !== "female"){
            this.setState({w_gender : "Please select a valid gender option"});
            errors = true;
        }
        if (this.state.bio && this.state.bio.length > 90) {
            this.setState({w_bio: "Your bio is too long, please use 90 maximum characters. You have " + this.state.bio.length});
            errors = true;
        }
        if(errors !== true) {
            try {
                const { data } = await API.updateEditProfilValues(this.state);
                if (!data.save) {
                    this.setState({warnings: data.warnings});
                }
                if (data.save)
                    this.setState({save: true, loading: false, complete: data.complete}, () => {
                        this.props.nextSection();
                    });
            }
             catch (error) {
                console.error(error);
            }
        };
    }

    handleChange = (e, { value, id }) => {
        // Unset warnings if change
        this.setState({ [id]: value, ["w_" + id]: ''});
    };

    render() {
        const {w_firstname, w_lastname, w_gender, w_interested, w_country, w_bio} = this.state;
        const ProgressBar = () => (
            <Progress
                percent={this.props.complete}
                className="ProgressBarProfile"
                indicating
                progress
                size="large"/>
        );
        return (
            <div className="container-fluid">
                <div className={classnames("ui middle", "BasicInformations")}>
                    <Grid columns={2} doubling>
                        <Grid.Column>
                            <h1 className="CompleteTitle">Complete Basics Informations</h1>
                        </Grid.Column>
                        <Grid.Column>
                            <ProgressBar />
                        </Grid.Column>
                    </Grid>
                    <Grid textAlign="left">
                        <Grid.Row textAlign="center">
                            <div className="loginWarnings">
                                <Warnings data={this.state.warnings} />
                            </div>
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
                                    value={this.state.bio}
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