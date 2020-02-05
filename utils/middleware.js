const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const withAuth = function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(400).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.status(400).send('Unauthorized: Invalid token');
            } else {
                res.locals.email = decoded.email;
                next();
            }
        });
    }
};

// const checkUserOnline = function(req, res, next) {
//     const token = req.cookies.token;
//     if (!token) {
//         res.status(401).send('Unauthorized: No token provided');
//     } else {
//         jwt.verify(token, secret, function(err, decoded) {
//             if (err) {
//                 res.status(401).send('Unauthorized: Invalid token');
//             } else {
//                 res.locals.email = decoded.email;
//                 next();
//             }
//         });
//     }
// };

module.exports = withAuth;