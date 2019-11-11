const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});
const db = require('./config/keys').mongoURI;
const app = express();

mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false})
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((e) => {
        console.log("Error while DB connecting");
        console.log(e);
    });

app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(cors());
app.use('/public', express.static('public'));
app.use("/user", router);
require(path.join(__dirname + "/controllers/userController"))(router);


const port = 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));