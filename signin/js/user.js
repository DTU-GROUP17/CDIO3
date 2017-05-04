var urlUser = 'http://localhost:9998/self/';
var log_out = 'index.html';

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
        'url': urlUser,
        'type': 'PATCH',
        'data': JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
    }).done(function(data) {
    })
        .fail(function(data) {
            if(data.status !== 200) {
                alert("failed updating user!");
            }
            if(type === "userName") {
                window.location.replace(log_out);
            }
        });
}

function deleteUser() {
    $.ajax({
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        },
        'url': urlUser,
        'type': 'DELETE',
        contentType: 'application/json; charset=utf-8',
    })
        .done(function (data) {
            window.location.replace(log_out);
        })
        .fail(function(data) {
            console.log("???"); // PLZ DO not delete, master comment fixer???!
            if(data.status !== 200) {
                alert("failed deleting user!");
            }
            window.location.replace(log_out);
        });
}

function initTable() {
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
                    return '<select class="selectpicker" id="roles_' + full.id + '" multiple disabled><option>admin</option><option>user</option></select>';
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
            });

        },
        'ajax': {
            'url': urlUser,
            'type': 'GET',
            'beforeSend': function (request) {
                request.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
            },
            "dataSrc": function (data) {
                return [
                    {
                        "id": data.id,
                        "name": data.name,
                        "username": data.userName,
                        "roles": data.roles
                    }
                ];
            }
        }
    });
}


$(document).ready(function(){
    $("#logout").click(function () {
        document.cookie = "";
        window.location.replace(log_out);
    });
    initTable(urlUser);
});
