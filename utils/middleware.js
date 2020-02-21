const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;
const lib = require('../controllers/lib.js');

const withAuth = function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(400).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) {
                res.status(400).send('Unauthorized: Invalid token');
            } else {
                res.locals.email = decoded.email;
                await lib.setUserLastConnection(await lib.getUserId(decoded.email), 1);
                next();
            }
        });
    }
};

module.exports = withAuth;