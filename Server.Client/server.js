const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});
const app = express();

app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(cors());
app.use('/public', express.static('public'));
app.use("/user", router);
require(path.join(__dirname + "/controllers/userController"))(router);


const port = 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));