'use strict';

// require modules
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const db = require('./db');

// configure environemnt
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname + 'js')));
app.use('/css', express.static(path.join(__dirname + 'css')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// start the server
const port = process.env.PORT || 1337;
server.listen(port, () => {
	console.log('listen on port ' + port);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/login', (req, res) => {
    var username = req.body.username;
    db.checkUsername(username, result => {
        res.send(result);
    });
});

app.post('/info', (req, res) => {
    var username = req.body.username;
    var country = req.body.country;
    var age = req.body.age;
    var gender = req.body.gender;

    db.addInfo(username, country, age, gender);
    res.end();
});

app.get('/allDept', (req, res) => {
	db.getAllDept(result => {
		res.write(result);
	});
});
