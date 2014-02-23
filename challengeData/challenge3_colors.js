/**
 * Created with JetBrains PhpStorm.
 * User: anfur_000
 * Date: 4/23/13
 * Time: 1:59 AM
 * To change this template use File | Settings | File Templates.
 */


var avgColor = {}, threeWay;

(function() {
    var to2dhex = function(t) { return ("0" + parseInt(t).toString(16)).substr(-2); };
    var doubleString = function(str) { return "" + str + str;};

    var toSixDigitColor = function(color) {
        if (color.length < 6) {
            return color.split("").map(doubleString).join("");
        }
        return color;
    };
    var hex6ToArray =  function(color) {
        if (color instanceof Array)
            return FA(color).map("(x*255/100)|0"); //already set
        color = toSixDigitColor(color);
        return FA(color.split("")).chunk(2).map(function(a) { return parseInt(a.join(""),16); });
    };

    avgColor = function(c1,c2,pct_b) {
        if (pct_b==undefined)
            pct_b=.5;

        var mix = function  (n1, n2){ return to2dhex((n1 + (n2 - n1) * pct_b)); };
        var shades = [c1,c2].map(hex6ToArray); /* convert to an array of 3 values */
        return _.zip(shades[0],shades[1]).map(function(a) { return a.reduce(mix); }).join("");
    };

    threeWay = function(c1, c2, c3) {
        var shades = [c1,c2, c3].map(hex6ToArray);
        return _.zip.apply(null, shades).map(function(a) { return to2dhex(FA(a).reduce("+") / 3); }).join("");
    };
}());


var striCompare = function (a,b) {
    if ((typeof a ) !== (typeof b))
        return false;
    return a.toLowerCase() === b.toLowerCase();
};

var tripleEquals = function(a,b) {
    return a === b;
}
