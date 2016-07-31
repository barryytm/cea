// class containing helper methods
class Helper {
    snack(msg) {
        $('#helper.snackbar').text(msg).addClass('show');

        setTimeout(() => {
            $('#helper.snackbar').removeClass('show');
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
                    'min': '0',
                    'max': '100'
                });

            var $courseRankLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Course Rank');
            var $courseRank= $('<input/>')
                .addClass('form-control')
                .attr({
                    'id': 'courseRank' + val,
                    'type': 'number',
                    'placeholder': '1-5',
                    'pattern': '\d+',
                    'min': '1',
                    'max': '5'
                });

            var $instructorRankLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Instructor Rank');
            var $instructorRank= $('<input/>')
                .addClass('form-control')
                .attr({
                    'id': 'instructorRank' + val,
                    'type': 'number',
                    'placeholder': '1-5',
                    'pattern': '\d+',
                    'min': '1',
                    'max': '5'
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
        var $course = $('#course').val();
        if (courses.includes($course)) {
            helper.snack('No duplicate');
        } else {
            $('<li/>').text($course).attr('id', $course).appendTo('#courses');
            courses.push($course);
            helper.snack('Added ' + $course);
        }
    });

    $('#courses').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = courses.indexOf(event.target.id);
        courses.splice(idx, 1);

        helper.snack('Removed ' + id);

    });

    $.ajax({
        url: "/allDept",
        type: "GET",
        dataType: "text",
        success: function(res) {
            console.log(res);
            for (var i = 0; i < data.length; i++) {
                $("departments").append(res);
            }
        },
        error: function(jqXHR, textStatus, jqXHR) {
            console.log(textStatus, errorThrown);
        }
    });
    
    $('#startInterest').click(() => {
        helper.snack('Saved');

        $('#courseForm').hide();
        $('#interestForm').show();

        helper.addCoursesToDataForm(courses);
    });

    $('#interestForm').submit(() => {
        $('#interestForm').hide();
        $('#dataForm').show();
    });

    $('#skipData').click(() => {
        $('#dataForm').hide();
    });

    $('#dataForm').submit(() => {
        $('#dataForm').hide();
    });
});
