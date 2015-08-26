$(document).ready(function(){
    jQuery.easing.def;
    var clickTracker = {};
    var objectOfJSONs = {};

    $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                $("#card-modal").fadeOut('slow');
                $(".welcome-message").css("opacity", "1");
                $("#card-view-overlay").fadeOut('slow');
            }
    });

    //edit request
    $(document).on("click", "#edit-button", function(e) {
        var deckID = $(this).parent().parent().attr("data-id");
        $.ajax({
            url:   "/edit_deck",
            data:  {'deckID': deckID},
            async: false
        });
        e.preventDefault();
        console.log("ajax done");
    });
    //List view code

    $(document).on("click", "#view-list", function(e){
        var clicked = $(this);
        var deckID = $(this).parent().parent().attr("data-id");
        console.log(deckID);
        var deck_row = $(this).parent().parent();
        var hidden = $(deck_row).next();
        var curr_height = $(deck_row).height();

        if ($(this).text() == "Hide List"){
            setTimeout(function(){
                $(deck_row).height(curr_height - 30);
            }, 150);
            
            $(hidden).fadeOut(200);


            $(this).text("View List");
            $(this).removeClass("view-button-active");

        } else {  
            var insertText = "";
            if (clickTracker[deckID] == null){ //first time clicked  
                console.log(true);
                $.ajax({
                    type: "GET",
                    url: "/getCards",
                    dataType: "json",
                    data: {"deckID": deckID} 

                 })

                .done(function(obj) {

                    console.log("entered done");
                    objectOfJSONs[deckID] = obj;
                    var numCards = (Object.keys(obj).length)/2;
                    var final_height = curr_height + (30 * numCards);
                    for (var i = 0; i < numCards; i ++) {
                        console.log('front' + i.toString());
                        var cardRow = "<div class = 'hidden-row'><div class = 'hidden-card-num'>" 
                        + (i+1).toString() + "</div>" + "<div id = 'hidden-word' class = 'hidden-text'>" +
                        obj['front' + i.toString()] + "</div><div id = 'hidden-def' class = 'hidden-text'>" + 
                        obj['back' + i.toString()] + "</div></div>";

                        insertText += cardRow;
                    }
                });
                e.preventDefault();
                clickTracker[deckID] = 1;
            }
            console.log(insertText);
            $(deck_row).height(curr_height + 30);
            $(clicked).text("Hide List");
            $(clicked).addClass("view-button-active");
            setTimeout(function(){
                $(hidden).fadeIn(400);
                $(insertText).appendTo($(hidden)).fadeIn(500); 
            },100);
        }
    });
    
    //Card View code

    var indexTracker = {}; //Maps deck ID to current index
    var flipped = {}; // map of deck id to whether the last card show was flipped or not
    var currDeckID;

    //Initiate card modal and bring it up
    $(document).on("click", "#view-cards", function(){
        var deckID = $(this).parent().parent().attr("data-id");
        var switched = false; //boolean did we change decks
        if (deckID != currDeckID) {
            switched = true;
        }
        var deckJSON = objectOfJSONs[deckID];
        var curr_index = indexTracker[deckID]
        var isFlipped = flipped[deckID];
        if (curr_index == null) {
            console.log('first time clicked for this deck');
            curr_index = 0;
            indexTracker[deckID] = curr_index;
            isFlipped = false;
        }
        if (isFlipped) {
            $("#side-indicator").text("Back");
        } else {
            $("#side-indicator").text("Front");
        }
        if (!isFlipped && $(".current-card").hasClass("flipped")) {
            console.log("if statement");
            $(".current-card").removeClass("flipped");
        } else if(isFlipped && !$(".current-card").hasClass("flipped")) {
            console.log("else if");
            $(".current-card").addClass("flipped");
        }
        var firstFront;
        var firstBack;
        if (deckJSON != null) {
            firstFront = deckJSON['front' + (curr_index).toString()];
            firstBack = deckJSON['back' + (curr_index).toString()];
            $("#front-text").text(firstFront);
            $("#back-text").text(firstBack);
            var numCards = (Object.keys(objectOfJSONs[deckID]).length)/2;
        } else {
            $.ajax({
                type: "GET",
                url: "/getCards",
                dataType: "json",
                data: {"deckID": deckID} 

             })
            .done(function(jsonObj){
                objectOfJSONs[deckID] = jsonObj;
                firstFront = objectOfJSONs[deckID]['front' + (curr_index).toString()];
                firstBack = objectOfJSONs[deckID]['back' + (curr_index).toString()];
                $("#front-text").text(firstFront);
                $("#back-text").text(firstBack);
                var numCards = (Object.keys(objectOfJSONs[deckID]).length)/2;
                $("#card-count").text((curr_index + 1).toString() +' / '+numCards);

            });

        }
        $("#card-count").text((curr_index + 1).toString() +' / '+numCards);
        $("#card-modal").fadeIn('slow');
        $(".welcome-message").css("opacity", "0");
        $("#card-view-overlay").fadeIn('slow')
        currDeckID = deckID;
    }); 

    
    //Close Modal
    $("#card-view-overlay").click(function() {
        $("#card-modal").fadeOut('slow');
        $(".welcome-message").css("opacity", "1");
        $(this).fadeOut('slow');
    });

    //Flip card animation
    var flipFunc = function(){        
        if ($(".current-card").hasClass("flipped")){
             $(".current-card").removeClass("flipped");
            $("#front-text").fadeOut(0);
            $("#side-indicator").text("Front");
            flipped[currDeckID] = false;

           
            setTimeout(function(){
                $("#front-text").fadeIn(200);
            }, 200);

        } else {
            $("#back-text").fadeOut(0);
            $(".current-card").addClass("flipped");
             $("#side-indicator").text("Back");
            flipped[currDeckID] = true;
            setTimeout(function(){
                 $("#back-text").fadeIn(200);
            },200);
            
        }

    };
    $("#flip-card").click(flipFunc);



    //Next card  
    $("#next-arrow").click(function() {
        flipped[currDeckID] = true;
         $("#side-indicator").text("Front");
        var numCards = (Object.keys(objectOfJSONs[currDeckID]).length)/2;
        var curr_index = indexTracker[currDeckID];

        var next_index = (curr_index + 1)% numCards; 
        
        console.log("current index: " + curr_index);
        $("#card-count").text((next_index + 1).toString() +' / '+numCards);

        
        if($(".current-card").hasClass("flipped")) {
            $(".current-card").removeClass("flipped");
           
                
        } 

        setTimeout(function(){
            $(".current-card").fadeOut(200);
        },200);
        $("#front").fadeOut(200);

        setTimeout(function(){
             $("#front-text").text(objectOfJSONs[currDeckID]['front' + (next_index).toString()]);
             $("#back-text").text(objectOfJSONs[currDeckID]['back' + (next_index).toString()]);
         },200);
           
        setTimeout(function(){
            $(".current-card").fadeIn(200);
            $("#front").fadeIn(200);
           
        }, 500);
        setTimeout(function() {
            indexTracker[currDeckID] = next_index;
        }, 500)
    });



    $("#next-arrow").hover(function() {
        
        $(this).css("background-color", "white");
        $(this).children(".arrow-image").attr("src", "/static/img/next_arrow_hover.png");
    }, function(){
        $(this).css("background-color", "black");
        $(this).children(".arrow-image").attr("src", "/static/img/next_arrow.png");
    });



    //Prev card
    $("#prev-arrow").click(function() {
         $("#side-indicator").text("Front");
        flipped[currDeckID] = true;
        var curr_index = indexTracker[currDeckID];
        var prev_index;
        var numCards = (Object.keys(objectOfJSONs[currDeckID]).length)/2;
        if (curr_index == 0) {
            prev_index = numCards - 1;
        } else {
            prev_index = curr_index - 1;
        }

        $("#card-count").text((prev_index + 1).toString() +' / '+numCards);
        if($(".current-card").hasClass("flipped")) {
            $(".current-card").removeClass("flipped");   
        } 

        $(".current-card").fadeOut(400);
        $("#front").fadeOut(200);
        $("#front-text").fadeOut(200);

        setTimeout(function(){
            $("#front-text").text(objectOfJSONs[currDeckID]['front' + (prev_index).toString()]);
            $("#back-text").text(objectOfJSONs[currDeckID]['back' + (prev_index).toString()]);

         },200);
            $("#front-text").fadeIn(200);
        setTimeout(function(){
            $(".current-card").fadeIn(400);
            $("#front").fadeIn(500);
           
        }, 200);
        setTimeout(function() {
            indexTracker[currDeckID] = prev_index;
        }, 500)
    });

    $("#prev-arrow").hover(function() {
        $(this).css("background-color", "white");
        $(this).children(".arrow-image").attr("src", "/static/img/prev_arrow_hover.png");
    }, function(){
        $(this).css("background-color", "black");
        $(this).children(".arrow-image").attr("src", "/static/img/prev_arrow.png");
    });




});