'use strict';

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const pg = require('pg');
const url = require('url');

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


// connect to the database
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};

const pool = new pg.Pool(config);

pool.connect()
    .then(client => {
        client.query('select * from students')
            .then(res => {
                client.release();
                console.log('hello from', res.rows[0].username);
            })
    .catch(e => {
        client.release();
        console.error('query error', e.message, e.stack);
    });
});

