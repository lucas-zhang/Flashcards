$(document).ready(function(){


    $("#deck-title").focus();



    $(document).on('focus.textarea', '.autoExpand', function(){

        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;

        var next = this.nextElementSibling;
        var savedValue2 = next.value;
        next.value = '';
        next.baseScrollHeight = next.scrollHeight;
        next.value = savedValue2;


    });
    $(document).on('input.textarea', '.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0,rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;

        var next = this.nextElementSibling;
        var minRows2 = next.getAttribute('data-min-rows')|0,rows;
        next.rows = minRows2;
        rows2 = Math.ceil((next.scrollHeight - next.baseScrollHeight) / 17);
        next.rows = minRows2 + rows2;
    });

    $("#next-button").click(function(){
        curr = $(window).scrollTop();
        dest = curr + 60;
        var newRow = "<div style = 'display: none' class='card-row'><textarea class = 'card-text'></textarea><textarea class = 'card-text'></textarea></div>";
        $(newRow).appendTo("#card-space").fadeIn('slow');
        $('body, html').animate({scrollTop: dest}, 450);
        $("#card-space").children(":last-child").children(":first-child").focus();
    
    });

});