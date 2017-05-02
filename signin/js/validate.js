/**
 * validation
 */

$(document).ready(function() {
	
	$.validator.addMethod('strongPassword', function(value, element) {
		return this.optional(element) 
		|| value.length >= 6
		&& /\d/.test(value)
		&& /[a-z]/i.test(value);
	}, "Your password must be at least 6 characters long and contains at least one number and one character\'.");
	
	$('#login_form').validate({
	rules: {
		username: {
			required: true,
			nowhitespace: true
		},
		password: {
			required: true,
			strongPassword: true
		}
	},
	messages: {
		username: {
			required: 'Please enter a username.',
		},
		password: {
			required: 'Please enter password',
			password: 'Please enter a <em>valid</em> password' 
		}
	}	
	});
});

 