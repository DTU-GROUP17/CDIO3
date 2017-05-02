
var log_out = 'index.html';
var urluser = 'http://localhost:9998/users';
var rolea = JSON.stringify(['admin', "pharmacist"]);
console.log(rolea);

/**
 * Created by AliGht on 25/04/2017.
 */



function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}





$(document).ready(function () { //Logout button

    $("#btnlgout").click(function () {
        window.location.replace(log_out);
    })



});





$(document).ready(function(){
    $("#table_users").dataTable({

        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "username" },
            { "data": "roles" },
            { "data": "functions"}
        ],
        'ajax': {
            'url': urluser,
            'type': 'GET',
            'beforeSend': function (request) {
                request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
            },
            "dataSrc": function (data) {
                var returns = [];
                for (var i = 0; i < data.length; i++) {
                    var rolesString = "";
                    var roles = data[i].roles;

                    if (roles.length >= 0) {
                        rolesString += roles[0].name;
                    }
                    for (var j = 1; j < roles.length; j++) {
                        rolesString += ", " + (roles[j].name);
                    }

                    returns[i] = {
                        "id": data[i].id,
                        "name": data[i].name,
                        "username": data[i].userName,
                        "roles": rolesString,
                        "functions": function ( data, type, full, meta )
                    {
                        return '<a href="" id=i>Delete</a>';

                    }
                    }

                    $('#first-choice').append("<option value=" + data[i].name + " selected='selected'>" + data[i].name + "</option>");


                }

                console.log(returns);
                $('#table_users').append('<tbody>');
                return returns;
            }

        }





    });

});



var form_user = $('#form_user');



// Hide message
function hide_message(){
    $('#message').html('').attr('class', '');
    $('#message_container').hide();
}

// Show loading message
function show_loading_message(){
    $('#loading_container').show();
}
// Hide loading message
function hide_loading_message(){
    $('#loading_container').hide();
}

// Show lightbox
function show_lightbox(){
    $('.lightbox_bg').show();
    $('.lightbox_container').show();
}
// Hide lightbox
function hide_lightbox(){
    $('.lightbox_bg').hide();
    $('.lightbox_container').hide();
}
// Lightbox background
$(document).on('click', '.lightbox_bg', function(){
    hide_lightbox();
});
// Lightbox close button
$(document).on('click', '.lightbox_close', function(){
    hide_lightbox();
});
// Escape keyboard key
$(document).keyup(function(e){
    if (e.keyCode == 27){
        hide_lightbox();
    }
});


// Show lightbox
function show_lightbox(){
    $('.lightbox_bg').show();
    $('.lightbox_container').show();
}
// Hide lightbox
function hide_lightbox(){
    $('.lightbox_bg').hide();
    $('.lightbox_container').hide();
}
// Lightbox background
$(document).on('click', '.lightbox_bg', function(){
    hide_lightbox();
});
// Lightbox close button
$(document).on('click', '.lightbox_close', function(){
    hide_lightbox();
});
// Escape keyboard key
$(document).keyup(function(e){
    if (e.keyCode == 27){
        hide_lightbox();
    }
});

// Hide iPad keyboard
function hide_ipad_keyboard(){
    document.activeElement.blur();
    $('input').blur();
}

// Add user button
$(document).on('click', '#add_user', function(e){

    e.preventDefault();
    $('.lightbox_content h2').text('Add User');
    $('#form_user button').text('Add User');
    $('#form_user').attr('class', 'form add');
    $('#form_user').attr('data-id', '');
    $('#form_user .field_container label.error').hide();
    $('#form_user .field_container').removeClass('valid').removeClass('error');
    $('#form_user #name').val('');
    $('#form_user #username').val('');
    $('#form_user #password').val('');
    $('#form_user #roles').val('');
    show_lightbox();
});


// Add user submit form
$(document).on('submit', '#form_user.add', function(e) {
    e.preventDefault();
    // Validate form
        // Send user information to database
        hide_ipad_keyboard();
        hide_lightbox();
        show_loading_message();
       $.ajax
       ({
            url: urluser,  //
            cache: false,
            data: '{"userName": "' + username.value + '", "password" : "' + password.value + '", "name": "' + name.value + '", "roles": ' + rolea + '}',
            //form_user == data,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
           'beforeSend': function (request) {
               request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
           }
    });


return false;


});

// Duran herfra


$('a').click(function() {

    //man kunne måske lave noget herinde... dog virker console.log dernede ikke

    console.log("Hi");
    console.log($(this).attr("id"));


    //return false;

});



$(document).ready(function() {
    var table = $('#table_users').DataTable();

$('#table_users tbody').on('click', 'tr', function () {
    var data = table.row( this ).data();
    alert( 'You clicked on '+data[0]+'\'s row' );

} );
} );


$(document).ready(function () {

    for (i = 0; i < 10; i++) {
    //    $('#first-choice').append('<option value="foo" selected="selected">Foo</option>');
    }
})


$("#first-choice").change(function() {

    var $dropdown = $(this);

    $.getJSON("jsondata/data.json", function(data) {

        var key = $dropdown.val();
        var vals = [];

        switch(key) {
            case 'beverages':
                vals = data.beverages.split(",");
                break;
            case 'snacks':
                vals = data.snacks.split(",");
                break;
            case 'base':
                vals = ['Please choose from above'];
        }

        var $secondChoice = $("#second-choice");
        $secondChoice.empty();
        $.each(vals, function(index, value) {
            $secondChoice.append("<option>" + value + "</option>");
        });

    });
});