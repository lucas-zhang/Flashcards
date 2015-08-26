$(document).ready(function(){


    $("#deck-title").focus();


    // Create new card
    $("#next-button").click(function(){
        curr = $(window).scrollTop();
        dest = curr + 160;
        var newRow = "<div style = 'display: none' class='card-row'><img src = '/static/img/x-icon.png' class = 'exit-img'><textarea class = 'card-text'></textarea><textarea class = 'card-text'></textarea></div>";
        $(newRow).appendTo("#card-space").fadeIn('slow');
        $('body, html').animate({scrollTop: dest}, 450);
        $("#card-space").children(":last-child").children(":first-child").focus();
    
    });

    // Delete card and undo function
    var deletedRows = [];

    $(document).on("click", ".exit-img", function() {
        $(this).parent().fadeOut(500);
        deletedRows.push($(this).parent());
    });

    $("#undo-button").click(function(){
        deletedRows.pop().fadeIn(600);
    });



    //Create Deck functionality

    commitFunc = function(e, url) {
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
            url: url,
            data: {
                "deckTitle": $("#deck-title").val(),
                "frontArray": JSON.stringify(frontArray),
                "backArray": JSON.stringify(backArray)
            }
        })

        .done(function(string) {


        });
        e.preventDefault();
    }
    $("#submit-button").click(commitFunc(e, '/insertDeck'));
    //Edit Deck
    $("#edit-button").click(commitFunc(e, '/saveEdits'));



});