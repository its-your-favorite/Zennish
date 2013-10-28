/**
 * User: anfur_000
 * Date: 9/2/13, 8:39 PM
 */
var setTag, getAllTagsOnObject, getAllByTag, getAllByTagCombo, renameTag;

// 1. Set & retrieve tags by id
// 2. retrieve by tag
// 3. rename tag
(function() {

    "use strict";
    var tagSet = new HashMap();
    var allTags = new HashMap();

    var tagIdsToNames = function(ids) {
        return _.map(ids, function(id) {
            return allTags.get(id);
        });
    };

    var getTagId = function (tagKey) {
        if (_.values(allTags).indexOf(tagKey) == -1) {
            allTags.put(allTags.keys().length, tagKey);
        };
        return _.values(allTags.internalObj).indexOf(tagKey);
    };

    var ensureIndex = function(arr, key) {
        if (! arr.hasKey(key) ) {
            arr.put(key, new HashMap());
        }
    };

    renameTag = function(prevName, newName) {
        allTags[getTagId(prevName)] = getTagKey(newName);
    };

    setTag = function(tagName, objectKey) {
        var tagKey = getTagId(tagName);
        ensureIndex(tagSet, objectKey);
        tagSet.get(objectKey).put(tagKey, true);
    };

    getAllTagsOnObject = function(objectKey) {
        ensureIndex(tagSet, objectKey);
        return tagIdsToNames(tagSet.get(objectKey).keys());
    };

    getAllByTag = function(tag) {
        var tagId = getTagId(tag);
        var objectsWith = _.filter(tagSet.keys(), function(key) {
            var thisObj =  tagSet.get(key);
            return thisObj.hasKey(tagId);
        });
        return (objectsWith);
    };

/*
    getAllByTagCombo = function(tagCombo) {
        var tagPieces = _.keys(tagCombo);

        var objectsWith = _.filter(_.keys(tagSet), function(key) {
            var thisObj =  tagSet[key];
            return _.every(tagPieces, function (tagPiece){
                return thisObj.hasOwnProperty(getTagIdFromName(tagPiece)) == tagCombo[tagPiece];
            });
        });
        return stripFirstChar(objectsWith);
    };*/

}());

setTag("tag1", "obj1");
setTag("tag2", "obj1");
setTag("tag1", "obj2");

console.log(getAllTagsOnObject("obj1"));
console.log(getAllByTag("tag1"));
console.log(getAllByTag("tag2"));
console.log(getAllByTag("tag3"));
//console.log(getAllByTagCombo({tag1: true, tag2: false}));
//console.log(getAllByTagCombo({tag1: true, tag2: true}));
//console.log(getAllByTagCombo({tag1: true, tag3: true}));

