var baseUri = 'http://localhost:9998/';

$(document).ready(function(){
    $("#loginForm").submit(function(event) {
        var data = $('#loginForm').serializeArray();

        $.ajax({
            type: "POST",
            url: baseUri+'authentication/login',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                "userName": data[0].value,
                "password": data[1].value
            })
        })
        .done(function(data) {
            document.cookie = "token="+data.message;

            $.ajax({
                url: baseUri+'self',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                'beforeSend': function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + data.message);
                },
            })
            .done(function(data) {
                console.log(data);

                var admin = false;
                data.roles.forEach(function(role) {
                    if(role.name === "admin") {
                        admin = true;
                    }
                });

                if(admin) {
                    window.location.href = "admin.html";
                }
                else {
                    window.location.href = "user.html";
                }
            })
        })
        .fail(function() {
            $('#failed').show();
        });


        event.preventDefault();
    });
});



