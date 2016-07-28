'use strict';

// require modules
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

module.exports = {
    checkUsername: function(username, cb) {
        pool
            .query('select count(1) from students where username=$1', [username])
            .then(res => {
                cb(res.rows[0].count);
            })
            .catch(e => {
                console.error('query error', e.message, e.stack);
            });
    }
};
