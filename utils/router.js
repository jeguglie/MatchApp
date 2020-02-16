const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware');
const withAuthAdmin = require('./admin');
const faker = require('./../controllers/faker');
const match = require('./../controllers/match');
const lib = require('./../controllers/lib.js');
const admin = require('./../controllers/admin.js');
const chat = require('./../controllers/chat.js');
const wall = require('./../controllers/wall.js');
const pictures = require('./../controllers/pictures.js');
const { Router } = require('express');
const router = Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());
router.use('/public', express.static('public'));
router.get('/faker', faker.matchAppFaker);
router.get('/checkToken', withAuth, (req, res) => {res.sendStatus(200)});
router.get('/checkTokenAdmin', withAuthAdmin, (req, res) => {res.sendStatus(200)});
router.post('/admin', withAuthAdmin, admin.dashboard);
router.post('/kickuser', withAuthAdmin, admin.kickuser);
router.post('/reportuserhide', withAuth, lib.reportuserhide);
router.post('/reportuserfake', withAuth, lib.reportuserfake);
router.post('/reportuser', withAuth, lib.reportuser);
router.post('/login', lib.login);
router.post('/signup', lib.signup);
router.post('/userforgot', lib.userforgot);
router.post('/changepassword', lib.changepassword);
router.post('/changemyemail', withAuth, lib.changemyemail);
router.post('/activeaccount', lib.activeaccount);
router.post('/updategeolocate', withAuth, lib.updategeolocate);
router.post('/getEditProfilValues', withAuth, lib.getEditProfilValues);
router.post('/updateEditProfilValues', withAuth, lib.updateEditProfilValues);
router.post('/user-profile', pictures.upload.single('file'), withAuth, pictures.uploadPhoto);
router.post('/getPhotos', withAuth, pictures.getPhotos);
router.post('/addInterests', withAuth, lib.addInterests);
router.post('/getInterests', withAuth, lib.getInterests);
router.post('/getUserInterests', withAuth, lib.getUserInterests);
router.post('/getComplete', withAuth, lib.getComplete);
router.post('/deleteInterest', withAuth, lib.deleteInterest);
router.post('/deleteImage', withAuth, pictures.deleteImage);
router.post('/getUsers', withAuth, match.getUsers);
router.post('/getConnectedUserLocation', withAuth, lib.getConnectedUserLocation);
router.post('/checkUserView', withAuth, lib.checkUserView);
router.post('/getUserIdProfile', withAuth, lib.getUserIdProfile);
router.post('/userLike', withAuth, wall.userLike);
router.post('/deletenotif', withAuth, lib.deletenotif);
router.post('/sendMessage', withAuth, chat.sendMessage);
router.post('/getMessages', withAuth, chat.getMessages);
router.post('/deleteMessages', withAuth, chat.deleteMessages);
router.post('/getNotifications', withAuth, lib.getNotifications);
router.post('/getNotifNb', withAuth, lib.getNotifNb);
router.post('/getMatchedUsers', withAuth, lib.getMatchedUsers);
router.post('/logout', withAuth, async(req, res) => {
    const userID = await lib.getUserId(res.locals.email);
    userID ? lib.setUserLastConnection(userID, 0) : 0;
    res.clearCookie('token');
    res.sendStatus(200);
});

module.exports = router;