const User = require("../../schema/schemaUser.js");
const Profil = require("../../schema/schemaProfil.js");
const passwordHash = require("password-hash");

async function signup(req, res) {
    const { password, email, cpassword } = req.body;
    if (!email || !password || !cpassword) {
        return res.status(200).json({
            text: ["Invalid request"]
        });
    }
    if (cpassword !== password){
        return res.status(200).json({
            text: ["Passwords does not match"]
        });
    }
    const user = {
        email,
        password: passwordHash.generate(password),
    };
    const profil = {
        email,
        lastName: "",
        firstName: "",
        gender: "",
        bio: "",
        country: "",
        interested:  "",
        birthday: "",
        interests: []
    }
    try {
        const findUser = await User.findOne({
            email
        });
        if (findUser) {
            return res.status(400).json({
                text: ["User already exist"]
            });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
    try {
        // Sauvegarde de l'utilisateur en base
        const userData = new User(user);
        const userProfil = new Profil(profil);
        await userProfil.save();
        const userObject = await userData.save();
        return res.status(200).json({
            text: ["Success"],
            token: userObject.getToken(),
            newUser: true
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
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
        const findProfil = await Profil.findOne(req.email);
        if (!findProfil) {
            return res.status(500).json({
                warnings: ["Not Found"]
            });
        } else
            return res.status(200).json({
                findProfil: findProfil
            })
    } catch (error) {
        return res.status(500).json({
            warnings: ["Catch error"]
        });
    }
}

async function updateEditProfilValues(req, res) {
    await Profil.findOneAndUpdate(req.body.state.email, req.body.state, function(err, doc) {
        if (err) {
            return res.status(500).json({
                wanings: ["Invalid request"]
            });
        }
        else
            return res.status(200).json({
                warnings: ["Saved"],
                save: true
            });
    });
}


exports.login = login;
exports.signup = signup;
exports.checkMail = checkMail;
exports.getEditProfilValues = getEditProfilValues;
exports.updateEditProfilValues = updateEditProfilValues;