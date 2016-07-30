$(document).ready(() => {
    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#infoForm').hide();

    $('#usernameForm').submit(() => {
        var username = $('#username').val();
        $('#usernameForm').hide();
        
        $.post("/login", {username: username}, found => {
            if (found) {
                $('#infoForm').show();
            }
        });
    });

    $('#infoForm').submit(() => {
        var age = $('#age').val();
        var country = $('#country').val();
        var gender = $('#male').is(':checked') ? 'm' : 'f';


    });
});