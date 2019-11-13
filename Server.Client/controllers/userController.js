const account = require('./account/lib.js');
const addphotos = require('./account/addphotos.js');
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
            return false;
        }
    }
});

module.exports = function (app) {
    app.post('/login', account.login);
    app.post('/signup',account.signup);
    app.post('/checkMail', account.checkMail);
    app.post('/getEditProfilValues', account.getEditProfilValues);
    app.post('/updateEditProfilValues', account.updateEditProfilValues);
    app.post('/user-profile', upload.single('imagesFiles'), addphotos.uploadPhoto);
    app.post('/getPhotos', addphotos.getPhotos);
};