
var log_out = 'index.html';
var urluser = 'http://localhost:9998/users';
var rolea = JSON.stringify(['admin', "pharmacist"]);




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
            {"defaultContent": "<button id='delBt'>Delete</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button id='edBt'>Edit</button>"},



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
                        "roles": rolesString
                    }


                }

                console.log(returns);
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


    //var rolea = JSON.stringify(['admin', "pharmacist"]);

    var roles = [];
    if($("#rolePharmacist").is(':checked'))roles.push('pharmacist');
    if($("#roleUser").is(':checked'))roles.push('user');
//alert(roles);

    // Validate form
        // Send user information to database
        hide_ipad_keyboard();
        hide_lightbox();
        show_loading_message();
       $.ajax
       ({

           url: urluser,  //
           cache: false,
           data: '{"name": "' + $("#name").val() + '", "userName" : "' + username.value + '", "password": "' + password.value + '", "roles": ' + roles.value + '}',
           dataType: 'json',
           contentType: 'application/json; charset=utf-8',
           type: 'POST',
           sucess : window.location.reload(),
           'beforeSend': function (request) {
               request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
           },
    });


return false;


});


// Delete user
$(document).on('click', '#delBt', function(e) {
    e.preventDefault();



    $.ajax
    ({


        url: urluser,  //
        cache: false,
        data:  null,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'DELETE',
        sucess : window.location.reload(),
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        },
    });


    return false;


});




// Duran herfra