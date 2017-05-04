
var log_out = 'index.html';
var urluser = 'http://localhost:9998/users/';


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

function changeUser(user_id, type) {
    var val = $('#'+type+'_'+user_id).val();

    var data  = {};
    data[type] = val;

    $.ajax({
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        },
        'url': urluser+user_id,
        'type': 'PATCH',
        'data': JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
    }).done(function(data) {
        })
    .fail(function(data) {
        if(data.status !== 200) {
            alert("failed updating user!");
        }
    });
}

function deleteUser(user_id) {
    console.log("delete"+user_id);
    $.ajax({
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        },
        'url': urluser+user_id,
        'type': 'DELETE',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (data) {
        $("#table_users").DataTable().ajax.reload();
    })
    .fail(function(data) {
        if(data.status !== 200) {
            alert("failed deleting user!");
        }
        $("#table_users").DataTable().ajax.reload();
    });
}

function createUser(event) {
    var formData = $('#createUserForm').serializeArray();

    var data = {
        "name": formData[1].value,
        "userName": formData[0].value,
        "password": formData[2].value,
        "roles": $('#roles').val()
    };

    $.ajax({
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        },
        'url': urluser,
        'type': 'POST',
        'data': JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
    })
    .done(function(data) {
        $("#table_users").DataTable().ajax.reload();
    })
    .fail(function(data) {
        if(data.status !== 200) {
            alert("failed creating user!");
        }
        $("#table_users").DataTable().ajax.reload();
    });

    $('#createUser').modal('toggle');

    event.preventDefault();
    return false;
}


$(document).ready(function(){
    $("#logout").click(function () {
        window.location.replace(log_out);
    });


    $("#table_users").dataTable({
        "searching": false,
        "paging": false,
        "info": false,
        "sort": false,
        "columns": [
            {"data": "id"},
            {
                "data": "name",
                "render": function (data, type, full) {
                    return '<input type="text" class="form-control" id="name_' + full.id + '" value="' + data + '" onchange="changeUser(\'' + full.id + '\', \'name\')">';
                },
            },
            {
                "data": "username",
                "render": function (data, type, full) {
                    return '<input type="text" class="form-control" id="userName_' + full.id + '" value="' + data + '" onchange="changeUser(\'' + full.id + '\', \'userName\')">';
                },
            },
            {
                "data": "roles",
                "render": function (data, type, full) {
                    return '<select class="selectpicker" id="roles_' + full.id + '" multiple><option>admin</option><option>user</option></select>';
                }
            },
            {
                "render": function (data, type, full) {
                    return '<input type="password" class="form-control" id="password_' + full.id + '" placeholder="********" onchange="changeUser(\'' + full.id + '\', \'password\')">';
                }
            },
            {
                "render": function (data, type, full) {
                    return '<button type="button" class="btn btn-xs btn-danger" onclick="deleteUser(\'' + full.id + '\')"><span class="glyphicon glyphicon glyphicon-remove"></span>&nbsp;</button>';
                }
            }
        ],
        "drawCallback": function () {
            this.api().data().each(function(row) {
                var selected = [];
                row.roles.forEach(function (data) {
                    selected.push(data.name);
                });

                var $selectPicker = $('#roles_' + row.id);
                $selectPicker.selectpicker('val', selected);
                $selectPicker.on('changed.bs.select', function (e) {
                    roles = {
                        'roles': $(e.currentTarget).val()
                    };
                    $.ajax({
                        'beforeSend': function (request) {
                            request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
                        },
                        'url': urluser + row.id,
                        'type': 'PATCH',
                        'data': JSON.stringify(roles),
                        contentType: 'application/json; charset=utf-8',
                    })
                        .fail(function (data) {
                            if (data.status !== 200) {
                                alert("failed setting roles!");
                            }
                        });
                });
            });

        },
        'ajax': {
            'url': urluser,
            'type': 'GET',
            'beforeSend': function (request) {
                request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
            },
            "dataSrc": function (data) {
                var returns = [];
                for (var i = 0; i < data.length; i++) {
                    returns[i] = {
                        "id": data[i].id,
                        "name": data[i].name,
                        "username": data[i].userName,
                        "roles": data[i].roles
                    }
                }
                return returns;
            }
        }
    });
});

