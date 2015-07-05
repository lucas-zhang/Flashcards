$(document).ready(function(){


    $("#deck-title").focus();



    $("#next-button").click(function(){
        curr = $(window).scrollTop();
        dest = curr + 160;
        var newRow = "<div style = 'display: none' class='card-row'><textarea class = 'card-text'></textarea><textarea class = 'card-text'></textarea></div>";
        $(newRow).appendTo("#card-space").fadeIn('slow');
        $('body, html').animate({scrollTop: dest}, 450);
        $("#card-space").children(":last-child").children(":first-child").focus();
    
    });


    $("#submit-button").click(function() {
        var frontArray = [];
        var backArray = [];
        $(".card-text").each(function(index){
            if (index % 2 == 0) {
                frontArray.push($(this).val());
            } else {
                backArray.push($(this).val());
            }
        });
        $.ajax({
            type: "POST",
            url: "/createDeck",
            data: {
                frontArray: frontArray,
                backArray: backArray
            }
        })

        .done(function(string) {


        });
        e.preventDefault();
    });



});