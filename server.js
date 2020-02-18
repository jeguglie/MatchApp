const express = require("express");
const app = express();
const path = require('path');
const host = process.env.PORT ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 5000;
const router = require('./utils/router');
const server = app.listen(process.env.PORT || 5000, host, () => console.log(`Server listening on port ${port}`));
var io = require('socket.io')();
require('./controllers/sockets');


// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build/')));

app.use('/api/public', express.static('public'));
app.use('/api', router);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './client/build/', 'index.html'));
});
