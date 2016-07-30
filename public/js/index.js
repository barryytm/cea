$(document).ready(() => {
    var $username;

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();

    $('#loginForm').submit(() => {
        $username = $('#username').val();
        $('#loginForm').hide();
        
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

        $.post('/info', $info, result => {

        });


    });
});