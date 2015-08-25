$(document).ready(function(){
	clearLoginFields();
    clearSignupFields();
    function redirect(relativePath) {
            window.location.replace("http://localhost:8080/" + relativePath);
    }
	// Question 4
	// IMPLEMENT "SHOW MODAL" WHEN "CLICK ON LOGIN BUTTON FROM MAIN PAGE" HERE

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            $("#login-modal-container").hide();
            $("#signup-modal-container").hide();
            setTimeout($("#login-error").hide(), 5);
            setTimeout($("#signup-error").hide(), 5);
            setTimeout(clearSignupFields, 5);
            setTimeout(clearLoginFields, 5);
        }
    });

    function clearLoginFields() {
        $("input[name='login-username']").val("");
        $("input[name='login-password']").val("");
    }

    function clearSignupFields(){
        $("input[name='signup-username']").val("");
        $("input[name='signup-password']").val("");
        $("input[name='signup-fname']").val("");
        $("input[name='signup-lname']").val("");
        $("input[name='signup-email']").val("");
        $("input[name='signup-password-verify']").val("");
    }

	$("#login-link").click(function() {
 		$("#login-modal-container").show();
        setTimeout(function(){$("input[name='login-username']").focus()},5);
        
                
	});
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON SUBMIT BUTTON FROM MODAL BOX" HERE
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON CANCEL BUTTON FROM MODAL BOX" HERE

	$("#login-cancel").click(function() {
 		$("#login-modal-container").hide();
        $("#login-error").hide();
        setTimeout(clearLoginFields, 5);
	});


	
	
	// Question 5
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON MODAL OVERLAY" HERE
	$("#login-modal-overlay").click(function() {
 		$("#login-modal-container").hide();
        $("#login-error").hide();
        setTimeout(clearLoginFields, 5);
	});


    function login(e) {
        $("#login-error").hide();

        $.ajax({
        type: "POST",
        url: "/login",
        data: {"username": $("input[name='login-username']").val(), "password":$("input[name='login-password']").val()}

         })

    .done(function(string) {
        if (string == "success"){
                redirect("profile")
            } else {
                $("#login-error").text(string);

                setTimeout(function(){
                    $("#login-error").fadeIn(500);
                }, 5)
            }


        });
       e.preventDefault();
    }
    $("#login-submit").click(login);

    $("input[name='login-username']").keyup(function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            login(e);
        }
    });
    $("input[name='login-password']").keyup(function (e) {
        if (e.keyCode == 13) {
            login(e);
        }
    });



//SIGNUPS



    $("#signup-link").click(function() {
        $("#signup-modal-container").show();
        setTimeout(function(){$("input[name='signup-fname']").focus()},5);
                
    });
    // IMPLEMENT "HIDE MODAL" WHEN "CLICK ON SUBMIT BUTTON FROM MODAL BOX" HERE
    // IMPLEMENT "HIDE MODAL" WHEN "CLICK ON CANCEL BUTTON FROM MODAL BOX" HERE

    $("#signup-cancel").click(function() {
        $("#signup-modal-container").hide();
        $("#signup-error").hide();
        setTimeout(clearSignupFields, 5);
    });


    
    
    // Question 5
    // IMPLEMENT "HIDE MODAL" WHEN "CLICK ON MODAL OVERLAY" HERE
    $("#signup-modal-overlay").click(function() {
        $("#signup-modal-container").hide();
        $("#signup-error").hide();
        setTimeout(clearSignupFields, 5);
    });



    function signup(e) {
            $("#signup-error").hide();
            $.ajax({
            type: "POST",
            url: "/signup",
            data: {
                "username": $("input[name='signup-username']").val(), 
                "password":$("input[name='signup-password']").val(),
                "password2":$("input[name='signup-password-verify']").val(), 
                "fname":$("input[name='signup-fname']").val(), 
                "lname":$("input[name='signup-lname']").val(), 
                "email":$("input[name='signup-email']").val()
            }

        })

        .done(function(string) {
            if (string == "success") {
                redirect("profile")
            }
            else{
                $("#signup-error").text(string);

                setTimeout(function(){
                    $("#signup-error").fadeIn(500);
                }, 5)
            }

        });
       e.preventDefault();
    }


	$("#signup-submit").click(signup);

    $("input[name='signup-username']").keyup(function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            signup(e);
        }
    });
    $("input[name='signup-password']").keyup(function (e) {
        if (e.keyCode == 13) {
            signup(e);
        }
    });

    $("input[name='signup-fname']").keyup(function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            signup(e);
        }
    });
    $("input[name='signup-lname']").keyup(function (e) {
        if (e.keyCode == 13) {
            signup(e);
        }
    });
    $("input[name='signup-password-verify']").keyup(function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            signup(e);
        }
    });
    $("input[name='signup-email']").keyup(function (e) {
        if (e.keyCode == 13) {
            signup(e);
        }
    });


	 
});
