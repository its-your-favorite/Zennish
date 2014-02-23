var datesChallenge = {};


datesChallenge.toDate = function(input) {
  if (parseInt(input) == input)
    return new Date(parseInt(input) * 1000);
  return new Date(input);
};

datesChallenge.datesEqual = function (date1, date2)  {
    return (+new Date(date1)) == (+new Date(date2));
};

datesChallenge.cameFirst = function(date1, date2){
    return ((datesChallenge.toDate(date1) < datesChallenge.toDate(date2)) ? datesChallenge.toDate(date1) : datesChallenge.toDate(date2)).toString();
};

datesChallenge.strDifference = function(correct, variant) {
    correct = correct.split("");
    variant = variant.split("");
    return _.difference(correct, variant).length + _.difference(variant,correct).length;
};

datesChallenge.months =
    ['january','february','march','april','may','june','july','august', 'september','october','november','december'];

datesChallenge.findClosestMonth = function(input){
    var differences = FA(datesChallenge.months).map(function(month) {
        return datesChallenge.strDifference(month, input.toLowerCase());
    });
    return datesChallenge.months[differences.indexOf(_.min(differences))];
};

datesChallenge.correctDate = function(str){
    var pieces = str.split(" ");
    var adjustedDate = datesChallenge.findClosestMonth(pieces[0]) + " " + pieces[1] + " " + pieces[2];
    return (new Date(adjustedDate)).toString();
};

datesChallenge.stripTime = function (date) {
    return datesChallenge.toDate(date.toString().split(" ").slice(0,4).join(" "));
};

datesChallenge.add30Secs = function (date) {
    return (datesChallenge.toDate(+datesChallenge.toDate(date)/1000 + 30));
};

datesChallenge.nearbyDate = function(date) {
    return (+datesChallenge.stripTime(datesChallenge.add30Secs(date)))/1000;
};
