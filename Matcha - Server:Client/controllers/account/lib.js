const User = require("../../schema/schemaUser.js");
const Profil = require("../../schema/schemaProfil.js");
const passwordHash = require("password-hash");
const mongoose = require('mongoose');

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
        console.log(error);
        return res.status(500).json({ error });
    }
    try {
        const userData = new User(user);
        const profil = {
            _id: userData._id,
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
        const userProfil = new Profil(profil);
        await userProfil.save();
        const userObject = await userData.save();
        return res.status(200).json({
            text: ["Success"],
            token: userObject.getToken(),
            _id: userObject._id,
            newUser: true
        });
    } catch (error) {
        console.log("2 " + error);
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
    console.log(req.body);
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
        console.log(req.body);
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


exports.login = login;
exports.signup = signup;
exports.checkMail = checkMail;
exports.getEditProfilValues = getEditProfilValues;
exports.updateEditProfilValues = updateEditProfilValues;