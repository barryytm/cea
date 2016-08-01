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
    ssl: true,
    idleTimeoutMillis: 1000
};

// connect to heroku pg
const pool = new pg.Pool(config);

module.exports = {
    checkUsername: (username, cb) => {
        pool.query('select username from students where username=$1',
            [username], (err, res) => {
            cb(res.rows[0]);
        });
    },

    addInfo: (username, country, age, gender) => {
        pool.query('insert into students values ($1, 0, $2, $3, $4)',
            [username, age, gender, country]);
    },


    getDeptTopics: (result) => {
        pool.query('select distinct dept_name, topic from departments ' +
            'natural join courses natural join course_topics natural join topics',
            (err, res) => {
            result(res.rows);
        });
    }

};
