const pool = require('./../utils/queries');

async function dashboard(req, res) {
    try {
        console.log(1);
        let users = [];
        let text = 'SELECT * FROM user_report WHERE 1 = 1';
        let response = await pool.query(text);
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length)
            users = response.rows;
        return res.status(200).json({
            users: users,
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({});
    }
}

async function kickuser(req, res) {
    try {
        const { user_id } = req.body;
        await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
        await pool.query('DELETE FROM profile WHERE user_id = $1', [user_id]);
        await pool.query('DELETE FROM user_likes WHERE user_id_like = $1 OR user_id_liked = $1', [user_id]);
        await pool.query('DELETE FROM user_interests WHERE user_id = $1', [user_id]);
        await pool.query('DELETE FROM user_interests WHERE user_id = $1', [user_id]);
        await pool.query('DELETE FROM chat WHERE user_id = $1 OR user_id_dest = $1', [user_id]);
        await pool.query('DELETE FROM pictures WHERE user_id = $1', [user_id]);
        await pool.query('DELETE FROM user_complete WHERE user_id = $1', [user_id]);
        await pool.query('DELETE FROM notifications WHERE user_id_notified = $1 OR user_id_emitter = $1', [user_id]);
        await pool.query('DELETE FROM matchedusers WHERE user_id = $1 OR user_id2 = $1', [user_id]);
        await pool.query('DELETE FROM user_report WHERE user_id = $1 OR user_id_reported = $1', [user_id]);
        await pool.query('DELETE FROM user_hide WHERE user_id = $1 OR user_id_reported = $1', [user_id]);
        await pool.query('DELETE FROM user_fake WHERE user_id = $1 OR user_id_reported = $1', [user_id]);
        return res.status(200).json({});
    } catch (e) {
        console.log(e);
        return res.status(400).json({});
    }
}

exports.dashboard = dashboard;
exports.kickuser = kickuser;
