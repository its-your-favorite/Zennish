/**
 * Created by Jobs on 2/10/14.
 */

var cards = {};

cards.atLeastPair = function(){
    var groups = cards.getGroups(arguments, cards.getNumber);
    return !!groups.values().filter(">1").length;
};

cards.atLeastTwoPair = function(){
    var groups = cards.getGroups(arguments, cards.getNumber);
    return (groups.values().filter(">1").length > 1);
};

cards.isFlush = function() {
    var groups = cards.getGroups(arguments, cards.getSuit);
    return (groups.values().length == 1);
}

cards.getGroups = function(cards, func){
    return FA(cards).countBy(func);
};

cards.getSuit = function (card) {
    if (card.hasOwnProperty("suit"))
        return card.suit;
    return card.substr(-1);
};

cards.getNumber = function(card){
    if (card.hasOwnProperty("value"))
        return card.value;
    return card.slice(0,-1);
};