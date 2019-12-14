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
        // Get filter
        let gender = undefined;
        let interested = undefined;
        const popularityRange = req.body.popularityRange;
        const distanceRange = req.body.distanceRange;
        const ageRange = req.body.ageRange;

        // Get connected user gender and interested
        let text = 'SELECT gender, interested FROM profile WHERE user_id = $1;';
        let values = [userID];
        let response = await pool.query(text, values);
        if (response && response.rows.length){
            gender = response.rows[0].gender;
            interested = response.rows[0].interested;
        }
        else {
            return res.status(500)  .json({
                warnings: ["Your are not authorized to access this page"]
            })
        }
        // Filter other user by gender and what are they interested
        // Filter other user by birthday
        text = 'SELECT * FROM profile P INNER JOIN pictures IMG ON P.user_id = IMG.user_id WHERE IMG.img_order = 0 ' +
            'AND interested = $1 AND gender = $2 AND age >= $3 AND age <= $4 AND likes >= $5 AND likes <= $6';
        values = [gender, interested, ageRange.min, ageRange.max, popularityRange.min, popularityRange.max];
        response = await pool.query(text, values);
        let users = response.rows;
        // Add list interests per USER
        // GET LOCATION

        users = users.map( (user) = async(user) =>{
            text = 'SELECT * FROM user_interests WHERE user_id = $1';
                values = [user.user_id];
                let fetchInterest = await pool.query(text, values);
                return Object.assign(user, {interests: fetchInterest.rows});
            });
        Promise.all(users)
            .catch(() => {return res.status(500).json({})})
            .then((users) = async(users) =>{
                let userLocation = {
                    longitude: null,
                    latitude: null,
                };
                let text = 'SELECT longitude, latitude FROM profile WHERE user_id = $1';
                let values = [userID];
                let response = await pool.query(text, values);
                if (typeof response != 'undefined' && typeof response.rows != 'undefined' && response.rows.length) {
                    userLocation.longitude = response.rows[0].longitude;
                    userLocation.latitude = response.rows[0].latitude;
                }
                users.map((user) => {
                    let distance = Math.round(getDistanceFromLatLonInKm(
                        userLocation.latitude,
                        userLocation.longitude,
                        user.latitude,
                        user.longitude));
                    return Object.assign(user,{distance:  distance});
                });
                // Filter distance
                users = users.filter(user => user.distance <= distanceRange);
                // Sort distance
                users.sort((a, b) => {
                    if(a.distance === b.distance) {
                        // If two elements have same number, then the one who has larger rating.average wins
                        return b.likes - a.likes;
                    } else {
                        // If two elements have different number, then the one who has larger number wins
                        return a.distance - b.distance;
                    }
                });

                // Get connected user interests
                text = 'SELECT * FROM user_interests WHERE user_id = $1';
                values = [userID];
                response = await pool.query(text, values);
                let usersCinterests = response.rows;

                for (let i = 0; i < users.length; i++){
                    Object.assign(users[i], {points: 0});
                    for (let j = 0; j < users[i].interests.length; j++){
                        usersCinterests.map(e => {
                            if (e.interest_id === users[i].interests[j].interest_id) {
                                users[i].points += 10;
                            }
                        })
                    }
                }
                users.sort((a, b) => {
                    if(a.points === b.points) {
                        // If two elements have same number, then the one who has larger rating.average wins
                        return b.likes - a.likes;
                    } else {
                        // If two elements have different number, then the one who has larger number wins
                        return a.points - b.points;
                    }
                });
                return res.status(200).json({
                    users: users,
                });
            })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Error server"]
        })
    }
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