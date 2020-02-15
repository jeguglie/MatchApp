const pool = require('./../utils/queries');
const lib = require('./lib.js');
const notifications = require('./notifications');



async function sendMessage(req, res){
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Bad request"]
        }));
    try {
        const { user_id, message } = req.body;
        // Check if user can send message to user
        let text = 'SELECT * FROM matchedusers WHERE user_id2 = $1';
        let text2 = 'SELECT * FROM matchedusers WHERE user_id = $1';
        let response = await pool.query(text, [userID]);
        let response2 = await pool.query(text2, [userID]);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows
            || typeof response2 !== 'undefined' && typeof response2.rows !== 'undefined' && response2.rows) {
            if (message && message.length > 0) {
                let text = 'INSERT INTO chat(user_id, user_id_dest, timestamp, message) VALUES ($1, $2, $3, $4)';
                let values = [userID, user_id, new Date(), message.toString()];
                await pool.query(text, values);
                if (await notifications.usercansendnotif(userID, user_id))
                    await notifications.pushnotifications(user_id, userID, 2);
                return res.status(200).json({
                    response: "Send"
                })
            }
        }
        return res.status(400).json({
            response: "Bad request"
        })
    } catch (e) {
        console.log(e);
        return res.status(400).json({ warnings: ["Bad request"]});
    }
}

async function getMessages(req, res){
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Bad request"]
        }));
    try {
        const { user_id_2 } = req.body;
        let text = 'SELECT * FROM chat WHERE user_id_dest = $1 AND user_id = $2 OR user_id = $1 AND user_id_dest = $2 ORDER BY timestamp ASC';
        let values = [user_id_2, userID];
        let response = await pool.query(text, values);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows)
            return res.status(200).json({ messages: response.rows });
        else
            return res.status(200).json({ messages: [] })
    } catch (e) {
        console.log(e);
        return res.status(400).json({ warnings: ["Bad request"]});
    }
}

async function deleteMessages(req, res) {
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Bad request"]
        }));
    try {
        const { user_id_2 } = req.body;
        let text = 'DELETE FROM chat WHERE user_id_dest = $1 AND user_id = $2C';
        let values = [userID, user_id_2];
        await pool.query(text, values);
        return res.status(200).json({})
    } catch (e) {
        console.log(e);
        return res.status(400).json({ warnings: ["Bad request"]});
    }
}

exports.sendMessage = sendMessage;
exports.getMessages = getMessages;
exports.deleteMessages = deleteMessages;



