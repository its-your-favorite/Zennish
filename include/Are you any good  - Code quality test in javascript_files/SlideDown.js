/**
 * User: anfur_000
 * Date: 6/5/13, 11:43 PM
 */

var NoteSystem = {};
(function(){
    "use strict";

    //maybe make a traditional class out of this?
    var numNotes = 1;
    NoteSystem.showNewNote = function(message, waitPeriod) {
        var note = $("<span  class='slideDownNote'>");
        var container = $("<div  class='slideDownNoteContainer'>");
        var scrollingTime = 2000;

        container.append(note);
        var colorCyclePeriod = 10;
        var currentSeconds = (new Date() / 1000) % colorCyclePeriod; //seconds into current minute
        waitPeriod = waitPeriod || 3000;
        waitPeriod = waitPeriod * numNotes + scrollingTime; //if a bunch show up at once you need more reading time
        
        note.text(message);
        container.hide();
        fe("#noteBox").append(container);
        container.css("z-index", 600 - numNotes);
        container.css({"top": -1 * container.height(), "marginBottom": -1 * container.height()}).show();

        note.css("backgroundColor", "#" + avgColor("5A5", "55A", Math.abs(currentSeconds*2 - colorCyclePeriod)/colorCyclePeriod));
        container.animate({"top": 0, "marginBottom": 0}, scrollingTime, function(){
            container.css('z-index', 602);
        });

        numNotes++;
        setTimeout(function() {
            numNotes--;
            container.css("z-index",500);//slide behind
            container.animate({"top": -1 * container.height(), "marginBottom": -1 * container.height()}, scrollingTime, container.remove.bind(container));
        }, waitPeriod);
        };
    }());

$(function(){
    NoteSystem.showNewNote("Reminder you made this awesome note system",1000);
    NoteSystem.showNewNote("And you are bomb-saurus");
});