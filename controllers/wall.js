const pool = require('../utils/queries');
const lib = require('./lib.js');
const notifications = require('./notifications');
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
        return (res.status(400).json({
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
                if (await notifications.usercansendnotif(userID, userLikedID))
                    await notifications.pushnotifications(userLikedID, userID, 4);
                unliked = true;
                // Delete row un matched user
                await pool.query('DELETE FROM matchedusers WHERE user_id = $1 AND user_id2 = $2 OR user_id = $2 AND user_id2 = $1', [userID, userLikedID])
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
            if (await notifications.usercansendnotif(userID, userLikedID))
                await notifications.pushnotifications(userLikedID, userID, 5);
            // Check if two users like each other
            text = 'SELECT * FROM user_likes WHERE user_id_like = $1 AND user_id_liked = $2';
            values = [userLikedID, userID];
            let response = await pool.query(text, values);
            // Notif two user for like back
            if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
                if (await notifications.usercansendnotif(userID, userLikedID)) {
                    await notifications.pushnotifications(userID, userLikedID, 3);
                    await notifications.pushnotifications(userLikedID, userID, 3);
                }
                likedback = true;
                // Insert in matched user
                text = 'SELECT * FROM matchedusers WHERE user_id = $1 OR user_id2 = $2 AND user_id = $1 OR user_id2 = $2';
                values = [userID, userLikedID];
                response = await pool.query(text, values);
                if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length < 1) {
                    await pool.query('INSERT INTO matchedusers(user_id, user_id2) VALUES ($1, $2)', [userID, userLikedID])
                }
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
        console.log(error);
        return res.status(400).json({
            warnings: ["Server error"]
        })
    }
}


exports.userLike = userLike;
