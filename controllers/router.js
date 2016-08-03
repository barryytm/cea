'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/db');

// global variables
var userInterests = {};
var userSkills = {};

// start routers
router.get('/', (req, res) => {
    res.render('index');
});

router.post('/login', (req, res) => {
    db.checkUsername(req.body.username, result => {
        res.send(result);
    });
});

router.post('/info', (req, res) => {
    var body = req.body;

    db.addInfo(body.username, body.country, body.age, body.gender);
    res.end();
});

router.get('/courses', (req, res) => {
    db.getCourses(results => {
        var data = {courses: []};

        results.forEach(result => {
            data.courses.push(result.dept_code + result.course_number);
        });

        data.courses.sort();
        res.send(data);
    });
});

router.get('/deptTopics', (req, res) => {
	db.getDeptTopics(results => {
		var data = {};

		results.forEach(result => {
			if (! data.hasOwnProperty(result.dept_name)) {
				data[result.dept_name] = [];
			}
			data[result.dept_name].push(result.topic);
        });

		res.send(data);
	});
});

router.get('/deptSkills', (req, res) => {
    db.getDeptSkills(results => {
        var data = {};

		results.forEach(result => {
			if (! data.hasOwnProperty(result.dept_name)) {
				data[result.dept_name] = [];
			}
			data[result.dept_name].push(result.skill);
        });
		res.send(data);
    });
});

router.post('/topicInterest', (req, res) => {
	var data = req.body;
    var currUsername = data.username;
    var currTopic = data.topic;
    var currInterestRating = data.interestRating;

    if (! userInterests.hasOwnProperty(currUsername)) {
        userInterests[currUsername] = [];
        userInterests[currUsername].push(data);
    } else {
        var change = false;
        for (var i = 0; i < userInterests[currUsername].length; i ++) {
            if (userInterests[currUsername][i].topic === currTopic) {
                userInterests[currUsername][i].interestRating = currInterestRating;
                change = true;
            }
        }
        if (! change) {
            userInterests[currUsername].push(data);
        }
    }

    res.end();
});

router.post('/skills', (req, res) => {
	var data = req.body;
    var currUsername = data.username;
    var currSkill = data.skill;
    var currSkillRating = data.skillRating;

    if (! userSkills.hasOwnProperty(currUsername)) {
        userSkills[currUsername] = [];
        userSkills[currUsername].push(data);
    } else {
        var change = false;
        for (var i = 0; i < userSkills[currUsername].length; i ++) {
            if (userSkills[currUsername][i].skill === currSkill) {
                userSkills[currUsername][i].skillRating = currSkillRating;
                change = true;
            }
        }
        if (! change) {
            userSkills[currUsername].push(data);
        }
    }

    console.log(userSkills);

    res.end();
});

router.post('/data', (req, res) => {
    var username = req.body.username;
    var editions = req.body.editions;

    editions.forEach(edition => {
        db.addExperience(username, edition);
    });

    res.end();
});

router.get('/allTopics', (req, res) => {
    db.getAllTopics(results => {
        var data = {topics: []};
        results.forEach(result => {
            data.topics.push(result.topic);
        });
        res.send(data);
    });
});

router.post('/newTopics', (req, res) => {
    var topics = req.body.topics;

    topics.forEach(topic => {
        db.addTopic(topic);
    });
    res.end();
});

router.get('/allSkills', (req, res) => {
    db.getAllSkills(results => {
        var data = {skills: []};
        results.forEach(result => {
            data.skills.push(result.skill);
        });
        res.send(data);
    });
});

router.post('/newSkills', (req, res) => {
    var skills = req.body.skills;

    skills.forEach(skill => {
        db.addSkill(skill);
    });
    res.end();
});

router.post('courseTopics', (req, res) => {
    var courseId = req.body.courseId;

    db.getCourseTopics(courseCode, result => {
        res.send(result);
    });
});

router.post('courseSkills', (req, res) => {
    var courseId = req.body.courseId;

    db.getCourseSkills(courseCode, result => {
        res.send(result);
    });
});

module.exports = router;
