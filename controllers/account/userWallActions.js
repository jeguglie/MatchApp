const pool = require('./../../utils/queries');
const lib = require('./lib.js');

async function userLike(req, res) {
    const userID = await lib.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    const { userLikedID } = req.body.state;
    try {
        let find = false;
        let text = 'SELECT * FROM user_likes WHERE user_id_like = $1';
        let values = [userID];
        let response = await pool.query(text, values);
        if (response.rows.length > 0)
            response.rows.map((data) => {
                if (data.user_id_liked === userLikedID)
                    find = true;
            });
        if (find)
            return res.status(400).json({
                warnings: ['You already liked this user']
            });
        else {
            let text = 'INSERT INTO user_likes(user_id_like, user_id_liked) VALUES ($1, $2)';
            let values = [userID, userLikedID];
            await pool.query(text, values);
            return res.status(200).json({});
        }


    } catch(error) {
        return res.status(500).json({
            warnings: ["Server error"]
        })
    }

}

exports.userLike = userLike;