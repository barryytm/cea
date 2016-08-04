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
    var disArray = [], userStr = '{';

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

    db.computeTable(username, topicStr, skillStr, (results, avg, activeUser) => {
        var filtered = {};

        if (activeUser.gender === null) {
            activeUser.gender = 0.44;
        } else if (activeUser.gender === 'm') {
            activeUser.gender = 1;
        } else {
            activeUser.gender = 0;
        }
        
        results.forEach(result => {
            // identify user
            var currUsername = result.username;

            if (!filtered.hasOwnProperty(currUsername)) {
                filtered[currUsername] = {};
            }

            // push age, gender and country
            var user = filtered[currUsername];
            
            user.age = result.age === null ? avg : result.age;

            if (result.gender === null) {
                user.gender = 0.44;
            } else if (result.gender === 'm') {
                user.gender = 1;
            } else {
                user.gender = 0;
            }

            user.country = result.native_country === null ? 'na' : result.native_country;
        
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

            // compute distance
            var distance = 0;
            distance += Math.pow(filtered[user].age - activeUser.age, 2);
            distance += Math.pow(filtered[user].gender - activeUser.gender, 2);
            distance += (filtered[user].country === activeUser.native_country ? 0 : 1);

            for (var keyT in topicTotal) {
                if (!topics.hasOwnProperty(keyT)) {
                    distance += 25;
                } else {
                    distance += Math.pow(topics[keyT] - topicTotal[keyT], 2);
                }
            }

            for (var keyS in skillTotal) {
                if (!skills.hasOwnProperty(keyS)) {
                    distance += 25;
                } else {
                    distance += Math.pow(skills[keyS] - skillTotal[keyS], 2);
                }
            }
            disArray.push([filtered[user], distance]);
        }
        // console.log(filtered);
        disArray.sort((a, b) => {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] < b[1]) ? -1 : 1;
            }
        });

        // limit to at most 14 suers
        if (disArray.length >= 14) {
            disArray.splice(14);
        }
        // disArray.forEach((val) => {
        //     console.log(val[1]);
        // });
        disArray.forEach(val => {
            userStr += val[0] + ', ';
        });

        userStr = userStr.slice(0, -2) + '}';
        db.findCourses(userStr, results => {

        });
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
