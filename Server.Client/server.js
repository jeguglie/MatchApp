const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const app = express();
const cors = require('cors');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/public', express.static('public'));
app.use("/user", router);
require(path.join(__dirname + "/controllers/userController"))(router);


const port = 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));