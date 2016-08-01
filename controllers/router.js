'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/db');

// global variables
var userInterests = {};

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
    db.getCourses(result => {
        var data = {courses: []};
        for (var i = 0; i < result.length; i++) {
            data.courses.push(result[i].dept_code + result[i].course_number);
        }
        data.courses.sort();
        res.send(data);
    });
});

router.post('/data', (req, res) => {
    var username = req.body.username;
    var editions = req.body.editions;

    editions.forEach((edition) => {
        db.addExperience(username, edition);
    });

    res.end();
});

router.post('/topicSkill', (req, res) => {
    var username = req.body.username;
    var topicSkills = req.body.ts;

    topicSkills.forEach((topicSkill) => {
        db.addTopicSkill(username, topicSkill);
    });

    res.end();
});

router.get('/deptTopics', (req, res) => {
	db.getDeptTopics(result => {
		var data = {};
		for (var i = 0; i < result.length; i ++) {
			if (! data.hasOwnProperty(result[i].dept_name)) {
				data[result[i].dept_name] = [];
			}
			data[result[i].dept_name].push(result[i].topic);
		}
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

    console.log(userInterests);

    res.end();
});

module.exports = router;
