const account = require('./account/lib.js');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

module.exports = function (app) {
    app.post('/login', account.login);
    app.post('/signup',account.signup);
    app.post('/checkMail', account.checkMail);
    app.post('/getEditProfilValues', account.getEditProfilValues);
    app.post('/updateEditProfilValues', account.updateEditProfilValues);
    app.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
        const Profil = require('../schema/schemaProfil');
        try {
            const id = req.body.id;
            const profileImgTab = [];
            const addPathImg = req.file.path;
            Profil.findOne({_id: id}, function(err, out) {
                if (err)
                    return res.status(500).json({
                        warnings: ["Error find Profile"]
                    });
                const profileImgTab = out.profileImg;
                profileImgTab.push(addPathImg);
                out.profilImg = profileImgTab;
                out.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            warnings: ["Error during save"]
                        });
                    }
                    return res.status(200).json({
                        warnings: ["Image saved"],
                        profileImgTab: profileImgTab
                    })
                });
            });
        } catch (error) {
            return res.status(500).json({
                warnings: ["Catch error"]
            });
        }
    });
};