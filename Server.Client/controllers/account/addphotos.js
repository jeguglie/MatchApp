const Profil = require('../../schema/schemaProfil');
const {Pool} = require('pg');
const config = require("../../config/config");
const pool = new Pool({
    user: 'jv',
    host: 'localhost',
    database: 'api',
    password: '06245547Jv345102.',
    port: 5432,
});


async function uploadPhoto(req, res) {
    try {
        const user_id = req.body.user_id;
        const pathImg = req.file.path;
        const fsize = req.file.size;
        // Check File Size
        const file = Math.round((fsize / 1024));
        if (file >= 4096) {
            return res.status(200).json({
                warnings: ["File is too big. Max limit is 4Mb"]
            });
        }
        // Check if user already upload images
        let text = 'SELECT * FROM pictures WHERE user_id = $1';
        let values = [user_id];
        let response = await pool.query(text,values);
        if (response.rows.length + 1 > 5)
            return res.status(200).json({
                warnings: ["Number limit of images is 5"]
            });
        // Add image row
        text = 'INSERT INTO pictures(user_id, img_link) VALUES ($1, $2)';
        values = [user_id, pathImg];
        await pool.query(text, values);
        return res.status(200).json({
            warnings: ["Image successfully uploaded"],
            save: true
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            warnings: ["Error during file upload"]
        });
    }
}

async function getPhotos(req, res) {
    try {
        const user_id = req.body.user_id;
        const text = 'SELECT * FROM pictures WHERE user_id = $1';
        const values = [user_id];
        const response = await pool.query(text, values);
        if (response.rows.length > 0)
            return res.status(200).json({
                profileImg: response.rows
            });
        return res.status(200).json({
            profileImg: []
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            warnings: ["Error"]
        });
    }
}

exports.uploadPhoto = uploadPhoto;
exports.getPhotos = getPhotos;