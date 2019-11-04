const account = require('./account/lib.js');

module.exports = function (app) {
    app.post('/login', account.login);
    app.post('/signup',account.signup);
    app.post('/checkMail', account.checkMail);
    app.post('/getEditProfilValues', account.getEditProfilValues);
    app.post('/updateEditProfilValues', account.updateEditProfilValues);
}