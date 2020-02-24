require('dotenv').config({path: __dirname + '/.env'});
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
const path = require('path');
const host = process.env.PORT ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 5000;
const router = require('./utils/router');
const notifications = require('./controllers/notifications');
const lib = require('./controllers/lib.js');
const cors = require('cors');
let userslist = [];
app.use(cors());

// Deserve gzip
app.get('*.js', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build/')));
app.use('/api/public', express.static('public'));
app.use('/api', router);

// Notifications
io.sockets.on('connection', async(socket) => {
    userslist = await notifications.pushUserSocket(socket, userslist);
    socket.on("userlogin", async(token) => {
        let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
        userIDemitter && await lib.setUserLastConnection(userIDemitter, 1);
        userslist = await notifications.pushUserSocketLogin(token, userslist, socket);
    });
    socket.on('disconnect', async() => {
        // Verify cookies
        if (typeof socket.handshake !== "undefined" && typeof socket.handshake.headers !== "undefined" && typeof socket.handshake.headers.cookie !== "undefined"){
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            userIDemitter && await lib.setUserLastConnection(userIDemitter, 0);
            userslist = await notifications.deleteUserSocket(socket, userslist);
        }
    });
    socket.on('like', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID){
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await lib.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:receive like', {useremitter: name});
            }
        }
    });
    socket.on('wall:visit', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await lib.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('wall:visit', {useremitter: name});
            }
        }
    });
    socket.on('like:unlike', async(userID) => {
        let socketID = notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await lib.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:unlike', {useremitter: name});
            }
        }
    });
    socket.on('like:likedback', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await lib.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:likedback', {useremitter: name, userIDemitter: userIDemitter});
            }
        }
    });
    socket.on('like:likedbackreturn', async(userID) => {
        let socketID =  notifications.findSocketID(userID, userslist);
        if (socketID) {
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, userID)) {
                let name = await lib.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('like:likedbackreturn', {useremitter: name, userIDemitter: userIDemitter});
            }
        }
    });

    socket.on('message:send', async(to_user_id, message) => {
        let socketID = notifications.findSocketID(to_user_id, userslist);
        if (socketID){
            let userIDemitter = await notifications.getUserIDFromSocketEmitter(socket, userslist);
            if (userIDemitter && await notifications.usercansendnotif(userIDemitter, to_user_id)) {
                let name = await lib.getNameUserId(userIDemitter, userslist);
                io.sockets.to(socketID).emit('message:receive', {
                    useremitter: name,
                    message: message,
                    user_id_emitter: userIDemitter,
                    user_id_receiver: to_user_id
                });
            }
        }
    });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './client/build/', 'index.html'));
});

server.listen(process.env.PORT || 5000, host, () => console.log(`Server listening on port ${port}`));
