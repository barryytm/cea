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
    checkUsername: (username, callback) => {
        pool.query('select username from students where username=$1',
            [username], (err, res) => {
            callback(res.rows[0]);
        });
    },

    addInfo: (username, country, age, gender) => {
        pool.query('insert into students values ($1, 0, $2, $3, $4)',
            [username, age, gender, country]);
    },

    getCourses: (callback) => {
        pool.query('select dept_code, course_number from courses', (err, res) => {
            callback(res.rows);
        });
    },

    getDeptTopics: (result) => {
        pool.query('select distinct dept_name, topic from departments ' +
            'natural join courses natural join course_topics natural join topics',
            (err, res) => {
            result(res.rows);
        });
    },

    addExperience: (username, edition) => {
        var code = edition.code;
        var deptCode = code.substr(0, 3);
        var courseNumber = code.substr(3, 3);
        var foundCourse, courseId, foundEdition, editionId, already, letterGrade;

        pool.query('select count(1) from courses where dept_code=$1 and course_number=$2',
        [deptCode, courseNumber], (err, res) => {
            console.log('1');
            foundCourse = res.rows[0] === 1 ? true : false;
            
        });

        if (foundCourse) {
            pool.query('select course_id from courses where dept_code=$1 and course_number=$2',
            [deptCode, courseNumber], (err, res) => {
                console.log('2');
                courseId = res.rows[0].course_id;
                
            });
        } else {
            pool.query('insert into courses values ((select max(course_id) from courses) + 1, $1, $2) returning course_id',
            [deptCode, courseNumber], (err, res) => {
                console.log('3');
                courseId = res.rows[0].course_id;
                
            });
        }

        pool.query('select count(1) from course_editions where course_id=$1, semester=$2, year=$3, time_day=$4',
        [courseId, edition.semester, edition.year, edition.timeOfDay], (err, res) => {
            console.log('4', courseId);
            foundEdition = res.rows[0] === 1 ? true : false;
            
        });

        if (foundEdition) {
            pool.query('select edition_id from course_editions where course_id=$1, semester=$2, year=$3, time_day=$4',
            [courseId, edition.semester, edition.year, edition.timeOfDay], (err, res) => {
                console.log('5');
                editionId = res.rows[0].edition_id;
                
            });
        } else {
            pool.query('insert into course_editions values ((select max(edition_id) from course_editions) + 1,' + 
            '$1, $2, $3, null, $4) returning edition_id',
            [courseId, edition.semester, edition.year, edition.timeOfDay], (err, res) => {
                console.log('6');
                editionId = res.rows[0].edition_id;
            });
        }

        pool.query('select letter_grade from letter_grades where max_grade = (select min(max_grade) from letter_grades where max_grade >= $1)',
        [edition.grade], (err, res) => {
            console.log('7');
            letterGrade = res.rows[0].letter_grade;
            
        });

        pool.query('select count(1) from enrollments where edition_id=$1 and username=$2', 
        [editionId, username], (err, res) => {
            console.log('8');
            already = res.rows[0] === 1 ? true : false;
            
        });

        if (already) {
            pool.query('update enrollments set letter_grade=$1, course_ranking=$2,' + 
            'instr_ranking=$3 where edition_id=$4 and username=$5 returning edition_id',
            [letterGrade, edition.courseRank, edition.instructorRank, editionId, username], (err, res) => {
                console.log('9');
                res.rows[0].edition_id;
                
            });
        } else {
            pool.query('insert into enrollments values ($1, $2, $3, $4, $5) returning edition_id', 
            [editionId, username, letterGrade, edition.courseRank, edition.instructorRank], (err, res) => {
                console.log('10');
                res.rows[0].edition_id;
                
            });
        }
    },

    getUserCoursesEdition: (username, result) => {
        pool.query('select topic_id, course_id from enrollments where username=$1',
            [username], (err, res) => {
            result(res.rows);
        });
    },

    addTopicRating: (courseId, editionId, username, topic, interestBefore, interestAfter) => {
        var topicId;

        pool.query('select topic_id from topics where topic=$1', [topic],
            (err, res) => {
                topic_id = res.rows[0];
        });

        pool.query('insert into topic_interests values($1, $2, $3, $4, $5, $6)',
            [courseId, editionId, username, topicId, interestBefore, interestAfter]);
    }
};
