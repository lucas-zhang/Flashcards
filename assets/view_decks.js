$(document).ready(function(){
    jQuery.easing.def;
    var clickTracker = {};

    $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                $("#card-modal").fadeOut('slow');
                $(".welcome-message").css("opacity", "1");
                $("#card-view-overlay").fadeOut('slow');
            }
        });

    //List view code
    $(document).on("click", "#view-list", function(e){
        var clicked = $(this);
        var deckID = $(this).parent().parent().attr("data-id");
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
            console.log(clickTracker);  
            if (clickTracker[deckID] > 0) {
                $(deck_row).height(curr_height + 30);
                $(clicked).text("Hide List");
                $(clicked).addClass("view-button-active");
                setTimeout(function(){
                    $(hidden).fadeIn(400);
                },100);

            } else {
                $.ajax({
                    type: "GET",
                    url: "/getCards",
                    dataType: "json",
                    data: {"deckID": deckID} 
                    

                 })

                .done(function(obj) {
                    console.log("entered done");
                    
                    var numCards = (Object.keys(obj).length)/2;
                    var final_height = curr_height + (30 * numCards);
                    var insertText = "";
                    for (var i = 0; i < numCards; i ++) {
                        console.log('front' + i.toString());
                        var cardRow = "<div class = 'hidden-row'><div class = 'hidden-card-num'>" 
                        + (i+1).toString() + "</div>" + "<div id = 'hidden-word' class = 'hidden-text'>" +
                        obj['front' + i.toString()] + "</div><div id = 'hidden-def' class = 'hidden-text'>" + 
                        obj['back' + i.toString()] + "</div></div>";

                        insertText += cardRow;
                    }
                    $(deck_row).height(curr_height + 30);
                    $(clicked).text("Hide List");
                    $(clicked).addClass("view-button-active");
                    setTimeout(function() { 
                        $(hidden).fadeIn(400);
                        $(insertText).appendTo($(hidden)).fadeIn(500); 
                    },100);

                });
                e.preventDefault();
                clickTracker[deckID] = 1;
            }
            
        }
    });
    
    //Card View code


    $(document).on("click", "#view-cards", function(){
        $("#card-modal").fadeIn('slow');
        $(".welcome-message").css("opacity", "0");
        $("#card-view-overlay").fadeIn('slow')
    }); 


    $("#card-view-overlay").click(function() {
        $("#card-modal").fadeOut('slow');
        $(".welcome-message").css("opacity", "1");
        $(this).fadeOut('slow');
    });

    $("#flip-card").click(function() {
        if ($(".current-card").hasClass("flipped")){
            $("#front-text").fadeOut(0);
            $(".current-card").removeClass("flipped");
            setTimeout(function(){
                $("#front-text").fadeIn(800);
            }, 500);

        } else {
            $("#back-text").fadeOut(0);
            $(".current-card").addClass("flipped");
            setTimeout(function(){
                 $("#back-text").fadeIn(800);
            },500);
            
        }
    });




    $("#next-arrow").click(function() {
        $(".current-card").fadeOut(400);
        $("#front").fadeOut(200);

        setTimeout(function(){
             $("#front").text("Next");
         },200);
        setTimeout(function(){
            $(".current-card").fadeIn(400);
            $("#front").fadeIn(500);
           
        }, 200);
    });

    $("#next-arrow").hover(function() {
        $(this).css("background-color", "white");
        $(this).children(".arrow-image").attr("src", "/static/img/next_arrow_hover.png");
    }, function(){
        $(this).css("background-color", "black");
        $(this).children(".arrow-image").attr("src", "/static/img/next_arrow.png");
    });




    $("#prev-arrow").click(function() {
        $(".current-card").fadeOut(400);
        $(".card-term").fadeOut(200);

        setTimeout(function(){
             $(".card-term").text("Prev");
         },200);
        setTimeout(function(){
            $(".current-card").fadeIn(500);
            $(".card-term").fadeIn(500);
           
        }, 200);
    })

    $("#prev-arrow").hover(function() {
        $(this).css("background-color", "white");
        $(this).children(".arrow-image").attr("src", "/static/img/prev_arrow_hover.png");
    }, function(){
        $(this).css("background-color", "black");
        $(this).children(".arrow-image").attr("src", "/static/img/prev_arrow.png");
    });




});