const { mapKeys } = require('lodash');
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const {Pool} = require('pg');
const pool = new Pool({
    user: 'jeguglie',
    host: 'localhost',
    database: 'api',
    password: '06245547Jv345102.',
    port: 5432,
});

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
    const { lastName, firstName, password, email, username, cpassword } = req.body;
    const warnings = [];

    // Check validity
    if (!email || !password || !cpassword)
        warnings.push("Invalid request");
    if (cpassword !== password)
        warnings.push("Passwords does not match");
    if (lastName.length > 13 || firstName.length > 13)
        warnings.push("Your last name or first name is too long. Max length of 13.");
    if (warnings.length > 0)
        return res.status(200).json({
            warnings: warnings
        });
    try {

        // Check if user exist
        let text = 'SELECT email, username FROM users WHERE email = $1 OR username = $2';
        let values = [email, username];
        const warnings = [];
        let response = await pool.query(text, values);
        if (response.rows.length > 0 && response.rows[0].email === email)
            warnings.push('Email already exist');
        if (response.rows.length > 0 && response.rows[0].username === username)
            warnings.push('Username already exist');
        if (warnings.length > 0)
            return res.status(500).json({
                warnings: warnings
            });

        // Create User
        text = 'INSERT INTO users(email, username, password) VALUES($1, $2, $3)';
        values = [email, username, passwordHash.generate(password)];
        await pool.query(text, values);

        // Get user_id
        text = 'SELECT user_id FROM users WHERE email = $1';
        values = [email];
        response = await pool.query(text, values);
        let id = response.rows[0].user_id;

        // Create Profil
        text = 'INSERT INTO profile(user_id, lastName, firstName) VALUES($1, $2, $3)';
        values = [id, lastName, firstName];
        await pool.query(text, values);

        return res.status(200);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            warnings: ['Catch error']
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
    // Get User ID
    let userID = null;
    let text = 'SELECT user_id FROM users WHERE email = $1';
    let values = [res.locals.email];
    try {
        const response = await pool.query(text, values);
        if (response.rows.length < 1) {
            return res.status(500).json({
                warnings: ["Not Found"]
            });
        } else
            userID =  response.rows[0].user_id;
    } catch (error) {
        return res.status(500).json({
            warnings: [""]
        });
    }
    if (userID != null)
    {
        text = 'SELECT * FROM profile WHERE user_id = $1';
        values = [userID];
        try {
            const response = await pool.query(text, values);
            if (response.rows.length < 1) {
                return res.status(500).json({
                    warnings: ["Not Found"]
                });
            } else {
                response.rows[0].email = res.locals.email;
                return res.status(200).json({
                    findProfil: response.rows[0]
                })
            }
        } catch (error) {
            return res.status(500).json({
                warnings: [""]
            });
        }
    }

}

async function updateEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null) return (res.status(500));
    try {
        const {lastname, firstname, interested, country, gender, bio} = req.body.state;
        const text = 'UPDATE profile SET lastname = $1, firstname = $2, interested = $3, country = $4, gender = $5, bio = $6 WHERE user_id = $7';
        const values = [lastname, firstname, interested, country, gender, bio, userID]
        await pool.query(text, values);
        return res.status(200).json({ save: true });
       } catch (error) {
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
        // INTEREST ALREADY EXIST?
        let id_interest = null;
        let text = 'SELECT * FROM interests WHERE interest = $1';
        let values = [interest];
        let response = await pool.query(text, values);
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

exports.login = login;
exports.signup = signup;
exports.getEditProfilValues = getEditProfilValues;
exports.updateEditProfilValues = updateEditProfilValues;
exports.addInterests = addInterests;
exports.getInterests = getInterests;