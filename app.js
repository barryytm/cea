'use strict';

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);



// configure environemnt
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname + 'js')));
app.use('/css', express.static(path.join(__dirname + 'css')));

// start the server
const port = process.env.PORT || 1337;
server.listen(port, () => {
	console.log('listen on port ' + port);
});

app.get('/', (req, res) => {
    res.render('index');
})
// connect to db
require('./db');

