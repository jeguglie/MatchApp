const express = require("express");
const bodyParser = require("body-parser");
const uuid = require('uuid/v4');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const withAuth = require('./utils/middleware');
const app = express();
const DIR = './public/';
const account = require('./controllers/account/lib.js');
const wallActions = require('./controllers/account/userWallActions.js');
const addphotos = require('./controllers/account/addphotos.js');
const faker = require('./controllers/account/faker');
const match = require('./controllers/account/match');
const port = 5000;
const cookie = require('cookie');
const io = require('socket.io')();
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const pool = require('./utils/queries');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200);

});
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
app.post('/user-profile', upload.single('file'), withAuth, addphotos.uploadPhoto);
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
app.post('/checkUserLike', withAuth, wallActions.checkUserLike);
app.post('/wallvisit', withAuth, wallActions.wallvisit);
app.post('/deletenotif', withAuth, account.deletenotif);
app.get('/getNotifications', withAuth, account.getNotifications);
app.get('/faker', faker.matchAppFaker);


// Store connected users
let userslist = [];

function pushUserSocket(socket){
    // Get cookies
    let cookief = socket.handshake.headers.cookie;
    if (cookief) {
        let cookies = cookie.parse(cookief);
        // Check Auth
        if (cookies && typeof cookies.token != "undefined") {
            jwt.verify(cookies.token, secret, async (err, decoded) => {
                if (!err) {
                    let email = decoded.email;
                    // Get User ID
                    let userID = await account.getUserId(email);
                    if (userID) {
                        // Store userID and socketID
                        if (!userslist.length)
                            userslist.push({userID: userID, socketID: socket.id});
                        else {
                            let find = false;
                            for (let i = 0; i < userslist.length; i++){
                                if (userslist[i].userID === userID) {
                                    find = true;
                                    userslist[i].socketID = socket.id;
                                }
                            }
                            // If userID not match, then add it to userlists
                            if (!find)
                                userslist.push({userID: userID, socketID: socket.id});
                        }
                    }
                }
            });
        }
    }
}

async function getUserIDFromSocketEmitter(socket) {
    let cookief = socket.handshake.headers.cookie;
    let userID = null;
    if (cookief) {
        let cookies = cookie.parse(cookief);
        if (cookies && typeof cookies.token != "undefined")
            userID = await jwt.verify(cookies.token, secret, async (err, decoded) => {
                if (!err)
                    return await account.getUserId(decoded.email);
            });
    }
    return userID;
}

function deleteUserSocket(socket){
    // Get cookies
    let cookief = socket.handshake.headers.cookie;
    if (cookief) {
        let cookies = cookie.parse(cookief);
        // Check Auth
        if (cookies && typeof cookies.token != "undefined") {
            jwt.verify(cookies.token, secret, async (err, decoded) => {
                if (!err) {
                    let email = decoded.email;
                    // Get User ID
                    let userID = await account.getUserId(email);
                    if (userID) {
                        for (let i = 0; i < userslist.length; i++){
                            if (userslist[i].userID === userID)
                                userslist.splice(i, 1);
                        }
                    }
                }
            });
        }
    }
}

// Check if destination user for notification is ONLINE
function findSocketID(userID){
    for (let i = 0; i < userslist.length; i++){
        if (userslist[i].userID === userID) {
            return userslist[i].socketID;
        }
    }
    return null;
}

async function usercansendnotif(userIDsending, userIDreceive){
    try {
        let text = 'SELECT * FROM user_hide WHERE user_id = $1 AND user_id_reported = $2';
        let values = [userIDreceive, userIDsending];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return false;
        return true
    } catch(e){
        return false;
    }
}

// Notifications
io.sockets.on('connection', socket => {
    pushUserSocket(socket);
    console.log(socket.id);
    socket.on("userlogin", () => {
        pushUserSocket(socket);
    });
    socket.on('logout', () => {
        if (typeof socket.handshake !== "undefined" && typeof socket.handshake.headers !== "undefined" && typeof socket.handshake.headers.cookie !== "undefined")
            deleteUserSocket(socket);
    });
    socket.on('like', async(userID) => {
        let socketID = findSocketID(userID);
        if (socketID){
            let userIDemitter = await getUserIDFromSocketEmitter(socket);
            if (userIDemitter && await usercansendnotif(userIDemitter, userID))
                io.sockets.to(socketID).emit('like:receive like', {userID: userID, userIDemitter: userIDemitter});
                io.sockets.to(socketID).emit('getnotif', {userID: userID, userIDemitter: userIDemitter});
        }

    });
    socket.on('wall:visit', async(userID) => {
        let socketID = findSocketID(userID);
        if (socketID){
            let userIDemitter = await getUserIDFromSocketEmitter(socket);
            if (userIDemitter && await usercansendnotif(userIDemitter, userID)) {
                io.sockets.to(socketID).emit('wall:visit', {userID: userID, userIDemitter: userIDemitter});
                io.sockets.to(socketID).emit('getnotif', {userID: userID, userIDemitter: userIDemitter});
                console.log('send to :' + socketID);
                console.log(userslist);
            }
        }
    })
});
const portio = 8000;
io.listen(portio);
console.log('Listening on port ', portio);
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));