'use strict';

const pg = require('pg');
const url = require('url');

// set up env
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

// connect to heroku pg
const pool = new pg.Pool(config);

pool
    .query('select * from students')
    .then(res => {
        console.log('hello from', res.rows[1].username);
    })
    .catch(e => {
        console.error('query error', e.message, e.stack);
    });