const account = require('./lib');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'jeguglie',
    host: 'localhost',
    database: 'api',
    password: '06245547Jv345102.',
    port: 5432,
});

async function getUsers(req, res){
    const userID = await account.getUserId(res.locals.email);
    if (userID === null)
        return (res.status(500).json({
            warnings: ["Can't get user ID, please logout and login"]
        }));
    try {
        // Filter sent
        const popularityRange = req.body.popularityRange;
        const distanceRange = req.body.distanceRange;
        const ageRange = req.body.ageRange;

        let gender;
        let interested;
        // Get connected user gender and interested
        let text = 'SELECT gender, interested FROM profile WHERE user_id = $1;';
        let values = [userID];
        let response = await pool.query(text, values);
        if (response && response.rows.length){
            gender = response.rows[0].gender;
            interested = response.rows[0].interested;
        }
        console.log(ageRange);
        console.log(gender + interested);
        // Filter other user by gender and what are they interested
        // Filter other user by birthday
        text = 'SELECT * FROM profile P INNER JOIN pictures IMG ON P.user_id = IMG.user_id WHERE IMG.img_order = 0 ' +
            'AND interested = $1 AND gender = $2 AND age >= $3 AND age <= $4 AND likes >= $5 AND likes <= $6';
        values = [gender, interested, ageRange.min, ageRange.max, popularityRange.min, popularityRange.max];
        response = await pool.query(text, values);
        return res.status(200).json({
            users: response.rows,
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Error server"]
        })
    }
}

exports.getUsers = getUsers;