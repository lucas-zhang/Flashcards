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


    function request(path, params, method) {

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for(var key in params) {
            if(params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
             }
        }

        document.body.appendChild(form);
        form.submit();
    };
    //Create Deck functionality
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return results[1];
    }
    commitFunc = function(url) {
        var frontArray = [];
        var backArray = [];
        var deckID = $.urlParam('deckID');
        $(".card-text").each(function(index){
            if ($(this).css('display') == 'none' || parseInt($(this).css('opacity')) < 1) {
                window.alert("display none if called");
                return "continue"; // acts as a continue
            }
            if (index % 2 == 0) {
                frontArray.push($(this).val());
            } else {
                backArray.push($(this).val());
            }

        });
        request(url, {'deckTitle': $("#deck-title").val(), 
            'frontArray':JSON.stringify(frontArray), 
            'backArray': JSON.stringify(backArray),
            'deckID': deckID
        }, 'POST');



    };
    $("#create-submit").click(function() {
        commitFunc('/insertDeck');
    });
    //Edit Deck
    $("#edit-submit").click(function(){
        commitFunc('/saveEdits')
    });



});