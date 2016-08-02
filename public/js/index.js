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
            var $first = $('<section/>').addClass('panel panel-default');
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
    var courses = [], oldTopics = [];
    var collected = {
        username: '',
        editions: [],
        topics: [],
        skills: []
    };

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#courseForm').hide();
    $('#interestForm').hide();
    $('#skillForm').hide();
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

    $('#courseForm').on('show', () => {
        $.get('/courses', data => {
            $.each(data.courses, (idx, code) => {
                $('<li/>')
                .text(code)
                .attr('id', code)
                .appendTo('#editions');
            });
        });
    });

    $('#editions').click((event) => {
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

        // $.post('/takenCourses');

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

    });

    $('#interestForm').submit(() => {
        var username = $('#username').val();
        var dept = $('#departments').find(':selected').text();
        var topic = $('#topics').find(':selected').text();
        var interestRating = $('#interestRating').val();

        var data = {
            username: username,
            dept: dept,
            topic: topic,
            interestRating: interestRating
        };

        $.post('/topicInterest', data);

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
        var username = $('#username').val();
        var dept = $('#departmentsSkill').find(':selected').text();
        var skill = $('#skills').find(':selected').text();
        var skillRating = $('#skillRating').val();

        var data = {
            username: username,
            dept: dept,
            skill: skill,
            skillRating: skillRating
        };

        $.post('/skills', data);

    });

    $('#startdata').click(() => {
        $('#skillForm').hide();
        $('#dataForm').show();
    });

    $('#skipData').click(() => {
        $('#dataForm').hide();
        $('#newTopicForm').show();
        $.get('/allTopics', data => {
            console.log(data.topics);
            $.each(data.topics, (idx, $topic) => {
                oldTopics.push($topic);
            });
        });
    });

    $('#dataForm').submit(() => {
        helper.snack('Information Submitted');

        $('#dataForm').hide();
        $('#newTopicForm').show();

        $.each(courses, (idx, code) => {
            collected.editions.push({
                code: code,
                semester: $('#semester' + code).val(),
                year: $('#year' + code).val(),
                timeOfDay: $('#timeOfDay' + code).val(),
                grade: $('#grade' + code).val(),
                courseRank: $('#courseRank' + code).val(),
                instructorRank: $('#instructorRank' + code).val()
            });
        });

        $.post('/data', collected);

        $.get('/allTopics', data => {
            console.log(data.topics);
            $.each(data.topics, (idx, $topic) => {
                oldTopics.push($topic);
            });
        });
    });

    $('#newTopicForm').submit(() => {
        var $topic = $('#topic').val();
        if (oldTopics.includes($topic)) {
            helper.snack($topic + 'already in the database');
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
        helper.snack('Submitted new topics');
        $('#newTopicForm').hide();
        $('#newSkillForm').show();

        $.post('/newTopics', collected);
    });

    $('#newSkillForm').submit(() => {
        var $skill = $('#skill').val();
        if (collected.skills.includes($skill)) {
            helper.snack($skill + 'already in the database');
        } else {
            $('<li/>').text($skill).attr('id', $skill).appendTo('#newSkills');
            collected.skills.push($skill);
            helper.snack('Added ' + $skill);
        }
    });

    $('#newSkills').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = collected.skills.indexOf(event.target.id);
        collected.skills.splice(idx, 1);

        helper.snack('Removed ' + id);
    });

    $('#doneNewSkill').click(() => {  
        helper.snack('Submitted new skills');
        $('#newSkillForm').hide();

        $.post('/newSkills', collected);
    });


});
