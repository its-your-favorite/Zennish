/**
 * User: anfur_000
 * Date: 6/14/13, 12:11 AM
 *
 * at some point here text and extraneous should be refactored together/out. A tab needn't know what "Contents" it has
 *  this makes it less generic, just that it has a "contents" object to hand back.
 */

// TODO refactor this out
var Tab = function (caption, cannotClose, /*optional*/ id, extraneous){
    this.caption = caption;
    this.canClose = !cannotClose;
    this.id = id;
    this.extraneous = extraneous;
};

Tab.prototype.rename = function(newName) {
    PersistentStorage.renameSave(this.id, newName);
};

/**
 * Remember this returns a reference potentially
 * @returns {*}
 */
Tab.prototype.getValue = function() {
    return this.extraneous;
}

/**
 *
 * @param destination
 * @constructor
 */
var TabSystem = function(destination, changeCallback, valueGetterCallback){
    this.activeTab = -1;
    this.$destination = $(destination);

    this.tabs = [];
    this.newTabTab = new Tab("+", true);
    this.changeCallback = changeCallback;
    this.valueGetterCallback = valueGetterCallback;
};

TabSystem.prototype.enumerateTabs = function(){
    return FA(this.tabs);
};

TabSystem.prototype.addTab = function(/*Tab*/ tab) {
    this.tabs.push(tab);
    this.selectSomeTab();
};

TabSystem.prototype.addBlankTab = function() {
    this.tabs.push(new Tab("New Tab",false,null,{}));
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
TabSystem.prototype.selectTab = function(index, discardExisting){
    // NOTE: Id and Index are different in this function. Not sure if that dependency is important.
    var oldIndex = this.activeTab;
    this.activeTab = index;
    var newVal = null;

    newVal = (this.tabs.hasOwnProperty(index) && this.tabs[index].extraneous);
    if (!discardExisting) {
        this.valueGetterCallback(this.tabs[oldIndex].getValue());//update by reference
    }
    var result = this.changeCallback(newVal); //update local copy of tab
};

/**
 *
 */
TabSystem.prototype.lookupTabIndexById = function(id) {
    var lookup = rekey(this.tabs, "id");
    return lookup[id];
}