/**
 * User: anfur_000
 * Date: 9/2/13, 8:39 PM
 */

FYI
/*   {
 name: "Let's Play Tag",
 id: '1-tag',
 description: "Challenges around a tag system",
 defaultComparer: striCompare,
 defaultSolution: avgColor,
 steps: [
 {
 id: 0,
 story: "Put a story here!",
 description: "",
 addFunction: ['averageColors', 'color1', 'color2'],
 tests: [['ffffff', '000000' ], ['123456', 'AAAAAA']  ] /* answer followed by sets of parameters */
},
{
    id: 1,
        description: "Instead of simply averaging, now allow for a balance anywhere on the scale of mixtures. A third parameter \"balance\" will be passed which ranges from 0 to 1 to indicate the % balance of color1 and color2 to mix. When balance is 0, this indicates only to use color1, when balance is 1 it indicates only to use color2, and .5 would indicate an equal balance",
    addFunction: ['mixColors', 'color1', 'color2', 'balance'],
    tests: [['ffffff', '000000', .5 ], ['000000', 'afeff1', 1 ], ['F0010F', 'F0010F', .1234], ['F0010F', 'FFF000', 0]  ] /* answer followed by sets of parameters */
},
{
    id: 2,
        description: "Most modern browsers now allow for a 3-digit hex notation for some colors. Support this notation as an input in your existing and future functions (but continue to always return 6 digit notation).",
    /* NA addFunction: ['mixColors', 'color1', 'color2', 'balance'], */
    defaultTestee: 'mixColors',
    tests: [['000', 'FFF', .5 ], ['111', '333', .5 ], ['F0010F', 'F0010F', .1234], ['F0010F', 'FFF000', 0]  ] /* answer followed by sets of parameters */
},
{
    id: 3,
        description: "Now define a function to do an equal 3-way-mix",
    addFunction: ['menageaTrois', 'color1', 'color2', 'color3'],
    defaultSolution: threeWay,
    tests: [['000','111','222'], ['109','249','6B9'] ],
},
{
    id: 4,
        description: "Now make all three functions work with colors defined as arrays of numbers that represent percentages. For example red would be [100,0,0] instead of FF0000 ",
    tests: [{testee: "menageaTrois", params: [[12, 23, 34], [34, 45, 67],[55, 33, 11]], solver: threeWay},
    {testee: 'averageColors', params:[[0,0,0], [100,0,50]], solver: avgColor},
    {testee: 'mixColors', params: [[10,10,10],[30,30,30],.3], solver: avgColor } ]
}
], //</steps>
}*/


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

