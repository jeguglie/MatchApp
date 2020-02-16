const express = require("express");
const app = express();
require('./controllers/sockets');
const path = require('path');
const host = '0.0.0.0';
const port = process.env.PORT || 5000;
const router = require('./utils/router');

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build/')));
app.use('/api', router);
// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './client/build/', 'index.html'));
});
app.listen(process.env.PORT || 5000, host, () => console.log(`Server listening on port ${port}`));