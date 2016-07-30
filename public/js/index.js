function snack(msg) {
    $('#snackbar').text(msg).addClass('show');

    setTimeout(() => {
        $('#snackbar').removeClass('show');
    }, 1500);
}

$(document).ready(() => {
    var $username;

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();
    $('#interestsForm').hide();

    $('#loginForm').submit(() => {
        $username = $('#username').val();
        $('#loginForm').hide();

        snack('Logged in');

        $.post('/login', {username: $username}, result => {
            $('#name').text($username);
            if (!result) {
                $('#infoForm').show();
            }
        });
    });

    $('#infoForm').submit(() => {
        var $age = $('#age').val();
        var $country = $('#country').val();
        var $gender = $('#male').is(':checked') ? 'm' : 'f';

        var $info = {
            username: $username,
            age: $age,
            country: $country,
            gender: $gender
        };

        snack('Submitted');
        $('#infoForm').hide();
        $('#interestsForm').show();



        $.post('/info', $info, result => {

        });


    });
    $('#interestsForm').submit(() => {

    });
});
