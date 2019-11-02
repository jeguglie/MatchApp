const User = require("../../schema/schemaUser.js");
const Profil = require("../../schema/schemaProfil.js");
const passwordHash = require("password-hash");

async function signup(req, res) {
    const { password, email, cpassword } = req.body;
    if (!email || !password || !cpassword) {
        return res.status(200).json({
            text: "Requête invalide"
        });
    }
    if (cpassword !== password){
        return res.status(200).json({
            text: "Passwords does not match"
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
        country: "",
        interested:  "",
        birthday: "",
        interests: []
    }
    // On check en base si l'utilisateur existe déjà
    try {
        const findUser = await User.findOne({
            email
        });
        if (findUser) {
            return res.status(400).json({
                text: "User already exist"
            });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
    try {
        // Sauvegarde de l'utilisateur en base
        const userData = new User(user);
        const userProfil = new Profil(profil)
        await userProfil.save();
        const userObject = await userData.save();
        return res.status(200).json({
            text: "Success",
            token: userObject.getToken()
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

async function login(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    try {
        // On check si l'utilisateur existe en base
        const findUser = await User.findOne({email});
            if (!findUser) {
            return res.status(200).json({
                text: ["User does not exist."]
            });
        }
        if (!findUser.authenticate(password))
            return res.status(200).json({
                text: ["Mot de passe incorrect"]
            });
        localStorage.setItem('email', email);
        return res.status(200).json({
            token: findUser.getToken(),
            newUser: findUser.newUser,
            text: ["Authentification reussie"]
        });
    } catch (error) {
        return res.status(500).json({
            error
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
    const {email} = req.body;
    const findProfil = Profil.findOne({email}, req.body, function(err, doc){
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            else
                return res.status(200).json({
                    findProfil
                })
    });
}

async function updateProfilValues(req, res) {
    await Profil.findOneAndUpdate(req.body.email, req.body, function(err, doc) {
        if (err) {
            return res.status(500).json({
                wanings: ["Error save"]
            });
        }
        else
            return res.status(200).json({
                warnings: [],
                save: true
            });
    });
}



//On exporte nos deux fonctions

exports.login = login;
exports.signup = signup;
exports.checkMail = checkMail;
exports.getEditProfilValues = getEditProfilValues;
exports.updateProfilValues = updateProfilValues;