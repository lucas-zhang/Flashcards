$(document).ready(function(){
  $.urlParam = function(name){
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results == null) {
          return null;
      }
      return results[1];
  };
  var deckID = $.urlParam('deckID');
  var numCards;
  var originalCards;
  var cards = [];
  $.ajax({
    type: "GET",
    url: "/getCards",
    dataType: "json",
    data: {"deckID": deckID} 

 }).done(function(obj) {
    numCards = (Object.keys(obj).length)/2;
    for(var i = 0; i < numCards; i++) {
      currCard = {};
      currCard['front'] = obj['front' + i.toString()];
      currCard['back'] = obj['back' + i.toString()];
      cards.push(currCard);
    }

    originalCards = cards;
 });

var currIndex = 0;
var prevScore = 0;
var scores = [];
var score = 0;
var wrongCards = [];
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function handleQuizState(isNext, isCorrect) {

  if (isNext) {
    scores.push(score);
    
    if(isCorrect) {
      score++;
    } else {
      wrongCards.push(cards[currIndex]);
    }
    currIndex ++;
    if (currIndex == numCards){  
      $('#after-message').text("You completed the quiz with a score of " + score.toString() + '/' + numCards.toString() + "!");
      if (score == numCards) {
        $("#requiz-button").text("Re-Quiz Original Deck");
      } else {
        $("#requiz-button").text("Re-Quiz Incorrect Cards");
      }
      setTimeout(function(){
        $(".current-card, #score, #back-icon, #flipNotice, #flip-icon, #correctContainer, #header-container").fadeOut(300);
      }, 500);
      setTimeout(function(){
        $("#after-quiz").fadeIn(300);
      },800);


    }

  } else {
    score = scores[currIndex - 1]
    scores.pop();
    currIndex --;
  }
  if (currIndex > 0) {
    $("#back-icon").fadeIn(300);
  } else {
    $("#back-icon").fadeOut(300);
  }
  $("#score").text("Current Score: " + score.toString() + "/" + currIndex.toString());
  $('#cards-left').text("Cards Left: " + (numCards - currIndex).toString());
  $("#correctContainer").fadeOut(100);
  $(".current-card").removeClass("flipped");
  $("#front-text").fadeOut(100);
  setTimeout(function(){
    $("#front-text").fadeIn(500);
    $("#front-text").text(cards[currIndex].front);
    $("#back-text").text(cards[currIndex].back);
    $("#flipNotice").fadeIn(500); 
  },100);

}


 $(document).on('click', '#shuffle,#default', function() {
  if($(this).attr('id') == "shuffle") {
    cards = shuffle(cards);
  }
  $("#score").text("Current Score: 0/0");
  $("#score").fadeIn(500);
  $('#cards-left').text("Cards Left: " + numCards.toString());
  $('#header-container').fadeIn(500);
  
  $("#front-text").fadeOut(300);
  $("#back-text").fadeOut(300);

  setTimeout(function() {
    $("#front-text").text(cards[0].front);
    $("#back-text").text(cards[0].back);
    $("#flipNotice").fadeIn(500);
    $("#flip-icon").fadeIn(500);
  },300);
  setTimeout(function(){

    $("#front-text").fadeIn(0);
    $("#back-text").fadeIn(0);
  }, 300);

  $("#before-quiz").fadeOut(300);
 })
 $(document).on('click','#correct,#incorrect', function(){
  handleQuizState(true, $(this).attr('id') == 'correct');
 });

  var flipFunc = function(){     
    $("#flipNotice").fadeOut(300)
    
    setTimeout(function(){
     
      $("#correctContainer").fadeIn(300); 
      
    }, 300);
    if ($(".current-card").hasClass("flipped")){
         $(".current-card").removeClass("flipped");
        $("#front-text").fadeOut(0);

       
        setTimeout(function(){
            $("#front-text").fadeIn(200);
        }, 200);

    } else {
        $("#back-text").fadeOut(0);
        $(".current-card").addClass("flipped");
        setTimeout(function(){
             $("#back-text").fadeIn(200);
        },200);
        
    }

  };
  $(document).on("click","#requiz-button", function(){
    if ($(this).text() != "Re-Quiz Incorrect Cards") {
      cards = shuffle(originalCards);
    } else {
      cards = shuffle(wrongCards);
    }
    
    wrongCards = [];
    numCards = cards.length;
    score = 0;
    scores = [];
    currIndex = 0;
    $('#after-quiz').fadeOut(300);
    $('#front-text').text(cards[0].front);
    $('#back-text').text(cards[0].back);
    $('#score').text("Current Score: 0/0")
    $('#cards-left').text("Cards Left: " + numCards.toString());

    setTimeout(function(){
      $(".current-card, #score, #back-icon, #flipNotice, #flip-icon, #header-container").fadeIn(300);
    }, 300);

  });
  $(document).on("click", "#back-icon", function(){
    handleQuizState(false, false);
  });
  $(document).on("click", "#flip-icon", flipFunc);





});