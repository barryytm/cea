function snack(msg) {
    $('#snackbar').text(msg).addClass('show');

    setTimeout(() => { 
        $('#snackbar').removeClass('show'); 
    }, 1500);
}

$(document).ready(() => {
    var username;
    var courses = [];

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#courseForm').hide();

    $('#loginForm').submit(() => {
        username = $('#username').val();
        $('#loginForm').hide();

        snack('Logged in');
        
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
        var $age = $('#age').val();
        var $country = $('#country').val();
        var $gender = $('#male').is(':checked') ? 'm' : 'f';

        var $info = {
            username: username, 
            age: $age, 
            country: $country, 
            gender: $gender
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
            $('<li/>').text($course).appendTo('#courses');
            courses.push($course);
        }
    });

    $('#courses').children().click(() => {

    });
});