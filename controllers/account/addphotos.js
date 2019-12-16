const account = require('./lib.js');
const pool = require('./../../utils/queries');


async function uploadPhoto(req, res) {
    const user_id = await account.getUserId(res.locals.email);
    if (user_id === null)
        return res.status(500).json({
            warnings: ["User ID not found, please logout and login."]
        });
    try {
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
        let response = await pool.query(text, values);
        if (response.rows.length + 1 > 5)
            return res.status(200).json({
                warnings: ["Number limit of images is 5"]
            });
        // Add image row and image order
        text = 'INSERT INTO pictures(user_id, img_link, img_order) VALUES ($1, $2, $3)';
        values = [user_id, pathImg, response.rows.length + 1];
        await pool.query(text, values);
        return res.status(200).json({
            warnings: ["Image successfully uploaded"],
            save: true
        });
    } catch (error) {
        return res.status(500).json({
            warnings: ["Error during file upload"]
        });
    }
}

async function getPhotos(req, res) {
    const user_id = await account.getUserId(res.locals.email);
    if (user_id === null)
        return res.status(500).json({
            warnings: ["User ID not found, please logout and login."]
        });
    try {
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

async function deleteImage(req, res) {
    const user_id = await account.getUserId(res.locals.email);
    if (user_id === null)
        return res.status(500).json({
            warnings: ["User ID not found, please logout and login."]
        });
    try {
        let img_id = req.body.imgID
        let text = 'SELECT img_id FROM pictures WHERE img_id = $1 AND user_id = $2';
        let values = [img_id, user_id];
        let response = await pool.query(text, values);
        if (response.rows.length < 1)
            return res.status(400).json({
                warnings: ["You are not able to delete this image"]
            });
        text = 'DELETE FROM pictures WHERE img_id = $1 AND user_id = $2';
        values = [img_id, user_id];
        await pool.query(text, values);
        return res.status(200).json({
            warnings: ["Your images was successfully deleted"]
        });
    } catch (error) {
        return res.status(500).json({
            warnings: ["Error"]
        });
    }
}

exports.uploadPhoto = uploadPhoto;
exports.getPhotos = getPhotos;
exports.deleteImage = deleteImage;