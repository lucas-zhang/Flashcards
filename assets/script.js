$(document).ready(function(){
	
        function redirect(relativePath) {
                window.location = "http://localhost:8080/" + relativePath
        }
	// Question 4
	// IMPLEMENT "SHOW MODAL" WHEN "CLICK ON LOGIN BUTTON FROM MAIN PAGE" HERE

	$("#login-link").click(function() {
 		$("#login-modal-container").show();
        setTimeout(function(){$("input[name='login-username']").focus()},5);
        
                
	});
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON SUBMIT BUTTON FROM MODAL BOX" HERE
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON CANCEL BUTTON FROM MODAL BOX" HERE

	$("#login-cancel").click(function() {
 		$("#login-modal-container").hide();
        $("#login-error").hide();
	});


	
	
	// Question 5
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON MODAL OVERLAY" HERE
	$("#login-modal-overlay").click(function() {
 		$("#login-modal-container").hide();
        $("#login-error").hide();
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
                $("#login-error").text(string)

                setTimeout(function(){
                    $("#login-error").fadeIn(500)
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
    });


    
    
    // Question 5
    // IMPLEMENT "HIDE MODAL" WHEN "CLICK ON MODAL OVERLAY" HERE
    $("#signup-modal-overlay").click(function() {
        $("#signup-modal-container").hide();
        $("#signup-error").hide();
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
            if (string == "success"){
                    redirect("profile")
                } else {
                    $("#signup-error").text(string)

                    setTimeout(function(){
                        $("#signup-error").fadeIn(500)
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
