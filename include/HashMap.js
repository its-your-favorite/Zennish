/**
 * User: anfur_000
 * Date: 9/2/13, 9:48 PM
 */

var HashMap = function(){
    this.internalObj = {};
    this.prefix = '_!_';
};

HashMap.prototype.addKey = HashMap.prototype.put = function(a,b){
    this.internalObj[this.prefix + a] = b;
};

HashMap.prototype.lookupKey = HashMap.prototype.get = function(a) {
    return this.internalObj[this.prefix + a];
};

HashMap.prototype.hasKey = function(a){
    return this.internalObj.hasOwnProperty(this.prefix + a);
};

HashMap.prototype.keys = function() {
    return _.map(_.keys(this.internalObj), function (x) { return x.slice(3); });
};