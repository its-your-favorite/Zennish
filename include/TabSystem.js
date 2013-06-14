/**
 * User: anfur_000
 * Date: 6/14/13, 12:11 AM
 */

// Jeez, backbone makes these so small
var Tab = function(text, caption){
    this.value = text;
    this.caption = caption;
};


/**
 *
 * @param destination
 * @constructor
 */
var TabSystem = function(destination, changeCallback){
    this.activeTab = -1;
    this.$destination = $(destination);
    this.tabs = [];
    this.changeCallback = changeCallback;
};

TabSystem.prototype.addTab = function(/*Tab*/ tab) {
    this.tabs.push(tab);
    this.selectSomeTab();
};

TabSystem.prototype.closeTab = function(id) {
    this.tabs.splice(id,1);
    this.selectSomeTab();
};

TabSystem.prototype.selectSomeTab = function() {
    this.selectTab(this.tabs.length - 1); //even handles the zero case
};

TabSystem.prototype.selectTab = function(id){
    this.activeTab = id;
    var val = null;
    val = (this.tabs.hasOwnProperty(id) && this.tabs[id].value);
    this.changeCallback(val);
};