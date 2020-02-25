const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const pool = require('./../utils/queries');
const validate = require('../utils/validation');
const crypto = require('crypto');
const notifications = require('./../controllers/notifications');
const account = require('./../controllers/lib');
const axios = require("axios");
const mailjet = require ('node-mailjet').connect(process.env.MAIL_KEY, process.env.MAIL_SECRET);
const secret = process.env.SECRET_KEY;
require('dotenv').config({path: __dirname + '/.env'});

async function getNameUserId(userID){
    try {
        let text = 'SELECT firstname FROM profile WHERE user_id = $1';
        let value = [userID];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return response.rows[0].firstname;
        else
            return "";
    }catch (e){
        return "";
    }

}

async function getUserId(email){
    let text = 'SELECT user_id FROM users WHERE email = $1';
    let values = [email];
    try {
        const response = await pool.query(text, values);
        return response.rows.length ? response.rows[0].user_id : null;
    } catch (error) {
        return null;
    }
    return null;
}

async function getNotifications(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    let notifications = [];
    try {
        let text = 'SELECT * FROM notifications N INNER JOIN profile P ON N.user_id_emitter = P.user_id INNER JOIN pictures PI ON PI.user_id = P.user_id WHERE N.user_id_notified = $1 AND img_order = $2 ORDER BY N.date DESC';
        let value = [userID, 0];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
           response.rows.map(obj => {
               let object = new Object();
               Object.assign(object, {type: obj.type});
               Object.assign(object, {user_id: obj.user_id_emitter});
               Object.assign(object, {date: obj.date});
               Object.assign(object, {img_link: obj.img_link});
               Object.assign(object, {firstname: obj.firstname});
               Object.assign(object, {notif_id: obj.id_notif});
               notifications.push(object);
           })
        }
        return res.status(200).json({notifications: notifications});
    }catch(e){
        return res.status(400).json({
            warnings: ["Server error"]
        });
    }
}

async function getNotifNb(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    try {
        let text = 'SELECT * FROM notifications N INNER JOIN profile P ON N.user_id_emitter = P.user_id INNER JOIN pictures PI ON PI.user_id = P.user_id WHERE N.user_id_notified = $1 AND img_order = $2';
        let value = [userID, 0];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return res.status(200).json({notifNb: response.rows.length});
        else
            return res.status(200).json({notifNb: 0});

    }catch(e){
        return res.status(400).json({
            warnings: ["Server error"]
        });
    }
}
async function reportuserhide(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    const {user_id_reported} = req.body;
    try {
        let text = 'SELECT * FROM user_hide WHERE user_id = $1 AND user_id_reported = $2';
        let values = [userID, user_id_reported];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return res.status(200).json({});
        else {
            text = 'INSERT INTO user_hide(user_id, user_id_reported) VALUES ($1, $2)';
            values = [userID, user_id_reported];
            await pool.query(text, values);
        }
        return res.status(200).json({});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({
            warnings: ["Server error"]
        });
    }
}

async function reportuser(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    const {user_id_reported} = req.body;
    try {
        let text = 'SELECT * FROM user_report WHERE user_id = $1 AND user_id_reported = $2';
        let values = [userID, user_id_reported];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return res.status(200).json({});
        else {
            text = 'INSERT INTO user_report(user_id, user_id_reported) VALUES ($1, $2)';
            values = [userID, user_id_reported];
            await pool.query(text, values);
        }
        return res.status(200).json({});
    }
    catch(e){
        return res.status(400).json({
            warnings: ["Server error"]
        });
    }
}

async function reportuserfake(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    const {user_id_reported} = req.body;
    try {
        let text = 'SELECT * FROM user_fake WHERE user_id = $1 AND user_id_reported = $2';
        let values = [userID, user_id_reported];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return res.status(200).json({});
        else {
            text = 'INSERT INTO user_fake(user_id, user_id_reported) VALUES ($1, $2)';
            values = [userID, user_id_reported];
            await pool.query(text, values);
        }
        return res.status(200).json({});
    }
    catch(e){
        return res.status(400).json({
            warnings: ["Server error"]
        });
    }
}
async function updatetotalcomplete(userID){
    try {
        let text = 'SELECT * FROM user_complete WHERE user_id = $1';
        let value = [userID];
        let response = await pool.query(text, value);
        let complete = 0;
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
                complete =  response.rows[0].complete_basics + response.rows[0].complete_photos + response.rows[0].complete_interets;
                text = 'UPDATE users SET complete = $1 WHERE user_id = $2';
                value = [complete, userID];
                await pool.query(text, value);
        }
        return;
    }catch (e){
        console.log(e);
        return;
    }
}

async function updatetotalinterests(userID){
    try {
        let text = 'SELECT * FROM user_interests WHERE user_id = $1';
        let value = [userID];
        let response = await pool.query(text, value);
        let number = 0;
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            if (response.rows.length > 29)
                number = 30;
            else
                number = response.rows.length;
        text = 'UPDATE user_complete SET complete_interets = $1 WHERE user_id = $2';
        value = [number, userID];
        await pool.query(text, value);
        updatetotalcomplete(userID);
        return (1);

    }catch (e){
        return (0);
    }
}

async function deletenotif(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    try {
        let id_notif = req.body.id_notif;
        let text = 'SELECT * FROM notifications WHERE user_id_notified = $1 AND id_notif = $2';
        let values = [userID, id_notif];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
            let text = 'DELETE FROM notifications WHERE user_id_notified = $1 AND id_notif = $2';
            let values = [userID, id_notif];
            await pool.query(text, values);
        }
        return res.status(200).json({});

    }catch (e){
        console.log(e);
        return res.status(400).json({warnings: ["Server error"]});
    }
}

async function updategeolocate(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    const { latitude, longitude } = req.body;
    const regex = new RegExp('^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$');
    if (regex.test(latitude) || regex.test(longitude))
        return res.status(400).json({});
    try {
        let text = 'UPDATE profile SET latitude = $1, longitude = $2, geolocate = $3 WHERE user_id = $4';
        let values = [latitude, longitude, 1, userID];
        await pool.query(text, values);
        return res.status(200).json({});
    } catch(e) {
        return res.status(400).json({});
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
        return res.status(400).json({
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
            return res.status(400).json({
                warnings: warnings
            });
        // Create User
        // Create mail token
        let token = ((+new Date) + Math.random()* 100).toString(32);
        let hashtoken = crypto.createHash('md5').update(token).digest("hex");
        text = 'INSERT INTO users(email, username, password, tokenmail) VALUES($1, $2, $3, $4)';
        values = [email, username, passwordHash.generate(password), hashtoken];
        await pool.query(text, values);
        // Get user_id
        const userID = await getUserId(email);
        // Create Profil
        text = 'INSERT INTO profile(user_id, lastName, firstName, likes, geolocate, usecustomaddress, interested) VALUES($1, $2, $3, $4, $5, $6, $7)';
        values = [userID, lastname, firstname, 0, 0, 0, 'other'];
        await pool.query(text, values);
        // Insert Complete
        text = 'INSERT INTO user_complete(complete_basics, user_id) VALUES($1, $2)';
        values = [10, userID];
        await pool.query(text, values);
        // Send mail activation
        const request = mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[
                    {
                        "From": {
                            "Email": "jeguglie@student.42.fr",
                            "Name": "MatchApp"
                        },
                        "To": [{"Email": email,}],
                        "Subject": "Activate your account",
                        "HTMLPart": `Hello !\nHere is the link to confirm your account ${process.env.SERVER_LOCALHOST === JSON.stringify(false) ? 'https://matchappli.herokuapp.com/login/' : 'http://localhost:5000/login/'}`+hashtoken,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            });
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            });


        return res.status(200).json({});

    } catch (error) {
        warnings.warnings.push("Catch error");
        return res.status(400).json({ warnings });
    }
}

async function activeaccount(req, res){
    const { token } = req.body;
    try {
        if (token && token.length) {
            let text = 'SELECT * FROM users WHERE tokenmail = $1';
            let value = [token];
            let response = await pool.query(text, value);
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length && response.rows[0].tokenmail === token) {
                text = 'UPDATE users SET tokenmail = NULL, active = 1';
                await pool.query(text);
                res.status(200).json({});
            } else
                res.status(400).json({});
        }
    }
    catch (e){
        return res.status(400).json({});
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
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
            if (response.rows[0].active === 0) {
                let text = 'UPDATE users SET tokenmail = $1 WHERE email = $2';
                let token = ((+new Date) + Math.random()* 100).toString(32);
                let hashtoken = crypto.createHash('md5').update(token).digest("hex");
                let values = [hashtoken, email];
                const request = mailjet
                    .post("send", {'version': 'v3.1'})
                    .request({
                        "Messages":[
                            {
                                "From": {
                                    "Email": "jeguglie@student.42.fr",
                                    "Name": "MatchApp"
                                },
                                "To": [{"Email": email,}],
                                "Subject": "Activate your account",
                                "HTMLPart": `Hello !\nHere is the link to confirm your account ${process.env.SERVER_LOCALHOST === JSON.stringify(false) ? 'https://matchappli.herokuapp.com/login/' : 'http://localhost:3000/login/'}`+hashtoken,
                                "CustomID": "AppGettingStartedTest"
                            }
                        ]
                    });
                request
                    .then((result) => {
                        console.log(result.body)
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                    });
                pool.query(text, values);
                return res.status(400).json({
                    w_emailconfirm: true,
                });
            }
            if (!passwordHash.verify(password, response.rows[0].password))
                return res.status(400).json({
                    w_email: "Wrong email or password"
                });
            const payload = { email };
            const token = jwt.sign(payload, secret);
            if (process.env.SERVER_LOCALHOST === JSON.stringify(true))
                res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, domain:'localhost', secure: false, sameSite: true, httpOnly: false});
            else
                res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, sameSite: 'none', secure: true, httpOnly: false});
            await account.setUserLastConnection(response.rows[0].user_id, 1);
            await setLocationIP(response.rows[0].user_id, req.connection.remoteAddress);
            return res.status(200).json({connect: true});
        }
        else {
                return res.status(400).json({
                    w_email: "Wrong email or password"
                });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            warnings: ['An error occured with server']
        });
    }
}

async function getEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    // Get Profile and User complete values
    let text = 'SELECT * FROM profile WHERE user_id = $1';
    let values = [userID];
    try {
        const response = await pool.query(text, values);
        if (typeof response != 'undefined' && typeof response.rows != 'undefined' && response.rows.length < 1)
            return res.status(400).json({ warnings: ["Profile not found, please logout and login"]});
        else if (typeof response != 'undefined' && typeof response.rows != 'undefined' && response.rows.length) {
            response.rows[0].email = res.locals.email;
            response.rows[0].age =  response.rows[0].age ? response.rows[0].age.toString() : null;
            return res.status(200).json({ findProfil: response.rows[0] })
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            warnings: ["Error during query"]
        });
    }
}

async function changemyemail(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["User not found. Please logout and login."]
        }));
    const {email, emailconfirm } = req.body;
    const warnings = {
        w_email: '',
        w_emailconfirm: '',
        warnings: [],
    };
    let errors = false;
    // VALIDATION
    if (!validate.validateEmail(email))
        warnings.w_email = "Must be a valid email";
    if (!validate.validateEmail(emailconfirm))
        warnings.w_emailconfirm = "Must be a valid email";
    if (email.localeCompare(email) !== 0)
        warnings.w_emailconfirm = "Emails does not match.";
    if (Object.values(warnings).map((data) => {
        if (data.length > 0)
            errors = true;
    }))
    if (errors === true)
        return res.status(400).json({
            warnings: warnings
        });
    try {
        let text = 'UPDATE users SET email = $1 WHERE user_id = $2';
        let value = [email, userID];
        await pool.query(text, value);
        res.clearCookie('token');
        return res.status(200).json({})
    }
    catch (e){
        console.log(e);
        return res.status(400).json({
            warnings: "Error. Please restart your session."
        })
    }
}

async function changepassword(req, res){
    const {token, password, passwordconfirm } = req.body;
    const warnings = {
        w_password: '',
        w_cpassword: '',
        warnings: [],
    };
    let errors = false;
    // VALIDATION
    if (!validate.validatePassword(password))
        warnings.w_password = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.";
    if (passwordconfirm.localeCompare(password) !== 0)
        warnings.w_cpassword = "Password does not match.";
    if (Object.values(warnings).map((data) => {
        if (data.length > 0)
            errors = true;
    }))
    if (errors === true)
        return res.status(400).json({
            warnings: warnings
        });
    let hashpassword = passwordHash.generate(password);
    try {
        let text = 'SELECT * FROM users WHERE tokenmail = $1';
        let value = [token];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
            if (response.rows[0].tokenmail === token) {
                let text = 'UPDATE users SET password = $1, tokenmail = $2';
                let value = [hashpassword, null];
                await pool.query(text, value);
                return res.status(200).json({})
            }
        }
        else {
            const token = req.cookies.token;
            if (!token) {
                return res.status(400).json({
                    warnings: "Token is invalid"
                })
            } else {
                let connected = { bool: false, mail : '' };
                jwt.verify(token, secret, function(err, decoded) {
                    if (!err) {
                        connected.bool = true;
                        connected.mail = decoded.email;
                    }
                });
                if (connected.bool === true && connected.mail.length) {
                    text = 'UPDATE users SET password = $1 WHERE email = $2';
                    value = [hashpassword, connected.mail];
                    await pool.query(text, value);
                    return res.status(200).json({})
                }
            }
            return res.status(400).json({
                warnings: "Token is invalid"
            })
        }
    }
    catch (e){
        console.log(e);
        return res.status(400).json({
            warnings: "Token is invalid"
        })
    }
}

async function userforgot(req, res){
    const { email } = req.body;
    let text = 'SELECT * FROM users WHERE email = $1 AND active = $2 OR active = $3';
    let value = [email, 1, 0];
    let response = await pool.query(text, value);
    if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
        let text = 'UPDATE users SET tokenmail = $1 WHERE email = $2';
        let token = ((+new Date) + Math.random()* 100).toString(32);
        let hashtoken = crypto.createHash('md5').update(token).digest("hex");
        let values = [hashtoken, email];
        const request = mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[
                    {
                        "From": {
                            "Email": "jeguglie@student.42.fr",
                            "Name": "MatchApp"
                        },
                        "To": [{"Email": email,}],
                        "Subject": "Forgot Password",
                        "HTMLPart": `Hello !\nHere is the link to reset your password ${process.env.SERVER_LOCALHOST === JSON.stringify(false) ? 'https://matchappli.herokuapp.com/forgotpassword/' : 'http://localhost:5000/forgotpassword/'}`+hashtoken,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            });
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            });
        pool.query(text, values);
        res.status(200).json({
            success: "A password reset email has just been sent",
        })
    }
    else {
        return (res.status(400).json({
            warnings: "Mail does not exist",
        }))
    }


}

async function updateEditProfilValues(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["User not found. Please logout and login."]
        }));
    const {lastname, firstname, interested, age, country, gender, bio} = req.body.state;

    // Check DATA -------------------------------------------------------
    let valid = true;
    let find = false;
    let findage = false;
    let total = 25;
    if (!validate.validateFirstName(lastname) || !validate.validateFirstName(firstname))
        valid = false;
    if (interested !== 'homosexual' && interested !== 'heterosexual' && interested !== 'bisexual')
        valid = false;
    if (gender !== 'male' && gender !== 'female')
        valid = false;
    validate.countries.map((data) => {
        if (data.value === country)
            return find = true
    });
    validate.age.map((data) => {
        if (data.value === age)
            return findage = true
    });
    if ((typeof bio !== 'undefined' && bio) && (bio.length < 3 && bio.length > 90))
        valid = true;
    if (!find || !findage || !valid)
        return (res.status(400)).json({
            warnings: ["Wrong input was sent. Please send valid data."]
        });
    try {
        // Save DATA -------------------------------------------------------
        let text = 'UPDATE profile SET lastname = $1, firstname = $2, interested = $3, country = $4, gender = $5, bio = $6, age = $7 WHERE user_id = $8';
        let values = [lastname, firstname, interested, country, gender, bio, parseInt(age), userID]
        await pool.query(text, values);

        // Set Complete
        if (typeof bio !== 'undefined' && bio && bio.length > 0)
            total += 5;
        text = 'UPDATE user_complete SET complete_basics = $1 WHERE user_id = $2';
        values = [total, userID];
        await pool.query(text, values);

        // Send complete for increase bar
        await updatetotalcomplete(userID);
        return res.status(200).json({
            complete: total
        });
       } catch (error) {
            return res.status(400).json({
                warnings: ["Error during the save of your profile"]
            });
    }
}

async function addInterests(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400));
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
        return res.status(400).json({
            warnings: warnings
        });
    try {
        // Check user limit
        let text = 'SELECT * FROM user_interests WHERE user_id = $1';
        let values = [userID]
        let response = await pool.query(text, values);
        // If user reach 30
        if (response.rows.length >= 30)
            return res.status(400).json({
                warnings: ["Limit of 30 interests per profile"]
            })
        // Check if already exist in user_interests database
        text = 'SELECT interest FROM interests I INNER JOIN user_interests U ON I.id = U.interest_id WHERE U.user_id = $1 AND I.interest = $2';
        values = [userID, interest]
        response = await pool.query(text, values);
        if (response.rows.length > 0){
            return res.status(400).json({
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
            await updatetotalinterests(userID);
            return res.status(200).json({
                warnings: ["Your interest \""+interest+"\" was successfully added"]
            });
        }
        return res.status(400).json({
            warnings: ["Error when trying to get interest ID"]
        });
    } catch (error) {
        return res.status(400).json({
            warnings: ["Server error"]
        });
    }
}


async function getInterests(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400));
    try {
        let text = 'SELECT interest FROM interests';
        let response = await pool.query(text);
        if (response.rows && response.rows.length > 1) {
            const transformed = response.rows.map(({ interest}) => ({ "title": interest.trim()}));
            await updatetotalinterests(userID);
            return res.status(200).json({
                results: transformed,
            });
        }
        else
            return res.status(200).json({
                results: [],
            });
    } catch(error) {
        return res.status(400).json({
            warnings: ["Catch error"]
        });
    }
}

async function getUserInterests(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
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
        return res.status(400).json({
            warnings: ["Catch error"]
        });
    }
}

async function setLocationIP(userID, ip){
    try {
        let {latitude, longitude } = '';
        await axios.get('http://api.ipstack.com/' + ip + '?access_key=56f2d2b39863d9f40bfac1b5a752fa67')
            .then (response => {
                if (response.status === 200) {
                    latitude = response.data.latitude;
                    longitude = response.data.longitude;
                }
            });
        // const regex = new RegExp('^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$');
        // if (regex.test(latitude) || regex.test(longitude))
        //     return false;
        try {
            let text = 'UPDATE profile SET latitude = $1, longitude = $2, geolocate = $3 WHERE user_id = $4';
            let values = [latitude, longitude, 1, userID];
            await pool.query(text, values);
            return true;
        } catch(e) {
            return false;
        }
    }catch(e){

    }
}
async function getComplete(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400));
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
            return res.status(400).json({});
    } catch (error) {
        return res.status(400).json({});
    }
}

async function deleteInterest(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
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
            await updatetotalinterests(userID);
            return res.status(200).json({
                warnings: ["Your interest \""+data+"\" was successfully removed"]
            });
        }
        else
            return res.status(400).json({
                warnings: ["You are not allowed to delete this interest"]
            });
    } catch (error) {
        return res.status(400).json({
            warnings: ["Catch error"]
        });
    }
}

async function getConnectedUserLocation(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
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
        return res.status(400).json({
            warnings: ["Catch error"]
        });
    }
}

async function checkUserView(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
        let text = 'SELECT complete FROM users WHERE user_id = $1';
        let value = [userID];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            if (response.rows[0].complete >= 38){
                text = 'SELECT * FROM pictures WHERE user_id = $1';
                response = await pool.query(text, [userID]);
                if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
                    return res.status(200).json({});
                }
            }
        return res.status(400).json({
            warnings: ["Your need to complete your profile"]
        })

    } catch (error) {
        return res.status(400).json({
            warnings: ["Catch error"]
        });
    }
}

async function getUserIdProfile(req, res) {
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    let liked = false;

    try {
        let userIDprofile = req.body.userId;
        let text = 'SELECT * FROM profile WHERE user_id = $1';
        let values = [userIDprofile];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
            text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
            values = [userID, userIDprofile];
            let responselike = await pool.query(text, values);
            if (await notifications.usercansendnotif(userID, userIDprofile))
                await notifications.pushnotifications(userIDprofile, userID, 1);
            if (typeof responselike !== 'undefined' && typeof responselike.rows !== 'undefined' && responselike.rows.length)
                liked = true;
            let user = response.rows[0];
            // Get user interests IDs
            text = 'SELECT interest_id FROM user_interests WHERE user_id = $1';
            values = [userIDprofile];
            response = await pool.query(text, values);
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
                let intereststab = [];
                let interestsIDtab = response.rows;
                // Add interests to tab
                for (let i = 0; i < interestsIDtab.length; i++) {
                    text = 'SELECT interest FROM interests WHERE id = $1';
                    values = [interestsIDtab[i].interest_id];
                    response = await pool.query(text, values);
                    if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
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
                Object.assign(user, {liked: liked});
                // Get user like already your profile
                let like = false;
                text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
                values = [userIDprofile, userID];
                response = await pool.query(text, values);
                if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
                    like = true;
                return res.status(200).json({
                    user: user,
                    like: like,
                });
            }
            return res.status(400).json('Bad Request');
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            warnings: ["Catch error"]
        });
    }
}
    async function setUserLastConnection(userID, connected){
        try {
            let text = 'UPDATE profile SET last_date_online = $1, online = $2 WHERE user_id = $3';
            let value = [new Date(), connected, userID];
            await pool.query(text, value);
            return true;
        }catch (e){
            console.log(e);
            return false;
        }
}

async function getMatchedUsers(req, res){
    const userID = await getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
       let matchedusers = [];
       let text = 'SELECT * FROM matchedusers M INNER JOIN pictures PIC ON PIC.user_id = M.user_id INNER JOIN profile P ON P.user_id = M.user_id WHERE M.user_id2 = $1 AND PIC.img_order = 0';
       let text2 = 'SELECT * FROM matchedusers M INNER JOIN pictures PIC ON PIC.user_id = M.user_id2 INNER JOIN profile P ON P.user_id = M.user_id2 WHERE M.user_id = $1 AND PIC.img_order = 0';
       let response = await pool.query(text, [userID]);
       let response2 = await pool.query(text2, [userID]);
       if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
            response.rows.map(obj => {
                matchedusers.push(obj);
            });
        }
        if (typeof response2 !== 'undefined' && typeof response2.rows !== 'undefined' && response2.rows.length){
            response2.rows.map(obj => {
                matchedusers.push(obj);
            });
        }
        return res.status(200).json({
            matchedusers: matchedusers
        })
    } catch(e){
        console.log(e);
        return res.status(400).json({});
    }
}


// Notifications
exports.getNotifications = getNotifications;
exports.getNotifNb = getNotifNb;
exports.deletenotif = deletenotif;
// Profile
exports.getUserId = getUserId;
exports.getEditProfilValues = getEditProfilValues;
exports.addInterests = addInterests;
exports.getComplete = getComplete;
exports.changepassword = changepassword;
exports.changemyemail = changemyemail;
exports.getInterests = getInterests;
exports.deleteInterest = deleteInterest;
exports.updategeolocate = updategeolocate;
// Wall
exports.updateEditProfilValues = updateEditProfilValues;
exports.checkUserView = checkUserView;
exports.getConnectedUserLocation = getConnectedUserLocation;
exports.setUserLastConnection = setUserLastConnection;
exports.updatetotalcomplete = updatetotalcomplete;
exports.getUserIdProfile = getUserIdProfile;
exports.getUserInterests = getUserInterests;
exports.reportuserhide = reportuserhide;
exports.reportuser = reportuser;
exports.reportuserfake = reportuserfake;
exports.activeaccount= activeaccount;
// Chat
exports.getMatchedUsers = getMatchedUsers;
// Notifications
exports.getNameUserId = getNameUserId;
// Log in / Sign up  / Forgot
exports.login = login;
exports.signup = signup;
exports.userforgot = userforgot;

