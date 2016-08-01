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

    getAllDept: (result) => {
        pool.query('select dept_name from departments', (err, res) => {
            result(res.rows);
        });
    },

    getDeptTopics: (deptName, result) => {
        pool.query('select distinct topic from departments natural join courses' +
            'natural join course_topics natural join topics where dept_name=$1',
            [deptName], (err, res) => {
                result(res.rows);
        });
    },

    addExperience: (username, edition) => {
        var code = edition.code;
        var deptCode = code.substr(0, 3);
        var courseNumber = code.substr(3, 3);
        var foundCourse;
        var courseId;

        pool.query('select count(1) from courses where dept_code=$1 and course_number=$2', 
        [deptCode, courseNumber], (err, res) => {
            foundCourse = res.rows[0] === 1 ? true : false;
            console.log('first');
        });

        if (foundCourse) {
            pool.query('select course_id from courses where dept_code=$1 and course_number=$2',
            [deptCode, courseNumber], (err, res) => {
                courseId = res.rows[0].course_id;
                console.log('second');
            });
        } else {
            pool.query('insert into courses values ((select max(course_id) from courses) + 1, $1, $2) returning course_id', 
            [deptCode, courseNumber], (err, res) => {
                courseId = res.rows[0].course_id;
                console.log('third');
            });
        }

        console.log('fouth',courseId);
    }
};
