const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');
const withAuth = require('./middleware');
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use("/user", router);
require(path.join(__dirname + "/controllers/userController"))(router);


const port = 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));