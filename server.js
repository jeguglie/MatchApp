const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const withAuth = require('./utils/middleware');
const app = express();
const faker = require('./controllers/account/faker');
const match = require('./controllers/account/match');
const account = require('./controllers/account/lib.js');
const wallActions = require('./controllers/account/userWallActions.js');
const addphotos = require('./controllers/account/addphotos.js');
const notifications = require('./controllers/account/notifications');
const io = require('socket.io')();
const port = 5000;
const portio = 8000;
let userslist = [];

app.use(function(req, res, next) {
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

app.post('/reportuserhide', withAuth, account.reportuserhide);
app.post('/reportuserfake', withAuth, account.reportuserfake);
app.post('/reportuser', withAuth, account.reportuser);
app.post('/login', account.login);
app.post('/signup', account.signup);
app.post('/userforgot', account.userforgot);
app.post('/changepassword', account.changepassword);
app.post('/changemyemail', withAuth, account.changemyemail);
app.post('/activeaccount', account.activeaccount);
app.post('/updategeolocate', withAuth, account.updategeolocate);
app.post('/getEditProfilValues', withAuth, account.getEditProfilValues);
app.post('/updateEditProfilValues', withAuth, account.updateEditProfilValues);
app.post('/user-profile', addphotos.upload.single('file'), withAuth, addphotos.uploadPhoto);
app.post('/getPhotos', withAuth, addphotos.getPhotos);
app.post('/addInterests', withAuth, account.addInterests);
app.post('/getInterests', withAuth, account.getInterests);
app.post('/getUserInterests', withAuth, account.getUserInterests);
app.post('/getComplete', withAuth, account.getComplete);
app.post('/deleteInterest', withAuth, account.deleteInterest);
app.post('/deleteImage', withAuth, addphotos.deleteImage);
app.post('/getUsers', withAuth, match.getUsers);
app.post('/getConnectedUserLocation', withAuth, account.getConnectedUserLocation);
app.post('/checkUserView', withAuth, account.checkUserView);
app.post('/getUserIdProfile', withAuth, account.getUserIdProfile);
app.post('/userLike', withAuth, wallActions.userLike);
app.post('/deletenotif', withAuth, account.deletenotif);
app.get('/checkToken', withAuth, function(req, res) {res.sendStatus(200);});
app.get('/getNotifications', withAuth, account.getNotifications);
app.get('/getNotifNb', withAuth, account.getNotifNb);
app.get('/faker', faker.matchAppFaker);
app.get('/logout', withAuth, async(req, res) => {
    const userID = await account.getUserId(res.locals.email);
    userID !== null ? account.setUserLastConnection(userID, 0) : 0;
    res.clearCookie('token');
    res.sendStatus(200);
});

// Notifications
io.sockets.on('connection', socket => {
    notifications.pushUserSocket(socket, userslist);
    socket.on("userlogin", async() => {
        let userIDemitter = await  notifications.getUserIDFromSocketEmitter(socket, userslist);
        userIDemitter && await account.setUserLastConnection(userIDemitter, 1);
        notifications.pushUserSocket(socket, userslist);});
    socket.on('disconnectuser', async() => {
        // Verify cookies
        if (typeof socket.handshake !== "undefined" && typeof socket.handshake.headers !== "undefined" && typeof socket.handshake.headers.cookie !== "undefined"){
            // Delete user from userlist;
            notifications.deleteUserSocket(socket, userslist);
            // Set user offline in DBB
            let userIDemitter = await  notifications.getUserIDFromSocketEmitter(socket, userslist);
            userIDemitter && await account.setUserLastConnection(userIDemitter, 0);
        }
    });
    socket.on('like', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID){
            let userIDemitter = await  notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await  notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await account.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:receive like', {useremitter: name});
            }
        }

    });
    socket.on('wall:visit', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await  notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await  notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await account.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('wall:visit', {useremitter: name});
            }
        }
    });
    socket.on('like:unlike', async(userID) => {
        let socketID = notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await  notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await  notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await account.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:unlike', {useremitter: name});
            }
        }
    });
    socket.on('like:likedback', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        console.log(socketID);

        if (socketID) {
            console.log(2);
            let userIDemitter = await  notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await  notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await account.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:likedback', {useremitter: name, userIDemitter: userIDemitter});
            }
        }
    });
    socket.on('like:likedbackreturn', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await account.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:likedbackreturn', {useremitter: name, userIDemitter: userIDemitter});
            }
        }
    })

});

io.listen(portio);
console.log('Listening on port ', portio);
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));