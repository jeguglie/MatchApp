const account = require('./lib.js');
const pool = require('./../utils/queries');
const multer = require('multer');
const DIR = './public/';
const uuid = require('uuid/v4');
require('dotenv').config();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid() + '-' + fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return false;
        }
    }
});

async function updatetotalimage(userID){

    try {
        let text = 'SELECT * FROM pictures WHERE user_id = $1';
        let value = [userID];
        let response = await pool.query(text, value);
        let number = 0;
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && typeof response.rows.length)
            number = response.rows.length;
        text = 'UPDATE user_complete SET complete_photos = $1 WHERE user_id = $2';
        value = [number * 5, userID];
        await pool.query(text, value);
        await account.updatetotalcomplete(userID);
        return (1);

    }catch (e){
        console.log(e);
        return (0);
    }
}

async function reorganizeImg(userID){
    try {
        let text = 'SELECT * FROM pictures WHERE user_id = $1 ORDER BY img_order ASC';
        let response = await pool.query(text, [userID]);
        let nbr = 0;
        if (typeof response !== 'undefined' && typeof response.rows !== 'undefined' && response.rows.length) {
            nbr = response.rows.length;
            for (let i = 0; i < nbr; i++) {
                await pool.query('UPDATE pictures SET img_order = $1 WHERE img_id = $2', [i, response.rows[i].img_id]);
            }
        }

        return true;
    } catch (e){
        console.log(e);
        return false;
    }

    return false;
}

async function uploadPhoto(req, res) {
    const user_id = await account.getUserId(res.locals.email);
    if (user_id === null)
        return res.status(400).json({
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
        let img_order = response.rows.length < 1 ? 0 : response.rows.length + 1;
        // Add image row and image order
        text = 'INSERT INTO pictures(user_id, img_link, img_order) VALUES ($1, $2, $3)';
        values = [user_id, process.env.SERVER_LOCALHOST === JSON.stringify(false) ? 'https://matchappli.herokuapp.com/api/' + pathImg : 'http://localhost:5000/api/' + pathImg, img_order];
        await pool.query(text, values);
        await updatetotalimage(user_id);
        await reorganizeImg(user_id);
        return res.status(200).json({
            warnings: ["Image successfully uploaded"],
            save: true
        });
    } catch (error) {
        return res.status(400).json({
            warnings: ["Error during file upload"]
        });
    }
}

async function getPhotos(req, res) {
    const user_id = await account.getUserId(res.locals.email);
    if (user_id === null)
        return res.status(400).json({
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
        await updatetotalimage(user_id);
        return res.status(200).json({
            profileImg: []
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            warnings: ["Error"]
        });
    }
}

async function deleteImage(req, res) {
    const user_id = await account.getUserId(res.locals.email);
    if (user_id === null)
        return res.status(400).json({
            warnings: ["User ID not found, please logout and login."]
        });
    try {
        let img_id = req.body.imgID;
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
        await updatetotalimage(user_id);
        await reorganizeImg(user_id);
        return res.status(200).json({
            warnings: ["Your images was successfully deleted"]
        });
    } catch (error) {
        return res.status(400).json({
            warnings: ["Error"]
        });
    }
}

exports.uploadPhoto = uploadPhoto;
exports.storage = storage;
exports.upload = upload;
exports.getPhotos = getPhotos;
exports.deleteImage = deleteImage;