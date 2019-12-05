const express = require("express");
const bodyParser = require("body-parser");
const uuid = require('uuid/v4');
const cookieParser = require('cookie-parser');
const app = express();
const account = require('./controllers/account/lib.js');
const addphotos = require('./controllers/account/addphotos.js');
const multer = require('multer');
const DIR = './public/';
const withAuth = require('./middleware');
const cors = require('cors');

// Multer file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid() + '-' + fileName)
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
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));


// Check Token
app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});
// route for user logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200);

});

app.post('/login', account.login);
app.post('/signup', account.signup);
app.post('/getEditProfilValues', withAuth, account.getEditProfilValues);
app.post('/updateEditProfilValues', withAuth, account.updateEditProfilValues);
app.post('/user-profile', upload.single('file'), withAuth, addphotos.uploadPhoto);
app.post('/getPhotos', withAuth, addphotos.getPhotos);
app.post('/addInterests', withAuth, account.addInterests);
app.post('/getInterests', withAuth, account.getInterests);
app.post('/getUserInterests', withAuth, account.getUserInterests);


const port = 3000;
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));