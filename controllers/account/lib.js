const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const pool = require('./../../utils/queries');
const validate = require('../../utils/validation');

async function getUserId(email){
    let text = 'SELECT user_id FROM users WHERE email = $1';
    let values = [email];
    try {
        const response = await pool.query(text, values);
        return response.rows.length ? response.rows[0].user_id : null;
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
    if (!validate.validateEmail(email))
       warnings.w_email = "Please enter a valid email.";
    if (!validate.validatePassword(password))
        warnings.w_password = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.";
    if (cpassword.localeCompare(password) !== 0)
        warnings.w_cpassword = "Password does not match.";
    if (!validate.validateUsername(username))
        warnings.w_username = "Please use a valid username.";
    if (!validate.validateFirstName(firstname))
        warnings.w_firstname = "Please use a valid first name.";
    if (!validate.validateFirstName(lastname))
        warnings.w_lastname = "Please use a valid last name.";
    if (Object.values(warnings).some(warning => warning.length))
        return res.status(409).json({
            warnings: warnings
        });
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
            });
        // Create User
        text = 'INSERT INTO users(email, username, password) VALUES($1, $2, $3)';
        values = [email, username, passwordHash.generate(password)];
        await pool.query(text, values);
        // Get user_id
        const userID = await getUserId(email);
        // Create Profil
        text = 'INSERT INTO profile(user_id, lastName, firstName, likes) VALUES($1, $2, $3, $4)';
        values = [userID, lastname, firstname, 0];
        await pool.query(text, values);
        // Insert Complete
        text = 'INSERT INTO user_complete(complete_basics, user_id) VALUES($1, $2)';
        values = [10, userID];
        await pool.query(text, values);
        const secret = 'mysecretsshhh';
        const payload = { email };
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h',
        });
        return res.status(200).json({});

    } catch (error) {
        warnings.warnings.push("Catch error");
        return res.status(500).json({ warnings });
    }
}

async function login(req, res) {
    const { password, email } = req.body;
    if (!email || !password)
        return res.status(400).json({ warnings: "Invalid request" });

    try {
        const text = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const response = await pool.query(text, values);
        if (!response.rows || response.rows.length < 1) {
            return res.status(401).json({
                w_email: "Wrong email or password"
            });
        }
        if (!passwordHash.verify(password, response.rows[0].password))
            return res.status(401).json({
                w_email: "Wrong email or password"
            });
        else {
            const secret = 'mysecretsshhh';
            const payload = { email };
            const token = jwt.sign(payload, secret, {
                expiresIn: '1h',
            });
            res.cookie('token', token, { httpOnly: true, path: '/', domain: 'localhost' });
            return res.status(200).json({connect: true});
        }
    }
    catch (error) {
        return res.status(500).json({
            warnings: ['An error occured with server']
        });
    }
}

async function getEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(500).json({
            warnings: ["User ID not found, please logout and login."]
        });
    // Get Profile and User complete values
    let text = 'SELECT * FROM profile WHERE user_id = $1';
    let values = [userID];
    try {
        const response = await pool.query(text, values);
        if (response.rows.length < 1)
            return res.status(500).json({ warnings: ["Profile not found, please logout and login"]});
        else {
            response.rows[0].email = res.locals.email;
            return res.status(200).json({ findProfil: response.rows[0] })
        }
    } catch (e) {
        return res.status(500).json({
            warnings: ["Error during query"]
        });
    }
}

async function updateEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["User not found. Please logout and login."]
        }));
    const {lastname, firstname, interested, country, gender, bio} = req.body.state;

    // Check DATA -------------------------------------------------------
    let valid = false;
    let find = false;
    let total = 25;
    if (!validate.validateFirstName(lastname) || !validate.validateFirstName(lastname) ||
        ((interested !== "male" && interested !== "female")) || ((gender !== "male" || gender !== "female")))
                valid = true;
    validate.countries.map((data) => {
        if (data.value === country)
            return find = true
    });
    if ((typeof bio !== 'undefined' && bio) && (bio.length < 3 && bio.length > 90))
        valid = false;
    if (!find || !valid)
        return (res.status(409)).json({
            warnings: ["Wrong input was sent. Please send valid data."]
        });
    try {
        // Save DATA -------------------------------------------------------
        let text = 'UPDATE profile SET lastname = $1, firstname = $2, interested = $3, country = $4, gender = $5, bio = $6 WHERE user_id = $7';
        let values = [lastname, firstname, interested, country, gender, bio, userID]
        await pool.query(text, values);

        // Set Complete
        if (typeof bio !== 'undefined' && bio && bio.length > 0)
            total += 5;
        text = 'UPDATE user_complete SET complete_basics = $1 WHERE user_id = $2';
        values = [total, userID];
        await pool.query(text, values);

        // Send complete for increase bar
        return res.status(200).json({
            complete: total
        });
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
    // Get interest
    const regex = new RegExp('/(^|\\B)#(?![0-9_]+\\b)([a-zA-Z0-9_]{1,30})(\\b|\\r)/g');
    const interest = req.body.interest.trim();
    // Check value
    let warnings = [];
    if (!interest  || interest .length < 2)
        warnings.push("Your interest must contain between 2 and 20 characters");
    if (regex.test(interest))
        warnings.push("Your interest is not valid. Only letter and numeric value is accepted");
    if (warnings.length > 0)
        return res.status(401).json({
            warnings: warnings
        });
    try {
        // Check user limit
        let text = 'SELECT * FROM user_interests WHERE user_id = $1';
        let values = [userID]
        let response = await pool.query(text, values);
        // If user reach 30
        if (response.rows.length >= 30)
            return res.status(401).json({
                warnings: ["Limit of 30 interests per profile"]
            })
        // Check if already exist in user_interests database
        text = 'SELECT interest FROM interests I INNER JOIN user_interests U ON I.id = U.interest_id WHERE U.user_id = $1 AND I.interest = $2';
        values = [userID, interest]
        response = await pool.query(text, values);
        if (response.rows.length > 0){
            return res.status(401).json({
                warnings: ["You already add this interest, try with other one"]
            })
        }
        // Check if exist in database
       text = 'SELECT interest FROM interests WHERE interest = $1';
       values = [interest]
       response = await pool.query(text, values);
       // If not exist in database, then create
       if (response.rows.length < 1){
           text = 'INSERT INTO interests(interest) VALUES ($1)';
           values = [interest]
           await pool.query(text, values);
       }
       // Get interest ID
        text = 'SELECT id FROM interests WHERE interest = $1';
        values = [interest]
        response = await pool.query(text, values);
        if (response.rows.length > 0) {
            let interestID = response.rows[0].id;
            // Insert interest in user_interests
            text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1, $2)';
            values = [userID, interestID];
            await pool.query(text, values);
            return res.status(200).json({
                warnings: ["Your interest \""+interest+"\" was successfully added"]
            });
        }
        return res.status(401).json({
            warnings: ["Error when trying to get interest ID"]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Server error"]
        });
    }
}


async function getInterests(req, res){
    try {
        let text = 'SELECT interest FROM interests';
        let response = await pool.query(text);
        if (response.rows && response.rows.length > 1) {
            const transformed = response.rows.map(({ interest}) => ({ "title": interest.trim()}));
            return res.status(200).json({
                results: transformed,
            });
        }
        else
            return res.status(200).json({
                results: [],
            });
    } catch(error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}

async function getUserInterests(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
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
            return res.status(200).json({
                interests: []
            });
    } catch (error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}

async function getComplete(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500));
    try {
        let text = 'SELECT * FROM user_complete WHERE user_id = $1';
        let values = [userID];
        let response = await pool.query(text, values);
        if (response.rows && response.rows[0]){
            return res.status(200).json({
                complete: response.rows[0].complete_basics + response.rows[0].complete_photos + response.rows[0].complete_interets,
            });
        }
        else
            return res.status(500).json({});
    } catch (error) {
        return res.status(500).json({});
    }
}

async function deleteInterest(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
        let data = req.body.data.trim();
        let text = 'SELECT interest_id FROM interests I INNER JOIN user_interests U ON U.interest_id = I.id WHERE U.user_id = $1 AND I.interest = $2';
        let values = [userID, data];
        let response = await pool.query(text, values);
        if (response.rows && response.rows[0]){
            text = 'DELETE FROM user_interests WHERE user_id = $1 AND interest_id = $2';
            values = [userID, response.rows[0].interest_id];
            await pool.query(text,values);
            return res.status(200).json({
                warnings: ["Your interest \""+data+"\" was successfully removed"]
            });
        }
        else
            return res.status(400).json({
                warnings: ["You are not allowed to delete this interest"]
            });
    } catch (error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}

async function getConnectedUserLocation(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
        let text = 'SELECT longitude, latitude FROM profile WHERE user_id = $1';
        let values = [userID];
        let response = await pool.query(text, values);
        if (typeof response != 'undefined' && typeof response.rows != 'undefined' && response.rows.length)
            return res.status(200).json({
                longitude: response.rows[0].longitude,
                latitude: response.rows[0].latitude
            });
        return res.status(400).json({
            warnings: ["You are not allowed"]
        })

    } catch (error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}

async function checkUserView(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
        let text = 'SELECT complete FROM users WHERE user_id = $1';
        let value = [userID];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            if (response.rows[0].complete >= 40)
                return res.status(200).json({});
        return res.status(400).json({
            warnings: ["Your need to complete your profile"]
        })

    } catch (error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}


async function getUserIdProfile(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
        let userIDprofile = req.body.userId;
        let text = 'SELECT * FROM profile WHERE user_id = $1';
        let values = [userIDprofile];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
            let user = response.rows[0];
            // Get user interests IDs
            text = 'SELECT interest_id FROM user_interests WHERE user_id = $1';
            values = [userIDprofile];
            response = await pool.query(text, values);
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
                let intereststab = [];
                let interestsIDtab = response.rows;
                // Add interests to tab
                for (let i = 0; i < interestsIDtab.length; i++){
                    text = 'SELECT interest FROM interests WHERE id = $1';
                    values = [interestsIDtab[i].interest_id];
                    response = await pool.query(text, values);
                    intereststab.push(response.rows[0].interest);
                }
                // Add interests tab to user
                Object.assign(user, {interests: intereststab});
                // Get user img
                text = 'SELECT img_link FROM pictures WHERE user_id = $1 ORDER BY img_order ASC';
                values = [userIDprofile];
                response = await pool.query(text, values);
                let imgtab = [];
                for (let i = 0; i < response.rows.length; i++)
                    imgtab.push(response.rows[i].img_link);
                // Add imgtab to user
                Object.assign(user, {imgs: imgtab});
                return res.status(200).json({
                    user: user
                });
            }
        }
    } catch (error) {
        console.log(error);
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
exports.getUserInterests = getUserInterests;
exports.getComplete = getComplete;
exports.deleteInterest = deleteInterest;
exports.getUserId = getUserId;
exports.getConnectedUserLocation = getConnectedUserLocation;
exports.checkUserView = checkUserView;
exports.getUserIdProfile = getUserIdProfile;