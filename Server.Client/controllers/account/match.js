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

    // Get filter options ---------------------------
    const {popularityRange, distanceRange, ageRange } = req.body;
    try {


        // Interested and Gender of connected user
        let text = 'SELECT gender, interested FROM profile WHERE user_id = $1;';
        let values = [userID];
        let response = await pool.query(text, values);
        if (response && response.rows.length) {
            const {gender, interested} = response.rows[0];
            // First filter on BDD with AGE - POPULARITY
            text = 'SELECT * FROM profile P INNER JOIN pictures IMG ON P.user_id = IMG.user_id WHERE IMG.img_order = 0 ' +
                'AND interested = $1 AND gender = $2 AND age >= $3 AND age <= $4 AND likes >= $5 AND likes <= $6';
            values = [gender, interested, ageRange.min, ageRange.max, popularityRange.min, popularityRange.max];
            response = await pool.query(text, values);
            let users = response.rows;

            // Map all users and assign interests list
            users = users.map((user) = async(user) =>{
                text = 'SELECT * FROM user_interests WHERE user_id = $1';
                values = [user.user_id];
                response = await pool.query(text, values);
                return Object.assign(user, {interests: response.rows});
            });
            Promise.all(users).catch(() => { return res.status(500).json({}) })
                .then((users) = async(users) => {
                    let userLocation = {
                        longitude: 0,
                        latitude: 0,
                    };
                    // Get connected user location
                    text = 'SELECT longitude, latitude FROM profile WHERE user_id = $1';
                    values = [userID];
                    response = await pool.query(text, values);
                    if (typeof response != 'undefined' && typeof response.rows != 'undefined' && response.rows.length) {
                        userLocation.longitude = response.rows[0].longitude;
                        userLocation.latitude = response.rows[0].latitude;
                    }
                    // Get connected user interests
                    text = 'SELECT * FROM user_interests WHERE user_id = $1';
                    values = [userID];
                    response = await pool.query(text, values);
                    let usersCinterests = response.rows;

                    // Insert distance of each users and filter by distanceRange ------------------------------------
                    users.map((user) => {
                        let distance = Math.round(getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, user.latitude, user.longitude));
                        // Insert point per distance
                        Object.assign(user, {points: 0 - (distance / 10)});
                        return Object.assign(user,{distance:  distance});
                    });
                    users = users.filter(user => user.distance <= distanceRange);

                    // Add point if filtered users have same interests
                    for (let i = 0; i < users.length; i++){
                        for (let j = 0; j < users[i].interests.length; j++){
                            // Map interests tab on user and add point
                            let nbInterests = 0;
                            usersCinterests.map(e => {
                                if (e.interest_id === users[i].interests[j].interest_id)
                                    nbInterests += 1;
                                if (j + 1 === users[i].interests.length)
                                    users[i].points += fibonacci(nbInterests);
                            })
                        }
                    }
                    // Sort users by point
                    users.sort(function (a, b) {
                        if (b.points === a.points)
                            return b.likes - a.likes
                        return b.points - a.points;
                    });
                    return res.status(200).json({
                        users: users,
                    });
                })
        }
        else
            return res.status(500).json({
                warnings: ["Please complete your profile"]
            });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Error server"]
        })
    }
}
function fibonacci(nbr) {
    if (nbr < 2) {
        return nbr;
    }
    return fibonacci(nbr - 1) + fibonacci(nbr - 2);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

exports.getUsers = getUsers;