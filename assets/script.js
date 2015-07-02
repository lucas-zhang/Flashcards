$(document).ready(function(){
	
        function redirect(relativePath) {
                window.location = "http://localhost:8080/" + relativePath
        }
	// Question 4
	// IMPLEMENT "SHOW MODAL" WHEN "CLICK ON LOGIN BUTTON FROM MAIN PAGE" HERE

	$("#login-link").click(function() {
 		$("#login-modal-container").show();
                
	});
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON SUBMIT BUTTON FROM MODAL BOX" HERE
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON CANCEL BUTTON FROM MODAL BOX" HERE

	$("#login-cancel").click(function() {
 		$("#login-modal-container").hide();
	});


	
	
	// Question 5
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON MODAL OVERLAY" HERE
	$("#modal-overlay").click(function() {
 		$(".modal-container").hide();
	});



	 $("#login-submit").click(function(e) {
	     $.ajax({
	         type: "POST",
		 url: "/login",
		 data: {"username": $("input[name='userInput']").val(), "password":$("input[name='passInput']").val()}

   	    })

	    .done(function(string) {
	        if (string == "success"){
                    redirect("profile")
                } else {
                    $("#login-error").fadeIn(500)
                }


	    });
	   e.preventDefault();
	 });
});
