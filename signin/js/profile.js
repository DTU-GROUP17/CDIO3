var roles='<%=request.getRoles()%>';

$(document).ready(function () {

    if (role == admin){
        $("#admin_d").show();
    }else
        $("#user_d").show();
})

$(document).ready(function(){

    // On page load: datatable
    var table_users = $('#table_users').dataTable({
        "ajax": "<%=request.getUsers()%>", // Adding url later (Getting users list)
        "columns": [
            { "data": "Id" },
            { "data": "name",   "sClass": "name" },
            { "data": "username" },
            { "data": "roles"},
            { "data": "password"},
            { "data": "functions",      "sClass": "functions" }
        ],
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [-1] }
        ],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "oLanguage": {
            "oPaginate": {
                "sFirst":       " ",
                "sPrevious":    " ",
                "sNext":        " ",
                "sLast":        " ",
            },
            "sLengthMenu":    "Records per page: _MENU_",
            "sInfo":          "Total of _TOTAL_ records (showing _START_ to _END_)",
            "sInfoFiltered":  "(filtered from _MAX_ total records)"
        }
    });

    // On page load: form validation
    jQuery.validator.setDefaults({
        success: 'valid',
        rules: {
            fiscal_year: {
                required: true,
                min:      2000,
                max:      2025
            }
        },
        errorPlacement: function(error, element){
            error.insertBefore(element);
        },
        highlight: function(element){
            $(element).parent('.field_container').removeClass('valid').addClass('error');
        },
        unhighlight: function(element){
            $(element).parent('.field_container').addClass('valid').removeClass('error');
        }
    });
    var form_user = $('#form_user');
    form_user.validate();

    // Show message
    function show_message(message_text, message_type){
        $('#message').html('<p>' + message_text + '</p>').attr('class', message_type);
        $('#message_container').show();
        if (typeof timeout_message !== 'undefined'){
            window.clearTimeout(timeout_message);
        }
        timeout_message = setTimeout(function(){
            hide_message();
        }, 8000);
    }
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


    // Hide iPad keyboard
    function hide_ipad_keyboard(){
        document.activeElement.blur();
        $('input').blur();
    }

    // Add users button
    $(document).on('click', '#add_user', function(e){
        e.preventDefault();
        $('.lightbox_content h2').text('Add user');
        $('#form_user button').text('Add user');
        $('#form_user').attr('class', 'form add');
        $('#form_user').attr('data-id', '');
        $('#form_user .field_container label.error').hide();
        $('#form_user .field_container').removeClass('valid').removeClass('error');
        $('#form_user #name').val('');
        $('#form_user #username').val('');
        $('#form_user #role').val('');
        $('#form_user #password').val('');
        show_lightbox();
    });

    // Add user submit form
    $(document).on('submit', '#form_user.add', function(e){
        e.preventDefault();
        // Validate form
        if (form_user.valid() == true){
            // Send user information to database (server)
            hide_ipad_keyboard();
            hide_lightbox();
            show_loading_message();
            var form_data = $('#form_user').serialize();
            var request   = $.ajax({
                url:          '', // Adding url (Oliver) ****************
                cache:        false,
                data:         form_data,
                dataType:     'json',
                contentType:  'application/json; charset=utf-8',
                type:         'get'
            });
            request.done(function(output){
                if (output.result == 'success'){
                    // Reload datable
                    table_users.api().ajax.reload(function(){
                        hide_loading_message();
                        var user_name = $('#username').val();
                        show_message("User '" + user_name + "' added successfully.", 'success');
                    }, true);
                } else {
                    hide_loading_message();
                    show_message('Add request failed', 'error');
                }
            });
            request.fail(function(jqXHR, textStatus){
                hide_loading_message();
                show_message('Add request failed: ' + textStatus, 'error');
            });
        }
    });

    // Edit user button
    $(document).on('click', '.function_edit a', function(e){
        e.preventDefault();
        // Get users information from database/server
        show_loading_message();
        var id      = $(this).data('id');
        var request = $.ajax({
            url:          '',  //url Oliver **********************
            cache:        false,
            data:         'id=' + id,
            dataType:     'json',
            contentType:  'application/json; charset=utf-8',
            type:         'get'
        });

        request.done(function(output){
            if (output.result == 'success'){
                $('.lightbox_content h2').text('Edit user');
                $('#form_user button').text('Edit user');
                $('#form_user').attr('class', 'form edit');
                $('#form_user').attr('data-id', id);
                $('#form_user .field_container label.error').hide();
                $('#form_user .field_container').removeClass('valid').removeClass('error');
                $('#form_user #name').val(output.data[0].name);
                $('#form_user #username').val(output.data[0].username);
                $('#form_user #role').val(output.data[0].role);
                $('#form_user #password').val(output.data[0].password);
                hide_loading_message();
                show_lightbox();
            } else {
                hide_loading_message();
                show_message('Information request failed', 'error');
            }
        });

        request.fail(function(jqXHR, textStatus){
            hide_loading_message();
            show_message('Information request failed: ' + textStatus, 'error');
        });
    });

    // Edit users submit form
    $(document).on('submit', '#form_user.edit', function(e){
        e.preventDefault();
        // Validate form
        if (form_user.valid() == true){
            // Send user information to database/server
            hide_ipad_keyboard();
            hide_lightbox();
            show_loading_message();
            var id        = $('#form_user').attr('data-id');
            var form_data = $('#form_user').serialize();
            var request   = $.ajax({
                url:          '' + id, // Url Oliver ***********************
                cache:        false,
                data:         form_data,
                dataType:     'json',
                contentType:  'application/json; charset=utf-8',
                type:         'get'
            });

            request.done(function(output){
                if (output.result == 'success'){
                    // Reload datable
                    table_users.api().ajax.reload(function(){
                        hide_loading_message();
                        var user_name = $('#user_name').val();
                        show_message("User '" + user_name + "' edited successfully.", 'success');
                    }, true);
                } else {
                    hide_loading_message();
                    show_message('Edit request failed', 'error');
                }
            });
            request.fail(function(jqXHR, textStatus){
                hide_loading_message();
                show_message('Edit request failed: ' + textStatus, 'error');
            });
        }
    });

    // Delete user
    $(document).on('click', '.function_delete a', function(e){
        e.preventDefault();
        var user_name = $(this).data('name');
        if (confirm("Are you sure you want to delete '" + user_name + "'?")){
            show_loading_message();
            var id      = $(this).data('id');
            var request = $.ajax({
                url:          '' + id,  // Url Oliver ***********************
                cache:        false,
                dataType:     'json',
                contentType:  'application/json; charset=utf-8',
                type:         'get'
            });
            request.done(function(output){
                if (output.result == 'success'){
                    // Reload datable
                    table_users.api().ajax.reload(function(){
                        hide_loading_message();
                        show_message("User '" + user_name + "' deleted successfully.", 'success');
                    }, true);
                } else {
                    hide_loading_message();
                    show_message('Delete request failed', 'error');
                }
            });
            request.fail(function(jqXHR, textStatus){
                hide_loading_message();
                show_message('Delete request failed: ' + textStatus, 'error');
            });
        }
    });

});