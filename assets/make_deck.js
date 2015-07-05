$(document).ready(function(){


    $("#deck-title").focus();



    $("#next-button").click(function(){
        curr = $(window).scrollTop();
        dest = curr + 160;
        var newRow = "<div style = 'display: none' class='card-row'><img src = 'assets/img/x-icon.png' class = 'exit-img'><textarea class = 'card-text'></textarea><textarea class = 'card-text'></textarea></div>";
        $(newRow).appendTo("#card-space").fadeIn('slow');
        $('body, html').animate({scrollTop: dest}, 450);
        $("#card-space").children(":last-child").children(":first-child").focus();
    
    });
    var deletedRows = [];

    $(document).on("click", ".exit-img", function() {
        $(this).parent().fadeOut(500);
        deletedRows.push($(this).parent());
    });

    $("#undo-button").click(function(){
        deletedRows.pop().fadeIn(600);
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