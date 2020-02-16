const express = require("express");
const app = express();
require('./controllers/sockets');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const withAuth = require('./utils/middleware');
const withAuthAdmin = require('./utils/admin');
const faker = require('./controllers/faker');
const match = require('./controllers/match');
const lib = require('./controllers/lib.js');
const admin = require('./controllers/admin.js');
const chat = require('./controllers/chat.js');
const wall = require('./controllers/wall.js');
const pictures = require('./controllers/pictures.js');
const host = '0.0.0.0';
const port = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.get('/faker', faker.matchAppFaker);
app.get('/checkToken', withAuth, (req, res) => {res.sendStatus(200)});
app.get('/checkTokenAdmin', withAuthAdmin, (req, res) => {res.sendStatus(200)});
app.post('/admin', withAuthAdmin, admin.dashboard);
app.post('/kickuser', withAuthAdmin, admin.kickuser);
app.post('/reportuserhide', withAuth, lib.reportuserhide);
app.post('/reportuserfake', withAuth, lib.reportuserfake);
app.post('/reportuser', withAuth, lib.reportuser);
app.post('/login', lib.login);
app.post('/signup', lib.signup);
app.post('/userforgot', lib.userforgot);
app.post('/changepassword', lib.changepassword);
app.post('/changemyemail', withAuth, lib.changemyemail);
app.post('/activeaccount', lib.activeaccount);
app.post('/updategeolocate', withAuth, lib.updategeolocate);
app.post('/getEditProfilValues', withAuth, lib.getEditProfilValues);
app.post('/updateEditProfilValues', withAuth, lib.updateEditProfilValues);
app.post('/user-profile', pictures.upload.single('file'), withAuth, pictures.uploadPhoto);
app.post('/getPhotos', withAuth, pictures.getPhotos);
app.post('/addInterests', withAuth, lib.addInterests);
app.post('/getInterests', withAuth, lib.getInterests);
app.post('/getUserInterests', withAuth, lib.getUserInterests);
app.post('/getComplete', withAuth, lib.getComplete);
app.post('/deleteInterest', withAuth, lib.deleteInterest);
app.post('/deleteImage', withAuth, pictures.deleteImage);
app.post('/getUsers', withAuth, match.getUsers);
app.post('/getConnectedUserLocation', withAuth, lib.getConnectedUserLocation);
app.post('/checkUserView', withAuth, lib.checkUserView);
app.post('/getUserIdProfile', withAuth, lib.getUserIdProfile);
app.post('/userLike', withAuth, wall.userLike);
app.post('/deletenotif', withAuth, lib.deletenotif);
app.post('/sendMessage', withAuth, chat.sendMessage);
app.post('/getMessages', withAuth, chat.getMessages);
app.post('/deleteMessages', withAuth, chat.deleteMessages);
app.post('/getNotifications', withAuth, lib.getNotifications);
app.post('/getNotifNb', withAuth, lib.getNotifNb);
app.post('/getMatchedUsers', withAuth, lib.getMatchedUsers);
app.post('/logout', withAuth, async(req, res) => {
    const userID = await lib.getUserId(res.locals.email);
    userID ? lib.setUserLastConnection(userID, 0) : 0;
    res.clearCookie('token');
    res.sendStatus(200);
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '/client/build', 'index.html'));
});
app.listen(process.env.PORT || 5000, host, () => console.log(`Server listening on port ${port}`));