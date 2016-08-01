// class containing helper methods
class Helper {
    snack(msg) {
        $('#snackbar').text(msg).addClass('show');

        setTimeout(() => {
            $('#snackbar').removeClass('show');
        }, 2000);
    }

    addEditionsToDataForm(editions) {
        $.each(editions, (idx, edition) => {
            var code = edition.code;
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

            var $gradeLabel = $('<label/>').addClass('col-md-4 col-form-label').text('Grade');
            var $grade = $('<input/>')
                .addClass('form-control')
                .attr({
                    'id': 'grade' + code,
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
                    'id': 'courseRank' + code,
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
                    'id': 'instructorRank' + code,
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
    var helper = new Helper();
    var collected = {
        username: '',
        editions: []
    };

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#courseForm').hide();
    $('#interestForm').hide();
    $('#dataForm').hide();

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

    $('#courseForm').submit(() => {
        var found = false;
        var edition = {
            code: $('#code').val(),
            semester: $('#semester').val(),
            year: $('#year').val(),
            timeOfDay: $('#timeOfDay').val()
        };

        $.each(collected.editions, (idx, val) => {
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
            .appendTo('#editions');

            collected.editions.push(edition);
        }
    });

    $('#editions').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = collected.editions.indexOf(event.target.id);
        collected.editions.splice(idx, 1);

        helper.snack('Removed ' + id);

    });

    $('#startInterest').click(() => {
        helper.snack('Saved');

        $('#courseForm').hide();
        $('#interestForm').show();

        helper.addEditionsToDataForm(collected.editions);

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

        $.each(collected.editions, (idx, edition) => {
            var code = edition.code;
            edition.grade =  $('#grade' + code).val();
            edition.courseRank = $('#courseRank' + code).val();
            edition.instructorRank = $('#instructorRank' + code).val();
        });
        $.post('/data', collected);
    });
});
