const account = require('./account/lib.js');

module.exports = function (app) {
    app.post('/login', account.login);
    app.post('/signup',account.signup);
    app.post('/checkMail', account.checkMail);
    app.post('/getProfilValues', account.getEditProfilValues);
    app.post('/updateProfil', account.updateProfilValues);
}