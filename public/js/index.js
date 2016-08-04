// custom event trigger for show/hide
// http://viralpatel.net/blogs/jquery-trigger-custom-event-show-hide-element/
(function($) {
	  $.each(['show', 'hide'], function(i, ev) {
	    var el = $.fn[ev];
	    $.fn[ev] = function () {
	        this.trigger(ev);
	        return el.apply(this, arguments);
	    };
    });
})(jQuery);

// class containing helper methods
class Helper {
    snack(msg) {
        $('#snackbar').text(msg).addClass('show');

        setTimeout(() => {
            $('#snackbar').removeClass('show');
        }, 2000);
    }

    populateEditions(courses) {
        $.each(courses, (idx, code) => {
            var id = 'collapse' + code;
            var $first = $('<section/>').addClass('panel panel-default longer');
            var $second = $('<section/>').addClass('panel-heading');
            var $third = $('<section/>').addClass('panel-title');
            var $title = $('<a/>')
                .addClass('collapsed')
                .text(code)
                .attr({
                    'data-toggle': 'collapse',
                    'data-parent': '#dataForm',
                    'href': '#' + id
                });

            var $semesterLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Semester');
            var $semester = $('<input/>')
                .addClass('form-control')
                .prop('required', true)
                .attr({
                    id: 'semester' + code,
                    type: 'text',
                    placeholder: 'f|w|s',
                    pattern: 'f|w|s',
                    title: 'should only be f, w or s'
                });

            var $yearLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Year');
            var $year = $('<input/>')
                .addClass('form-control')
                .prop('required', true)
                .attr({
                    id: 'year' + code,
                    type: 'number',
                    placeholder: '2016',
                    pattern: '\d+'
                });


            var $timeOfDayLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Time Of Day');
            var $timeOfDay = $('<input/>')
                .addClass('form-control')
                .prop('required', true)
                .attr({
                    id: 'timeOfDay' + code,
                    type: 'text',
                    placeholder: 'm|a|e',
                    pattern: 'm|a|e',
                    title: 'should only be m, a or e'
                });

            var $gradeLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Grade');
            var $grade = $('<input/>')
                .addClass('form-control')
                .prop('required', true)
                .attr({
                    id: 'grade' + code,
                    type: 'number',
                    placeholder: '0-100',
                    pattern: '\d+',
                    min: 0,
                    max: 100
                });

            var $courseRankLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Course Rank');
            var $courseRank= $('<input/>')
                .addClass('form-control')
                .prop('required', true)
                .attr({
                    id: 'courseRank' + code,
                    type: 'number',
                    placeholder: '1-5',
                    pattern: '\d+',
                    min: 1,
                    max: 5
                });

            var $instructorRankLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Instructor Rank');
            var $instructorRank= $('<input/>')
                .addClass('form-control')
                .prop('required', true)
                .attr({
                    id: 'instructorRank' + code,
                    type: 'number',
                    placeholder: '1-5',
                    pattern: '\d+',
                    min: 1,
                    max: 5
                });

			//topics
            var $courseTopicLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Topic');
            var $courseTopics = $('<select/>').addClass('sameLine');

			$.post('/courseTopics', {code: code}, result => {
	            for (var i = 0; i < result.length; i++) {
					var $topic = $('<option/>').attr({
						value: result[i].topic
					});
	                $topic.text(result[i].topic);
	                $courseTopics.append($topic);
					$courseTopics.attr({id: 'courseTopic' + code});
				}
	        });

			var $courseTopicsRankBefore = $('<input/>')
                .addClass('form-control sameLine')
                .attr({
                    id: 'courseTopicsRankBefore' + code,
                    type: 'number',
                    placeholder: '1-5',
                    pattern: '\d+',
                    min: 1,
                    max: 5
                });

			var $courseTopicsRankAfter = $('<input/>')
                .addClass('form-control sameLine')
                .attr({
                    id: 'courseTopicsRankAfter' + code,
                    type: 'number',
                    placeholder: '1-5',
                    pattern: '\d+',
                    min: 1,
                    max: 5
                });

			var $courseTopicButton = $('<input/>').attr({
				id: 'topicAdd' + code,
				type: 'button',
				value: 'add'
			});

			$courseTopicButton.addClass('btn btn-lg btn-success sameLine');

			var $courseTopicConatiner = $('<section/>');
			$courseTopicConatiner.addClass('sameLineContainer');
			$courseTopicConatiner.append($courseTopicLabel);
			$courseTopicConatiner.append($courseTopics);
			$courseTopicConatiner.append($courseTopicsRankBefore);
			$courseTopicConatiner.append($courseTopicsRankAfter);
			$courseTopicConatiner.append($courseTopicButton);

			//skills
            var $courseSkillLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Skill');
            var $courseSkills = $('<select/>').addClass('sameLine');
			$.post('/courseSkills', {code: code}, result => {
	            for (var i = 0; i < result.length; i++) {
					var $skill = $('<option/>').attr({
						id: 'courseSkill' + code,
						value: result[i].skill
					});
	                $skill.text(result[i].skill);
	                $courseSkills.append($skill);
					$courseSkills.attr({id: 'courseSkill' + code});
				}
	        });

			var $courseSkillRankBefore = $('<input/>')
                .addClass('form-control sameLine')
                .attr({
                    id: 'courseSkillRankBefore' + code,
                    type: 'number',
                    placeholder: '1-5',
                    pattern: '\d+',
                    min: 1,
                    max: 5
                });

			var $courseSkillRankAfter = $('<input/>')
                .addClass('form-control sameLine')
                .attr({
                    id: 'courseSkillRankAfter' + code,
                    type: 'number',
                    placeholder: '1-5',
                    pattern: '\d+',
                    min: 1,
                    max: 5
                });

			var $courseSkillButton = $('<input/>').attr({
				id: 'skillAdd' + code,
				type: 'button',
				value: 'add'
			});

			$courseSkillButton.addClass('btn btn-lg btn-success sameLine');

			var $courseSkillConatiner = $('<section/>');
			$courseSkillConatiner.addClass('sameLineContainer');
			$courseSkillConatiner.append($courseSkillLabel);
			$courseSkillConatiner.append($courseSkills);
			$courseSkillConatiner.append($courseSkillRankBefore);
			$courseSkillConatiner.append($courseSkillRankAfter);
			$courseSkillConatiner.append($courseSkillButton);

			var $content = $('<section/>').attr('id', id).addClass('panel-collapse collapse content');
            // add semester
            $('<section/>').addClass('form-group row')
            .append($semesterLabel)
            .append($('<section/>').addClass('col-md-6')
                .append($semester))
            .appendTo($content);

            // add year
            $('<section/>').addClass('form-group row')
            .append($yearLabel)
            .append($('<section/>').addClass('col-md-6')
                .append($year))
            .appendTo($content);

            // add time of day
            $('<section/>').addClass('form-group row')
            .append($timeOfDayLabel)
            .append($('<section/>').addClass('col-md-6')
                .append($timeOfDay))
            .appendTo($content);

            // add grade
            $('<section/>').addClass('form-group row')
            .append($gradeLabel)
            .append($('<section/>').addClass('col-md-6')
                .append($grade))
            .appendTo($content);

            // add course rank
            $('<section/>')
            .addClass('form-group row')
            .append($courseRankLabel)
            .append($('<section/>').addClass('col-md-6')
                .append($courseRank))
            .appendTo($content);

            // add instructor rank
            $('<section/>')
            .addClass('form-group row')
            .append($instructorRankLabel)
            .append($('<section/>').addClass('col-md-6')
                .append($instructorRank))
            .appendTo($content);

            // add topic
            $('<section/>').addClass('form-group row')
            .append($courseTopicConatiner)
            .append($('<section/>').addClass('col-md-6'))
            .appendTo($content);

            $('<section/>').addClass('form-group row')
            .append($courseSkillConatiner)
            .append($('<section/>').addClass('col-md-6'))
            .appendTo($content);


            $first
            .append($second
                .append($third
                    .append($title)))
            .append($content)
            .appendTo($('#dataForm'));
        });
    }
}

$(document).ready(() => {
    var helper = new Helper();
    var courses = [], oldTopics = [], oldSkills = [];
    var collected = {
        username: '',
        editions: [],
        topics: [],
        skills: [],
		deptListTopics: {},
		deptListSkills: {},
		allTopicRankings: {},
		allSkillRankings: {}
    };

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#courseForm').hide();
    $('#interestForm').hide();
    $('#skillForm').hide();
    $('#recommendForm').hide();
    $('#dataForm').hide();
    $('#newTopicForm').hide();
    $('#newSkillForm').hide();

    $('#loginForm').submit(() => {
        collected.username = $('#username').val();

        helper.snack('Logged in');

        $('#loginForm').hide();

        $.post('/login', {username: collected.username}, result => {
            $('#name').text(collected.username);
            if (!result) {
                $('#infoForm').show();
            } else {
                $('#courseForm').show();
            }
        });
    });

    $('#infoForm').submit(() => {
        var info = {
            username: collected.username,
            age: $('#age').val(),
            country: $('#country').val(),
            gender: $('#male').is(':checked') ? 'm' : 'f'
        };

        helper.snack('Submitted');

        $('#infoForm').hide();
        $('#courseForm').show();

        $.post('/info', info);
    });


    // course form
    $('#courseForm').on('show', () => {
        $.get('/courses', data => {
            $.each(data.courses, (idx, code) => {
                $('<li/>')
                .text(code)
                .attr('id', code)
                .appendTo('#courses');
            });
        });
    });

    $('#courses').click((event) => {
        var id = event.target.id;

        if ($('#' + id).hasClass('checked')) {
            helper.snack('Removed ' + id);
            $('#' + id).removeClass('checked');

            var idx = courses.indexOf(event.target.id);
            courses.splice(idx, 1);
        } else {
            helper.snack('Selected ' + id);
            $('#' + id).addClass('checked');

            courses.push(id);
        }
    });

    $('#courseForm').submit(() => {
        helper.snack('Submitted');

        $('#courseForm').hide();
        $('#interestForm').show();

        helper.populateEditions(courses);

        // get all the depts and topics
        $.get('/deptTopics', result => {
            for (var key in result) {
                var $dept = $('<option/>').attr('value', key);
                $dept.text(key);
                $('#departments').append($dept);
            }
            $('#departments').find('option:first').attr('selected', true);

            // first time
            var dept = $('#departments').find('option:first').val();
            for (var value in result[dept]) {
                var $topic = $('<option/>').attr('value', result[dept][value]);
                $topic.text(result[dept][value]);
                $('#topics').append($topic);
            }

            // otherwise
            $('#departments').change(function() {
                var dept = $('#departments').find(":selected").text();
                $('#topics').empty();
                for (var value in result[dept]) {
                    var $topic = $('<option/>').attr('value', result[dept][value]);
                    $topic.text(result[dept][value]);
                    $('#topics').append($topic);
                }
            });
        });
		$.each(courses, (idx, code) => {
            collected.editions.push({
                code: code,
            });
        });
    });

    $('#interestForm').submit(() => {
        var topic = $('#topics').find(':selected').text();
        var interestRating = $('#interestRating').val();

    	collected.deptListTopics[topic] = interestRating;
    });

    $('#startSkill').click(() => {
        // get all the depts and topics
        $.get('/deptSkills', result => {

            for (var key in result) {
                var $dept = $('<option/>').attr('value', key);
                $dept.text(key);
                $('#departmentsSkill').append($dept);
            }
            $('#departmentsSkill').find('option:first').attr('selected', true);

            // first time
            var dept = $('#departmentsSkill').find('option:first').val();
            for (var value in result[dept]) {
                var $skill = $('<option/>').attr('value', result[dept][value]);
                $skill.text(result[dept][value]);
                $('#skills').append($skill);
            }

            // otherwise
            $('#departmentsSkill').change(function() {
                var dept = $('#departmentsSkill').find(":selected").text();
                $('#skills').empty();
                for (var value in result[dept]) {
                    var $skill = $('<option/>').attr('value', result[dept][value]);
                    $skill.text(result[dept][value]);
                    $('#skills').append($skill);
                }
            });
        });

        $('#interestForm').hide();
        $('#skillForm').show();
    });

    $('#skillForm').submit(() => {
        var skill = $('#skills').find(':selected').text();
        var skillRating = $('#skillRating').val();

		collected.deptListSkills[skill] = skillRating;
    });

    $('#startRecommend').click(() => {
        $('#skillForm').hide();
        $('#recommendForm').show();
    });


    // recommend form
    $('#startData').click(() => {
        $('#recommendForm').hide();
        $('#dataForm').show();

		$.each(courses, (idx, code) => {
			$('#topicAdd' + code).click(() => {
				var topic = $('#courseTopic' + code).find(":selected").text();
				var topicBefore = $('#courseTopicsRankBefore' + code).val();
				var topicAfter = $('#courseTopicsRankAfter' + code).val();

				if (!topicBefore && !topicAfter) {
					for (var i = 0; i < collected.editions.length; i++) {
						if (collected.editions[i].code === code) {
							collected.editions[i].allTopicRankings = {};
							collected.editions[i].allTopicRankings[topic] = [];
							collected.editions[i].allTopicRankings[topic].push(topicBefore);
							collected.editions[i].allTopicRankings[topic].push(topicAfter);
						}
					}
				} else {
					helper.snack('topic ranking not complete');
				}
			});

			$('#skillAdd' + code).click(() => {
				var skill = $('#courseSkill' + code).find(":selected").text();
				var skillBefore = $('#courseSkillRankBefore' + code).val();
				var skillAfter = $('#courseSkillRankAfter' + code).val();

				if (!skillBefore && !skillAfter) {
					for (var i = 0; i < collected.editions.length; i++) {
						if (collected.editions[i].code === code) {
							collected.editions[i].allSkillRankings = {};
							collected.editions[i].allSkillRankings[skill] = [];
							collected.editions[i].allSkillRankings[skill].push(skillBefore);
							collected.editions[i].allSkillRankings[skill].push(skillAfter);
						}
					}
				} else {
					helper.snack('Skill ranking not complete');
				}
			});
		});
    });

    $('#recommendForm').on('show', () => {
        $.post('/recommendations', collected);
    });

    // data form
    $('#skipData').click(() => {
        $('#dataForm').hide();
        $('#newTopicForm').show();
        $.get('/allTopics', data => {
            $.each(data.topics, (idx, topic) => {
                oldTopics.push(topic);
            });
        });

        $.get('/allSkills', data => {
            $.each(data.skills, (idx, skill) => {
                oldSkills.push(skill);
            });
        });
    });

    $('#dataForm').submit(() => {
        helper.snack('Information Submitted');

        $('#dataForm').hide();
        $('#newTopicForm').show();

        $.each(courses, (idx, code) => {
			for (var i = 0; i < collected.editions.length; i++) {
				if (collected.editions[i].code === code) {
		                collected.editions[i].semester = $('#semester' + code).val();
		                collected.editions[i].year = $('#year' + code).val();
		                collected.editions[i].timeOfDay = $('#timeOfDay' + code).val();
		                collected.editions[i].grade = $('#grade' + code).val();
		                collected.editions[i].courseRank = $('#courseRank' + code).val();
		                collected.editions[i].instructorRank = $('#instructorRank' + code).val();
				}
			}
        });

        $.post('/data', collected);

        $.get('/allTopics', data => {
            $.each(data.topics, (idx, topic) => {
                oldTopics.push(topic);
            });
        });

        $.get('/allSkills', data => {
            $.each(data.skills, (idx, skill) => {
                oldSkills.push(skill);
            });
        });
    });

    // new topic form
    $('#newTopicForm').submit(() => {
        var $topic = $('#topic').val();
        if (oldTopics.includes($topic)) {
            helper.snack($topic + ' already in the database');
        } else {
            $('<li/>').text($topic).attr('id', $topic).appendTo('#newTopics');
            oldTopics.push($topic);
            collected.topics.push($topic);
            helper.snack('Added ' + $topic);
        }
    });

    $('#newTopics').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = oldTopics.indexOf(event.target.id);
        oldTopics.splice(idx, 1);

        var idxN = collected.topics.indexOf(event.target.id);
        collected.topics.splice(idxN, 1);

        helper.snack('Removed ' + id);
    });

    $('#doneNewTopic').click(() => {
        helper.snack('Saved');
        $('#newTopicForm').hide();
        $('#newSkillForm').show();

        $.post('/newTopics', collected);
    });

    // new skill form
    $('#newSkillForm').submit(() => {
        var $skill = $('#skill').val();
        if (oldSkills.includes($skill)) {
            helper.snack($skill + ' already in the database');
        } else {
            $('<li/>').text($skill).attr('id', $skill).appendTo('#newSkills');
            oldSkills.push($skill);
            collected.skills.push($skill);
            helper.snack('Added ' + $skill);
        }
    });

    $('#newSkills').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = oldSkills.indexOf(event.target.id);
        oldSkills.splice(idx, 1);

        var idxN = collected.skills.indexOf(event.target.id);
        collected.skills.splice(idxN, 1);

        helper.snack('Removed ' + id);
    });

    $('#doneNewSkill').click(() => {
        helper.snack('Saved');
        $('#newSkillForm').hide();

        $.post('/newSkills', collected);

    });
});
