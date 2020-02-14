const pool = require('./../utils/queries');
const lib = require('./lib.js');

async function sendMessage(req, res){
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(400).json({
            warnings: ["Bad request"]
        }));
    try {
        const { user_id, message } = req.body;
        let text = 'INSERT INTO chat(user_id, user_id_dest, timestamp, message) VALUES ($1, $2, $3, $4)';
        let values = [userID, user_id, new Date(), message.toString()];
        await pool.query(text, values);
        return res.status(200).json({
            response: "Send"
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



