const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const {Pool} = require('pg');

// Validate mail
function validateEmail(email)
{
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
// Validate password
function validatePassword(password) {
    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}
// Validate username
function validateUsername(username) {
    let re = /^(?=.{4,15}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return re.test(username)
}
// Validate First Name and Last Name
function validateFirstName(name) {
    let re = /^(?=.{1,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    return re.test(name);
}

const pool = new Pool({
    user: 'jeguglie',
    host: 'localhost',
    database: 'api',
    password: '06245547Jv345102.',
    port: 5432,
});

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

async function getUserId(email){
    let text = 'SELECT user_id FROM users WHERE email = $1';
    let values = [email];
    try {
        const response = await pool.query(text, values);
        if (response.rows.length < 1) {
            return null;
        } else
            return response.rows[0].user_id;
    } catch (error) {
        return null;
    }
}

async function signup(req, res) {
    const { lastname, firstname, password, email, username, cpassword } = req.body;
    let errors = false;
    const warnings = {
        w_lastname: '',
        w_firstname: '',
        w_email: '',
        w_username: '',
        w_password: '',
        w_cpassword: '',
        warnings: [],
    };
    // Check Validity
    if (!validateEmail(email))
       warnings.w_email = "Please enter a valid email.";
    if (!validatePassword(password))
        warnings.w_password = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.";
    if (cpassword.localeCompare(password) !== 0)
        warnings.w_cpassword = "Password does not match.";
    if (!validateUsername(username))
        warnings.w_username = "Please use a valid username.";
    if (!validateFirstName(firstname))
        warnings.w_firstname = "Please use a valid first name.";
    if (!validateFirstName(lastname))
        warnings.w_lastname = "Please use a valid last name.";
    // Check if warning is set
    if (Object.values(warnings).map((data) => {
        if (data.length > 0)
            return res.status(409).json({
                warnings: warnings
            })
    }))
    try {
        // Check if user exist
        let text = 'SELECT email, username FROM users WHERE email = $1 OR username = $2';
        let values = [email, username];
        let response = await pool.query(text, values);
        if (response.rows.length > 0 && response.rows[0].email === email)
            warnings.w_email = 'Email already exist';
        if (response.rows.length > 0 && response.rows[0].username === username)
            warnings.w_username = 'Username already exist';
        // Check if warning is set
        if (Object.values(warnings).map((data) => {
            if (data.length > 0)
                errors = true;
        }))
        if (errors === true)
            return res.status(409).json({
                warnings: warnings
            })
        // Create User
        text = 'INSERT INTO users(email, username, password) VALUES($1, $2, $3)';
        values = [email, username, passwordHash.generate(password)];
        await pool.query(text, values);
        // Get user_id
        const userID = await getUserId(email);
        // Create Profil
        text = 'INSERT INTO profile(user_id, lastName, firstName) VALUES($1, $2, $3)';
        values = [userID, lastname, firstname];
        await pool.query(text, values);
        // Insert Complete
        text = 'INSERT INTO user_complete(complete_basics, user_id) VALUES($1, $2)';
        values = [10, userID];
        await pool.query(text, values);
        return res.status(200).json({});

    } catch (error) {
        warnings.warnings.push("Catch error");
        console.log(error);
        return res.status(500).json({
            warnings: warnings
        });
    }
}

async function login(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            warnings: "Invalid request"
        });
    }
    try {
        const text = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const response = await pool.query(text, values);
        if (!response.rows || response.rows.length < 1) {
            return res.status(200).json({
                warnings: ["User doesn't exist"]
            });
        }
        if (!passwordHash.verify(password, response.rows[0].password))
            return res.status(500).json({
                warnings: ['Wrong username or password']
            });
        else {
            const secret = 'mysecretsshhh';
            // Issue token
            const payload = { email };
            const token = jwt.sign(payload, secret, {
                expiresIn: '1h',
            });
            res.cookie('token', token, { httpOnly: true, path: '/', domain: 'localhost' }).sendStatus(200);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            warnings: ['Catch error server']
        });
    }
}

async function getEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(500).json({warnings: ["Not Found"]});
    let text = 'SELECT * FROM profile JOIN user_complete ON profile.user_id = user_complete.user_id WHERE profile.user_id = $1';
    let values = [userID];
    try {
        const response = await pool.query(text, values);
        if (response.rows.length < 1)
            return res.status(500).json({ warnings: ["Not Found"]});
        else
            return res.status(200).json({ findProfil: response.rows[0]})
    } catch (e) {
        return res.status(500).json({
            warnings: ["Error during getEditProfilValues"]
        });
    }
}

async function updateEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null) return (res.status(500));
    try {
        let total = 0;
        let valid = false;
        let find = false;
        const {lastname, firstname, interested, country, gender, bio} = req.body.state;

        // Get Complete of user
        let text = 'SELECT complete from users WHERE user_id = $1'
        let values = [userID]
        let response = await pool.query(text, values);
        total = response.rows[0].complete;
        // Check Input
        if ((lastname.length > 2 && lastname.length < 14)
            && (firstname.length > 2 && firstname.length < 14)
            && (interested === "male" || interested === "female")
            && (gender === "male" || gender === "female")) {
                total = total + 20;
                valid = true;
        }
        else
            throw new Error;
        // Check Bio length
        if ((bio.length >= 3 && bio.length <= 90)) total = total + 5;
        // Check Country
        countries.map((data) => {if (data.value === country) find = true});
        if (!find || !valid)
            return (res.status(200)).json({
                warnings: ["Error during the save of your profile"]
            })
        else
            total = total + 5;
        text = 'UPDATE profile SET lastname = $1, firstname = $2, interested = $3, country = $4, gender = $5, bio = $6 WHERE user_id = $7; UPDATE users SET complete = $8 WHERE user_id = $7';
        values = [lastname, firstname, interested, country, gender, bio, userID, total]
        await pool.query(text, values);
        text = 'UPDATE users SET complete = $1 WHERE user_id = $2';
        values = [total, userID];
        await pool.query(text, values);
        return res.status(200).json({
            complete: total,
            save: true
        });
       } catch (error) {
        console.log(error);
            return res.status(500).json({
            warnings: ["Error during the save of your profile"]
        });
    }
}

async function addInterests(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500));
    // GET INTEREST
    const interest = req.body.interest.trim();
    try {
        // MAXIMUM 30 INTERETS
        let text = 'SELECT interest_id FROM user_interests WHERE user_id = $1';
        let values = [userID]
        let response = await pool.query(text, values);
        console.log(userID);
        if (response.rows && response.rows && response.rows.length > 30)
            return res.status(200).json({
                success: false,
                warnings: ["Max interest 30"]
            });
        // INTEREST ALREADY EXIST?
        let id_interest = null;
        text = 'SELECT * FROM interests WHERE interest = $1';
        values = [interest];
        response = await pool.query(text, values);
        // IF NOT, ADD INTEREST
        if (response.rows && response.rows.length < 1) {
            text = 'INSERT INTO interests(interest) VALUES ($1);';
            values = [interest];
            await pool.query(text, values);
            // GET THE ID OF THIS INTEREST
            text = 'SELECT id FROM interests WHERE interest = $1';
            values = [interest];
            response = await pool.query(text, values);
            if (response.rows && response.rows.length > 0)
                id_interest = response.rows[0].id;
            // IF ERROR
            else return res.status(500).json({
                    warnings: ["Catch error get ID last interest"]
                });
            // THEN ADD INTO USERS_INTERESTS
            text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1::integer, $2::integer)';
            values = [userID, id_interest];
            await pool.query(text, values);
        }
        // IF YES, ADD DIRECTLY INTO USERS_INTERESTS
        else if (response.rows && response.rows.length > 0) {
            id_interest = response.rows[0].id;
            text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1::integer , $2::integer)';
            values = [userID, id_interest];
            await pool.query(text, values);
        }
        return res.status(200).json({
            success: true,
            warnings: ["Your interest " + req.body.interest + " was successfully added to your profile."]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}


async function getInterests(req, res){
    try {
        let text = 'SELECT interest FROM interests';
        let response = await pool.query(text);
        if (response.rows && response.rows.length > 1) {
            const transformed = response.rows.map(({ interest}) => ({ "title": interest}));
            return res.status(200).json({
                results: transformed,
            });
        }
        else return res.status(500);
    } catch(error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}

async function getUserInterests(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500));
    try {
        let text = 'SELECT interest FROM interests INNER JOIN user_interests ON interests.id = user_interests.interest_id WHERE user_id = $1';
        let values = [userID];
        let response = await pool.query(text, values);
        if (response.rows && response.rows.length > 0) {
            const finalArray = response.rows.map(function (obj) {
                return obj.interest;
            });
            return res.status(200).json({
                interests: finalArray,
            });
        }
        else
            return res.status(500);
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
}

exports.login = login;
exports.signup = signup;
exports.getEditProfilValues = getEditProfilValues;
exports.updateEditProfilValues = updateEditProfilValues;
exports.addInterests = addInterests;
exports.getInterests = getInterests;
exports.getUserInterests = getUserInterests;
