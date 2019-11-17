const passwordHash = require("password-hash");
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'jeguglie',
    host: 'localhost',
    database: 'api',
    password: '06245547Jv345102.',
    port: 5432,
});


async function signup(req, res) {
    const { password, email, username, cpassword } = req.body;
    if (!email || !password || !cpassword)
        return res.status(200).json({
            text: ["Invalid request"]
        });
    if (cpassword !== password)
        return res.status(200).json({
            text: ["Passwords does not match"]
        });
    const text = 'SELECT email, username FROM users WHERE email = $1 OR username = $2';
    const values = [email, username];
    try {
        const warnings = [];
        const response = await pool.query(text, values);
        if (response.rows && response.rows.length > 0 && response.rows[0].email === email)
            warnings.push('Email already exist');
        if (response.rows && response.rows.length > 0 && response.rows[0].username === username)
            warnings.push('Username already exist');
        if (warnings.length > 0)
            return res.status(200).json({
                warnings: warnings
            })
    } catch (error) {
        return res.status(500).json({
            warnings: ['Catch error']
        });
    }
    // Create User
    if (!res.rows){
        const text = 'INSERT INTO users(email, username, password) VALUES($1, $2, $3)';
        const values = [email, username, passwordHash.generate(password)];
        try {
            await pool.query(text, values);
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    // Create Profil
    // try {
    //     const userData = new User(user);
    //     const profil = {
    //         _id: userData._id,
    //         email,
    //         lastName: "",
    //         firstName: "",
    //         gender: "",
    //         bio: "",
    //         country: "",
    //         interested:  "",
    //         birthday: "",
    //         interests: []
    //     };
    //     const userProfil = new Profil(profil);
    //     await userProfil.save();
    //     const userObject = await userData.save();
    //     return res.status(200).json({
    //         text: ["Success"],
    //         token: userObject.getToken(),
    //         _id: userObject._id,
    //         newUser: true
    //     });
    // } catch (error) {
    //     console.log("2 " + error);
    //     return res.status(500).json({ error });
    // }
}

async function login(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            text: "Invalid request"
        });
    }
    try {
        const findUser = await User.findOne({email});
        if (!findUser) {
            return res.status(200).json({
                text: ["User doesn't exist"]
            });
        }
        if (!findUser.authenticate(password)) {
            return res.status(200).json({
                text: ["Incorrect password"]
            });
        }
        return res.status(200).json({
            token: findUser.getToken(),
            newUser: findUser.newUser,
            id: findUser._id,
            text: ["Authentification reussie"]
        });
    }
    catch (error) {
        return res.status(500).json({
            error: req.body
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
    try {
        const findProfil = await Profil.findById(req.body.id);
        if (!findProfil) {
            return res.status(500).json({
                warnings: ["Not Found"]
            });
        } else
            return res.status(200).json({
                findProfil: findProfil
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            warnings: [""]
        });
    }
}

async function updateEditProfilValues(req, res) {
    try {
        await Profil.findByIdAndUpdate({_id: req.body.id}, req.body.state, {new: true});
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




// exports.login = login;
exports.signup = signup;
// exports.checkMail = checkMail;
// exports.getEditProfilValues = getEditProfilValues;
// exports.updateEditProfilValues = updateEditProfilValues;