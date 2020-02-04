const pool = require('./../../utils/queries');
const lib = require('./lib.js');
const io = require('socket.io')();

// Notifications type
// 3 - Like back
// 1 - Get visit
// 2 - Get message
// 4 - Matched user unlike you
// 5 - Like you

async function pushnotifications(user_id_notified, user_id_emitter, type){
    try {
        var date = new Date();
        var timestamp = date.getTime();
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



async function updatetotallike(userIDLiked){
    try {
        let text = 'SELECT * FROM user_likes WHERE user_id_liked = $1';
        let value = [userIDLiked];
        let response = await pool.query(text, value);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
            text = 'UPDATE profile SET likes = $1 WHERE user_id = $2';
            value = [response.rows.length, userIDLiked];
            await pool.query(text, value);
        }
        return true;
    }catch (e){
        return false;
    }
}

async function userLike(req, res) {
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    const { userLikedID } = req.body;
    let unliked = false;
    let likedback = false;
    try {
        let liked = false;
        let text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
        let values = [userID, userLikedID];
        let response = await pool.query(text, values);
        // If userID already like userLikedID ---> dislike
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length){
            // Check if userLikedID liked userID ---> then emit notification
            text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
            values = [userLikedID, userID];
            response = await pool.query(text, values);
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
                await pushnotifications(userLikedID, userID, 4);
                unliked = true;
            }
            // Delete like row
            text = 'DELETE FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
            values = [userID, userLikedID];
            await pool.query(text, values);
            liked = false;
        }
        else {
            // Insert like
            let text = 'INSERT INTO user_likes(user_id_like, user_id_liked) VALUES ($1, $2)';
            let values = [userID, userLikedID];
            await pool.query(text, values);
            liked = true;
            await pushnotifications(userLikedID, userID, 5);
            // Check if two users like each other
            text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
            values = [userLikedID, userID];
            let response = await pool.query(text, values);
            // Notif two user for like back
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
                await pushnotifications(userID, userLikedID, 3);
                await pushnotifications(userLikedID, userID, 3);
                likedback = true;
            }

        }
        await updatetotallike(userLikedID)
            .then(() => {
                return res.status(200).json({liked: liked, likedback: likedback, unliked: unliked})
            })
            .catch(() => {
                return res.status(400).json({
                    warnings: ["Bad request"]
                })
            });
    } catch(error) {
        console.log
        return res.status(500).json({
            warnings: ["Server error"]
        })
    }
}

async function checkUserLike(req, res){
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    const { userLikedID } = req.body;
    try {
        let text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
        let values = [userID, userLikedID];
        let response = await pool.query(text, values);
        await pushnotifications(userLikedID, userID, 1);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            return res.status(200).json({ liked: true });
        return res.status(200).json({ liked: false });
    } catch(error) {
        return res.status(500).json({
            warnings: ["Server error"]
        })
    }
}

exports.userLike = userLike;
exports.checkUserLike = checkUserLike;
exports.pushnotifications = pushnotifications;
