const faker = require('faker/locale/fr');
const passwordHash = require("password-hash");
const randomLocation = require('random-location');
const pool = require('./../../utils/queries');

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}

const P = {
    latitude: 48.864710,
    longitude: -2.346028
};

const R = 500000 // meters


async function matchAppFaker(req, res) {
    try {
        faker.seed(2000);
        // CLEAN DATABASE ---------------------------------------------
        let texts = [
            "DELETE FROM users WHERE 1 = 1;",
            "DELETE FROM user_interests WHERE 1 = 1;",
            "DELETE FROM user_complete WHERE 1 = 1;",
            "DELETE FROM profile WHERE 1 = 1;",
            "DELETE FROM pictures WHERE 1 = 1;",
            "DELETE FROM interests WHERE 1 = 1;",
            "DELETE FROM user_likes WHERE 1 = 1;"
        ];
        texts.map(async (request) => { await pool.query(request) });

        // GENERATE 2000 INTERESTS ------------------------------------
        // RESET SEQUENCE
        let text = 'ALTER SEQUENCE interests_id_seq RESTART WITH 1';
        await pool.query(text);
        for (let i = 0; i < 4000; i++) {
            const text = 'INSERT INTO interests(interest) VALUES ($1);';
            await pool.query(text, [faker.random.word()]);
        }

        // GENERATE 500 USERS -----------------------------------------
        // RESET SEQUENCE
        text = 'ALTER SEQUENCE users_user_id_seq RESTART WITH 1';
        await pool.query(text);
        for (let i = 0; i < 1000; i++) {
            const text = 'INSERT INTO users(username, email, password, complete, active) VALUES ($1, $2, $3, $4, $5);';
            const values = [
                faker.internet.userName(),
                faker.internet.email(),
                passwordHash.generate(faker.internet.password()),
                100,
                1
            ];
            await pool.query(text, values);
        }
        // GENERATE USERS INTERESTS -----------------------------------
        for (let i = 0; i < 1000; i++) {
            let tab = [];
            for (let j = 0; j < 30; j++) {
                let randomInterests = Math.floor(Math.random() * 2000);
                const text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1, $2);';
                const values = [i, Math.floor(Math.random() * 2000) + 1];
                await pool.query(text, values);
            }
        }
        // GENERATE USERS COMPLETE  -----------------------------------
        for (let i = 0; i < 1000; i++) {
            const text = 'INSERT INTO user_complete(complete_basics, complete_photos, complete_interets, user_id) VALUES ($1, $2, $3, $4);';
            const values = [30, 40, 30, i];
            await pool.query(text, values);
        }
        // GENERATE USERS PROFILE -------------------------------------
        let gender = ["male", "female"];
        for (let i = 0; i < 1000; i++){
            const location = randomLocation.randomCirclePoint(P, R)
            const text = 'INSERT INTO profile(user_id, lastname, firstname, gender, interested, country, age, bio, longitude, latitude, likes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);';
            const values = [
                i,
                faker.name.lastName(),
                faker.name.firstName(),
                gender[Math.round(Math.random())],
                gender[Math.round(Math.random())],
                faker.address.country(),
                calcAge(faker.date.between('1970-01-01T11:25:19.644Z', '2000-01-01T11:25:19.644Z')),
                faker.random.words(),
                location.longitude,
                location.latitude,
                0
            ];
            await pool.query(text, values);
        }
        // GENERATE USERS PICTURES  -----------------------------------
        // RESET SEQUENCE
        text = 'ALTER SEQUENCE pictures_img_id_seq RESTART WITH 1';
        await pool.query(text);
        for (let i = 0; i < 1000; i++) {
            for (let j = 0; j < 5; j++) {
                const text = 'INSERT INTO pictures(img_link, user_id, img_order) VALUES ($1, $2, $3)';
                const values = [faker.image.avatar(), i, j];
                await pool.query(text, values);
            }
        }

        // GENERATE LIKES
        console.log(5);
        for (let i = 0; i < 20000; i++) {
            console.log(i);
            let text = 'INSERT INTO user_likes(user_id_like, user_id_liked) VALUES ($1, $2)';
            let user_id_like = Math.floor(Math.random() * 1000) + 1;
            let user_id_liked = Math.floor(Math.random() * 1000) + 1;
            if (user_id_like !== user_id_liked) {
                let values = [user_id_like, user_id_liked];
                await pool.query(text, values);
                // Get number of like on profile
                text = 'SELECT likes FROM profile WHERE user_id = $1;';
                values = [user_id_liked];
                await pool.query(text,values);
                // Add like
                text = 'UPDATE profile SET likes = likes + 1 WHERE user_id = $1;'
                values = [user_id_liked]
                await pool.query(text, values);
                }
        }
        return res.status(200).json({
            warnings: ["500 profiles were successfully created"]
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Error during create profiles.."]
        })
    }
}

exports.matchAppFaker = matchAppFaker;