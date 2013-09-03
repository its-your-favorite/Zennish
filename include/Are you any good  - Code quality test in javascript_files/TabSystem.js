/**
 * User: anfur_000
 * Date: 6/14/13, 12:11 AM
 */

// Jeez, backbone makes these so small
var Tab = function(text, caption, specialCallback, cannotClose){
    this.value = text;
    this.caption = caption;
    this.canClose = !cannotClose;
    this.specialCallback = specialCallback;
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
    this.tabs.push(new Tab("", "+", this.addBlankTab.bind(this ), true));
    this.changeCallback = changeCallback;
};

TabSystem.prototype.addTab = function(/*Tab*/ tab) {
    this.tabs.push(tab);
    this.selectSomeTab();
};

TabSystem.prototype.addBlankTab = function(id) {
    this.tabs.push(new Tab("", "New Tab"));
};

TabSystem.prototype.closeTab = function(id) {
    this.tabs.splice(id,1);
    this.selectSomeTab();
};

TabSystem.prototype.selectSomeTab = function() {
    this.selectTab(this.tabs.length - 1, true); //even handles the zero case
};

/**
 *
 * @param id
 * @param discardExisting Whether to store changes to the tab back to the system
 * @returns {*}
 */
TabSystem.prototype.selectTab = function(id, discardExisting){
    if (this.tabs[id].specialCallback) {
        return this.tabs[id].specialCallback();
    }
    var oldId = this.activeTab;
    this.activeTab = id;
    var val = null;
    val = (this.tabs.hasOwnProperty(id) && this.tabs[id].value);
    var result = this.changeCallback(val); //update local copy of tab
    if (!discardExisting) {
        this.tabs[oldId].value = result;
    }
};