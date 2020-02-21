const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

const withAuthAdmin = function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(400).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) {
                res.status(400).send('Unauthorized: Invalid token');
            } else if (decoded.email === 'admin@gmail.com') {
                res.locals.email = decoded.email;
                next();
            }
        });
    }
};

module.exports = withAuthAdmin;