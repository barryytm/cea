function snack(msg) {
    $('#snackbar').text(msg).addClass('show');

    setTimeout(() => {
        $('#snackbar').removeClass('show');
    }, 2000);
}

$(document).ready(() => {
    var username;
    var courses = [];

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#courseForm').hide();
    $('#interestForm').hide();

    $('#loginForm').submit(() => {
        username = $('#username').val();

        snack('Logged in');

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

        var $info = {
            username: username,
            age: age,
            country: country,
            gender: gender
        };

        snack('Submitted');
        $('#infoForm').hide();

        $.post('/info', $info, result => {
            $('#courseForm').show();
        });
    });

    $('#courseForm').submit(() => {
        var $course = $('#course').val();
        if (courses.includes($course)) {
            snack('No duplicate');
        } else {
            $('<li/>').text($course).attr('id', $course).appendTo('#courses');
            courses.push($course);
            snack('Added ' + $course);
        }
    });

    $('#courses').click((event) => {
        var id = event.target.id;
        $('#' + id).hide();

        var idx = courses.indexOf(event.target.id);
        courses.splice(idx, 1);

        snack('Removed ' + id);
    });

    $('#startInterest').click(() => {
        snack('Saved');

        $('#courseForm').hide();
        $('#interestForm').show();
    });

    $('#interestForm').submit(() => {

    });
});
