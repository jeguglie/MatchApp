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
const port = 3000;
const cookie = require('cookie');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

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
app.post('/login', account.login);
app.post('/signup', account.signup);
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
                            if (userslist[i].userID === userID) {
                                userslist.splice(i, 1);
                            }
                        }
                    }
                }
            });
        }
    }
}

// Notifications
io.sockets.on('connection', socket => {
    pushUserSocket(socket);
    socket.on("userlogin", () => {
        pushUserSocket(socket);
        console.log("user login : " + socket.id)
        console.log(userslist);
    });
    socket.on('logout', () => {
        if (typeof socket.handshake !== "undefined" && typeof socket.handshake.headers !== "undefined" && typeof socket.handshake.headers.cookie !== "undefined")
            deleteUserSocket(socket);
    });
    // socket.on('disconnect', () => {
    //     if (typeof socket.handshake !== "undefined" && typeof socket.handshake.headers !== "undefined" && typeof socket.handshake.headers.cookie !== "undefined")
    //         deleteUserSocket(socket);
    // });
    socket.on('like', (userID) => {
        for (let i = 0; i < userslist.length; i++){
            if (userslist[i].userID === userID) {
                let socketID = userslist[i].socketID;
                io.sockets.to(socketID).emit('sendlike', userID );

            }
        }

    });
    console.log(userslist);

});

server.listen(3002, () => console.log(`Listening on port 3002`));
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));