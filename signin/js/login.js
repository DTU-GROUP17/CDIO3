
var L_auth='http://localhost:9998/authentication/login'; // authentication link to check the user  // 200, 403, 401, 500
var L_redirect='profile.html'; // if the user authentication is successful redirected to this link
var roles='<%=request.getRoles()%>';

$(document).ready(function(){
    $("#btnlogin").click(function () {

        var username = $("#inputUsername").val(); // getting username
        var password = $("#inputPassword").val(); // getting password

            if (username && password) { // values are not empty

                $.ajax
                ({

                    type: "POST",
                    //sending username and pass
                    url: L_auth,// Oliver and CarlEmil
                    //contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    async: false,
                    //sending json object to the auth url
                    data: '{"userName": "' + username + '", "password" : "' + password + '"}',
                    // call was *not* successful

                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $('div#errorshow').text("responseText: " + XMLHttpRequest.responseText
                            + ", textStatus: " + textStatus
                            + ", errorThrown: " + errorThrown);
                        $('div#errorshow').addClass("error");
                    }, // error
                    success: function (data) {

                        if (data.response == 200) { // redirect the user to dashboard

                            window.location.replace(L_redirect)
                            //document.location.href = 'dashboard.html'; (using this to test )

                        } else if (data.response == 0 || data.error)// if it was not succesful
                        {
                            $('div#loginResult').text("data.error" + data.error);
                            $('div#loginResult').addClass("error");

                        } // else
                    } // success


                }); // ajax


            } // if
            else {
                $('div#loginResult').show();

            } // else
            $('div#loginResult').fadeIn();
            return false;

    });
});



