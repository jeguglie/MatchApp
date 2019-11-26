const account = require('./account/lib.js');
const addphotos = require('./account/addphotos.js');
const multer = require('multer');
const withAuth = require('../middleware');
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
    app.get('/checkToken', withAuth, function(req, res) {
        res.sendStatus(200);
    });
    app.post('/login', account.login);
    app.post('/signup', account.signup);
    app.post('/getEditProfilValues', withAuth, account.getEditProfilValues);
    app.post('/updateEditProfilValues', withAuth, account.updateEditProfilValues);
    app.post('/user-profile', withAuth, upload.single('file'), addphotos.uploadPhoto);
    app.post('/getPhotos', withAuth, addphotos.getPhotos);
};