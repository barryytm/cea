$(document).ready(() => {
    $('#errors').hide(); 
    $('#infoForm').hide();
    $('#username').focus();
    $('#join').attr("disabled", "disabled");

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#username').keypress(() => {
        var username = $('#username').val();
        if(username === '' || username.length < 3) {
            $('#join').attr("disabled", "disabled");
        } else {
            $('#errors').empty();
            $('#errors').hide();
            $('#join').removeAttr("disabled");
        }
    });

    $('#usernameForm').submit(() => {
        var username = $('#username').val();

        if (username === '' || username.length < 3) {
            $('#errors').empty();
            $('#errors').append('Please enter a username longer than 3 characters');
            $('#errors').show();
        } else {
            $('#usernameForm').hide();
            
            $.post("/login", {username: username}, found => {
                console.log(found);
                if (found) {
                    $('#infoForm').show();
                }
            });
        }
    });
});