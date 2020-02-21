const pool = require('../utils/queries');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;
const cookie = require('cookie');
const account = require('../controllers/lib.js');


// Notifications type
// 3 - Like back
// 1 - Get visit
// 2 - Get message
// 4 - Matched user unlike you
// 5 - Like you

async function pushnotifications(user_id_notified, user_id_emitter, type){
    try {
        let text = 'SELECT * FROM notifications WHERE 1 = 1';
        let response = await pool.query(text);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length > 0) {
            text = 'SELECT * FROM notifications WHERE user_id_notified = $1 AND user_id_emitter = $2 AND type = $3';
            let values = [user_id_notified, user_id_emitter, type];
            response = await pool.query(text, values);
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length > 0) {
                text = 'UPDATE notifications SET user_id_notified = $1, user_id_emitter = $2, date = $3, type = $4 WHERE user_id_notified = $5 AND user_id_emitter = $6 AND type = $7';
                values = [user_id_notified, user_id_emitter, new Date(), type, user_id_notified, user_id_emitter, type];
                await pool.query(text, values);
            }
            else {
                text = 'INSERT INTO notifications(user_id_notified, user_id_emitter, date,  type) VALUES ($1, $2, $3, $4)';
                values = [user_id_notified, user_id_emitter, new Date(), type];
                await pool.query(text, values);
            }
        }
        else {
            text = 'INSERT INTO notifications(user_id_notified, user_id_emitter, date,  type) VALUES ($1, $2, $3, $4)';
            let values = [user_id_notified, user_id_emitter, new Date(), type];
            await pool.query(text, values);
        }

        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

const pushUserSocketLogin = (token, userslist, socket) =>{
    if (token) {
        jwt.verify(token, secret, async (err, decoded) => {
            if (!err) {
                let email = decoded.email;
                // Get User ID
                let userID = await account.getUserId(email);
                if (userID) {
                    // Store userID and socketID
                    if (userslist.length < 1) {
                        userslist.push({userID: userID, socketID: socket.id});
                    }
                    else {
                        let find = false;
                        for (let i = 0; i < userslist.length; i++){
                            if (userslist[i].userID === userID) {
                                find = true;
                                userslist[i].socketID = socket.id;
                            }
                        }
                        // If userID not match, then add it to userlists
                        if (!find) {
                            userslist.push({userID: userID, socketID: socket.id});
                        }
                    }
                }
            }
        });
    }
    return userslist;
}


const pushUserSocket = (socket, userslist) =>{
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
                        if (userslist.length < 1)
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
                            if (!find) {
                                userslist.push({userID: userID, socketID: socket.id});
                            }
                        }
                    }
                }
            });
        }
    }
    return userslist;
}

const getUserIDFromSocketEmitter = async(socket) => {
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

const deleteUserSocket = async(socket, userslist) => {
    // Get cookies
    let cookief = socket.handshake.headers.cookie;
    if (cookief) {
        let cookies = cookie.parse(cookief);
        // Check Auth
        if (cookies && typeof cookies.token != "undefined") {
            jwt.verify(cookies.token, secret, async (err, decoded) => {
                if (!err) {
                    let email = decoded.email;
                    let userID = await account.getUserId(email);
                    if (userID) {
                        for (let i = 0; i < userslist.length; i++){
                            if (userslist[i].userID === userID) {
                                userslist.splice(i, 1);
                            }
                        }
                        return userslist;
                    }
                }
            });
        }
    }
    return userslist;
}


// Check if destination user for notification is ONLINE
const findSocketID = (userID, userslist) => {
    if (userslist)
        for (let i = 0; i < userslist.length; i++)
            if (userslist[i].userID === userID) {
                return userslist[i].socketID;
            }
    return null;
}

const usercansendnotif = async(userIDsending, userIDreceive) => {
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

exports.usercansendnotif = usercansendnotif;
exports.findSocketID = findSocketID;
exports.deleteUserSocket = deleteUserSocket;
exports.getUserIDFromSocketEmitter = getUserIDFromSocketEmitter;
exports.pushUserSocket = pushUserSocket;
exports.pushUserSocketLogin = pushUserSocketLogin;
exports.pushnotifications = pushnotifications;
