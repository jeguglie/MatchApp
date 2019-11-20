const jwt = require("jwt-simple");
const passwordHash = require("password-hash");
const {Pool} = require('pg');
const config = require("../../config/config");
const pool = new Pool({
    user: 'jv',
    host: 'localhost',
    database: 'api',
    password: '06245547Jv345102.',
    port: 5432,
});


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
            return res.status(200).json({
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
        response = await pool.query(text, values);

        return res.status(200).json({
            text: ["Success"],
            token: jwt.encode(response, config.secret),
            user_id: id,
            newUser: true
        });

    } catch (error) {
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
            return res.status(200).json({
               warnings: ['Wrong username or password']
            });
        return res.status(200).json({
            token: jwt.encode(response, config.secret),
            newUser: response.rows[0].newuser,
            user_id: response.rows[0].user_id
        });
    }
    catch (error) {
        return res.status(500).json({
            warnings: ['Catch error']
        });
    }
}

async function checkMail(req, res) {
    const {email} = req.body;
    try {
        const findUser = await User.findOne({email});
        if (!findUser) {
            return res.status(200).json({
                exist: false
            });
        } else
            return res.status(200).json({
                exist: true
            });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
}

async function getEditProfilValues(req, res) {
    const text = 'SELECT * FROM profile WHERE user_id = $1';
    const values = [req.body.user_id];
    try {
        const response = await pool.query(text, values);
        if (response.rows.length < 1) {
            return res.status(500).json({
                warnings: ["Not Found"]
            });
        } else
            return res.status(200).json({
                findProfil: response.rows[0]
            })
    } catch (error) {
        return res.status(500).json({
            warnings: [""]
        });
    }
}

async function updateEditProfilValues(req, res) {
    try {
        const text = 'UPDATE profile SET lastname = $1, firstname = $2, interested = $3, country = $4, gender = $5, bio = $6 WHERE user_id = $7';
        const values = Object.values(req.body.state);
        const sliceValues = values.slice(0, 7);
        pool.query(text, sliceValues);
        return res.status(200).json({
                warnings: ["Saved"],
                save: true
            });
       } catch (error) {
            return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}




exports.login = login;
exports.signup = signup;
// exports.checkMail = checkMail;
exports.getEditProfilValues = getEditProfilValues;
exports.updateEditProfilValues = updateEditProfilValues;