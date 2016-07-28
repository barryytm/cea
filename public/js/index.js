$(document).ready(() => {
    $('#errors').hide(); 
    $('#name').focus();
    $('#join').attr("disabled", "disabled");

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#name').keypress(() => {
        var name = $('#name').val();
        if(name === '' || name.length < 3) {
            $('#join').attr("disabled", "disabled");
        } else {
            $('#errors').empty();
            $('#errors').hide();
            $('#join').removeAttr("disabled");
        }
    });

    $('#nameForm').submit(() => {
        var name = $('#name').val();

        if (name === '' || name.length < 3) {
            $('#errors').empty();
            $('#errors').append('Please enter a name longer than 3 characters');
            $('#errors').show();
        } else {
            $('.overlay').css('height', '0%');
        }
    });
});