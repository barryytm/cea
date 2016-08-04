'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models/db');

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

router.post('/recommendations', (req, res) => {
    var username = req.body.username;
    var topicTotal = req.body.deptListTopics;
    var skillTotal = req.body.deptListSkills;
    var topicStr = '{', skillStr = '{';

    // concatenate topics
    for (var keyT in topicTotal) {
        topicStr += keyT + ', ';
    }
    topicStr = topicStr.slice(0, -2) + '}';

    // concatenate skills
    for (var keyS in skillTotal) {
        skillStr += keyS + ', ';
    }
    skillStr = skillStr.slice(0, -2) + '}';

    db.computeTable(username, topicStr, skillStr, results => {
        var filtered = {};
        results.forEach(result => {
            // identify user
            var currUsername = result.username;

            if (!filtered.hasOwnProperty(currUsername)) {
                filtered[currUsername] = {};
            }

            // push age, gender and country
            var user = filtered[currUsername];
            user.age = result.age;
            user.gender = result.gender === 'm' ? 1 : 0;
            user.country = result.native_country;

            // push topic and interest
            if (!user.hasOwnProperty('topics')) {
                user.topics = {};
            }
            var topics = user.topics;
            var topic = result.topic;
            var interest = result.interest_before;

            if (!topics.hasOwnProperty(topic)) {
                topics[topic] = [];
            }
            topics[topic].push(interest);

            // push skill and rank
            if (!user.hasOwnProperty('skills')) {
                user.skills = {};
            }
            var skills = user.skills;
            var skill = result.skill;
            var rank = result.rank_before;

            if (!skills.hasOwnProperty(skill)) {
                skills[skill] = [];
            }
            skills[skill].push(rank);
        });

        // compute average and clean up data
        for(var user in filtered) {
            var topics = filtered[user].topics;
            for (var topic in topics) {
                var interests = topics[topic];
                var totalT = 0;
                
                for (var i = 0; i < interests.length; i++) {
                    totalT += interests[i];
                }
                topics[topic] = totalT / interests.length;
            }

            var skills = filtered[user].skills;
            for (var skill in skills) {
                var ranks = skills[skill];
                var totalS = 0;
                
                for (var j = 0; j < ranks.length; j++) {
                    totalS += ranks[j];
                }
                skills[skill] = totalS / ranks.length;
            }
        }
    });
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

router.post('/courseTopics', (req, res) => {
    var courseCode = req.body.code;

    db.getCourseTopics(courseCode, result => {
        res.send(result);
    });
});

router.post('/courseSkills', (req, res) => {
    var courseCode = req.body.code;

    db.getCourseSkills(courseCode, result => {
        res.send(result);
    });
});

module.exports = router;
