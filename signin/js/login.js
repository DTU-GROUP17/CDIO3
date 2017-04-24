
var L_auth='auth.html'; // authentication link to check the user
var L_redirect='user.html'; // if the user authentication is successful redirected to this link
var roles='<%=request.getRoles()%>';

$(document).ready(function () {
    //submit button ( event handler)
    $("#btnlogin").click(function () {




        $("#loginResult").show(500).animate(hide(6000));
        //get the username and password entered

        var username = $("#inputUsername").val();
        var password = $("#inputPassword").val();


        // Authenicate data entered by user
        authenticate(username, password);
    })

})



//auth function to call ajax function


function authenticate(username, password)
{
    var jsondata =JSON.stringify({ "userName": username, "password" : password });
//alert(jsondata); Test json
    $.post( L_auth, jsondata)
        .done(function( response ) {
        if(response==1){

            window.location.replace(L_redirect);
        }
        else{$("#loginResult")}
        });
}


function authenicate(username, password) {



    $.ajax
    ({

        type: "POST",
        //sending username and pass
        url: L_auth ,// Oliver and CarlEmil
        dataType: 'json',
        async: false,
        //sending json object to the auth url
        data: '{"udername": "'+ username + '", "password" : "'+ password + '"}',
        // call was *not* successful
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('div#loginResult').text("responseText: " + XMLHttpRequest.responseText
                + ", textStatus: " + textStatus
                + ", errorThrown: " + errorThrown);
            $('div#loginResult').addClass("error");
        }, // error
        success: function (data) {

            if(data.response == 1){ // redirect the user to dashboard
                window.location.replace(L_redirect)
                //document.location.href = 'dashboard.html'; (using this to test )

            } else if  (data.response == 0 || data.error)// if it was not succesful
            {
            $('div#loginResult').text("data.error" + data.error);
            $('div#loginResult').addClass("error");

            }
        }


    })
    
}

