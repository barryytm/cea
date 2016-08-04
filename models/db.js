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

// log error from idle clients (rare)
pool.on('error',  (err) => {
    console.error('idle client error', err.message, err.stack);
});

// connect to pg-native to use sync
const Client = require('pg-native');
const client = new Client();
client.connectSync(process.env.DATABASE_URL);

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

    getDeptSkills:(result) => {
        pool.query('select distinct dept_name, skill from departments ' +
            'natural join courses natural join course_skills natural join skills',
            (err, res) => {
            result(res.rows);
        });
    },

    computeTable: (username, topicStr, skillStr, callback) => {
        var str, arr;

        // check number of variables, 1 is for the '}'
        if (topicStr.length === 1 && skillStr.length === 1) {
            str = 'where username<>$1';
            arr = [username];
        } else if (topicStr.length === 1) {
            str = 'where username<>$1 and skill = any($2)';
            arr = [username, skillStr];
        } else if (skillStr.length === 1) {
            str = 'where username<>$1 and topic = any($2)';
            arr = [username, topicStr];
        } else {
            str = 'where username<>$1 and (topic = any($2) or skill = any($3))';
            arr = [username, topicStr, skillStr];
        }
        
        var rows = client.querySync('select distinct username, age, gender, native_country, skill,' +
        'rank_before, topic, interest_before from students natural join topics ' +
        'natural join skills natural join skill_rankings natural join topic_interests ' + str, arr);

        var avg = client.querySync('select avg(age) from students')[0].avg;
        var activeUser = client.querySync('select * from students where username=$1', [username])[0];
            
        callback(rows, avg, activeUser);
    },

    addExperience: (username, edition) => {
        var deptCode = edition.code.slice(0, 3);
        var courseNumber = edition.code.slice(3);

        // search for the course
        var foundCourse = client.querySync('select count(1) from courses where dept_code=$1 and course_number=$2',
        [deptCode, courseNumber])[0].count;

        var courseId = parseInt(foundCourse, 10) ?
            client.querySync('select course_id from courses where dept_code=$1 and course_number=$2',
            [deptCode, courseNumber])[0].course_id :
            client.querySync('insert into courses values ((select max(course_id) from courses) + 1, $1, $2) returning course_id',
            [deptCode, courseNumber])[0].course_id;

        // search for the edition
        var foundEdition = client.querySync('select count(1) from course_editions where course_id=$1 and semester=$2 and year=$3 and time_day=$4',
        [courseId, edition.semester, edition.year, edition.timeOfDay])[0].count;

        var editionId = parseInt(foundEdition, 10) ?
            client.querySync('select edition_id from course_editions where course_id=$1 and semester=$2 and year=$3 and time_day=$4',
            [courseId, edition.semester, edition.year, edition.timeOfDay])[0].edition_id :
            client.querySync('insert into course_editions values ((select max(edition_id) from course_editions) + 1,' +
            '$1, $2, $3, null, $4) returning edition_id',
            [courseId, edition.semester, edition.year, edition.timeOfDay])[0].edition_id;

        // convert to letter grade
        var letterGrade = client.querySync('select letter_grade from letter_grades where max_grade = (select min(max_grade) from letter_grades where max_grade >= $1)',
        [edition.grade])[0].letter_grade;

        // search for enrollment
        var already = client.querySync('select count(1) from enrollments where edition_id=$1 and username=$2',
        [editionId, username])[0].count;

        parseInt(already, 10) ?
            client.querySync('update enrollments set letter_grade=$1, course_ranking=$2,' +
            'instr_ranking=$3 where edition_id=$4 and username=$5',
            [letterGrade, edition.courseRank, edition.instructorRank, editionId, username]) :
            client.querySync('insert into enrollments values ($1, $2, $3, $4, $5)',
            [editionId, username, letterGrade, edition.courseRank, edition.instructorRank]);

        for (var key in edition.allTopicRankings) {
            var topicId = client.querySync('select topic_id from topics where topic=$1', [key])[0]['topic_id'];
            var topicBefore = edition.allTopicRankings[key][0];
            var topicAfter = edition.allTopicRankings[key][1];

            var exists = client.querySync('select count(1) from topic_interests where username=$1 ' +
                'and edition_id=$2 and topic_id=$3', [username, editionId, topicId])[0]['count'];

            if (parseInt(exists, 10)) {
                client.querySync('update topic_interests set interest_before=$4, interest_after=$5 ' +
                'where username=$1 and edition_id=$2 and topic_id=$3', [username, editionId, topicId, topicBefore, topicAfter]);
            } else {
                client.querySync('insert into topic_interests values ($1, $2, $3, $4, $5, $6)',
                    [courseId, editionId, username, topicId, topicBefore, topicAfter]);
            }
         }

         for (var key in edition.allSkillRankings) {
             var skillId = client.querySync('select skill_id from skills where skill=$1', [key])[0]['skill_id'];
             var skillBefore = edition.allSkillRankings[key][0];
             var skillAfter = edition.allSkillRankings[key][1];

             var exists = client.querySync('select count(1) from skill_rankings where username=$1 ' +
                'and edition_id=$2 and skill_id=$3', [username, editionId, skillId])[0]['count'];

            if (parseInt(exists, 10)) {
                client.querySync('update skill_rankings set rank_before=$4, rank_after=$5 ' +
                'where username=$1 and edition_id=$2 and skill_id=$3', [username, editionId, skillId, skillBefore, skillAfter]);
            } else {
                client.querySync('insert into skill_rankings values ($1, $2, $3, $4, $5, $6)',
                    [courseId, editionId, username, skillId, skillBefore, skillAfter]);
            }

         }
    },

    getAllTopics: (callback) => {
        pool.query('select topic from topics', (err, res) => {
            callback(res.rows);
        });
    },

    addTopic: (topic) => {
        pool.query('insert into topics values ((select max(topic_id) from topics) + 1, $1)', [topic]);
    },

    getAllSkills: (callback) => {
        pool.query('select skill from skills', (err, res) => {
            callback(res.rows);
        });
    },

    addSkill: (skill) => {
        pool.query('insert into skills values ((select max(skill_id) from skills) + 1, $1)', [skill]);
    },

    getCourseTopics: (courseCode, callback) => {
        var deptCode = courseCode.slice(0, 3);
        var courseNumber = courseCode.slice(3);

        pool.query('select topic from topics natural join course_topics natural join courses where dept_code=$1 and course_number=$2',
            [deptCode, courseNumber], (err, res) => {
                callback(res.rows);
            });

    },

    getCourseSkills: (courseCode, callback) => {
        var deptCode = courseCode.slice(0, 3);
        var courseNumber = courseCode.slice(3);

        pool.query('select skill from skills natural join course_skills natural join courses where dept_code=$1 and course_number=$2',
            [deptCode, courseNumber], (err, res) => {
                callback(res.rows);
            });
    },

    getCourseId: (deptCode, courseNum, callback) => {
        pool.query('select course_id from courses where dept_code=$1 and course_number=$2',
            [deptCode, courseNum], (err, res) => {
                callback(res.rows[0]);
            });
    }
};
