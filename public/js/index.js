// class containing helper methods
class Helper {
    snack(msg) {
        $('#snackbar').text(msg).addClass('show');

        setTimeout(() => {
            $('#snackbar').removeClass('show');
        }, 2000);
    }

    addCoursesToDataForm(courses) {
        $.each(courses, (idx, val) => {
            var id = 'collapse' + val;
            var $first = $('<section/>').addClass('panel panel-default');
            var $second = $('<section/>').addClass('panel-heading');
            var $third = $('<section/>').addClass('panel-title');
            var $title = $('<a/>')
                .addClass('collapsed')
                .text(val)
                .attr({
                    'data-toggle': 'collapse',
                    'data-parent': '#dataForm',
                    'href': '#' + id
                });

            var $gradeLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Grade');
            var $grade = $('<input/>')
                .addClass('form-control')
                .attr({
                    'id': 'grade' + val,
                    'type': 'number',
                    'placeholder': '0-100',
                    'pattern': '\d+',
                    'min': 0,
                    'max': 100
                });

            var $courseRankLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Course Rank');
            var $courseRank= $('<input/>')
                .addClass('form-control')
                .attr({
                    'id': 'courseRank' + val,
                    'type': 'number',
                    'placeholder': '1-5',
                    'pattern': '\d+',
                    'min': 1,
                    'max': 5
                });

            var $instructorRankLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Instructor Rank');
            var $instructorRank= $('<input/>')
                .addClass('form-control')
                .attr({
                    'id': 'instructorRank' + val,
                    'type': 'number',
                    'placeholder': '1-5',
                    'pattern': '\d+',
                    'min': 1,
                    'max': 5
                });

            var $content = $('<section/>').attr('id', id).addClass('panel-collapse collapse content');

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
    var username = '';
    var courses = [];
    var helper = new Helper();

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#courseForm').hide();
    $('#interestForm').hide();
    $('#dataForm').hide();

    $('#loginForm').submit(() => {
        username = $('#username').val();

        helper.snack('Logged in');

        $('#loginForm').hide();

        $.post('/login', {username: username}, result => {
            $('#name').text(username);
            if (!result) {
                $('#infoForm').show();
            } else {
                $('#courseForm').show();
            }
        });
    });

    $('#infoForm').submit(() => {
        var age = $('#age').val();
        var country = $('#country').val();
        var gender = $('#male').is(':checked') ? 'm' : 'f';

        var info = {
            username: username,
            age: age,
            country: country,
            gender: gender
        };

        helper.snack('Submitted');
        $('#infoForm').hide();

        $.post('/info', info);

        $('#courseForm').show();
    });

    $('#courseForm').submit(() => {
        var found = false;
        var edition = {
            code: $('#code').val(),
            semester: $('#semester').val(),
            year: $('#year').val(),
            timeOfDay: $('#timeOfDay').val()
        };

        $.each(courses, (idx, val) => {
            if (_.isEqual(val, edition)) {
                found = true;
                helper.snack('Already added');
            }
        });


        if (!found) {
            helper.snack('Added ' + edition.code);

            $('<li/>')
            .text(edition.code + ', ' + edition.semester + ', ' + edition.year + ', ' + edition.timeOfDay)
            .attr('id', edition.code)
            .appendTo('#courses');

            courses.push(edition);
        }
    });

    $('#courses').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = courses.indexOf(event.target.id);
        courses.splice(idx, 1);

        helper.snack('Removed ' + id);

    });

    $('#startInterest').click(() => {
        helper.snack('Saved');

        $('#courseForm').hide();
        $('#interestForm').show();

        helper.addCoursesToDataForm(courses);

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

        $('#interestForm').hide();
        $('#dataForm').show();
    });

    $('#skipData').click(() => {
        $('#dataForm').hide();
    });

    $('#dataForm').submit(() => {
        helper.snack('Submitted');

        $('#dataForm').hide();

        var jsonObj = {'username': username};
        jsonObj.courses = [];
        $.each(courses, (idx, code) => {
            var course = {};
            course.code = code;
            course.grade = $('#grade' + code).val();
            course.courseRank = $('#courseRank' + code).val();
            course.instructorRank = $('#instructorRank' + code).val();
            jsonObj.courses.push(course);
        });

        $.post('/data', jsonObj);

    });
});
