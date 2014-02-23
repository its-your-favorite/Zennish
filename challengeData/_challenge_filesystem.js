/**
 * User: anfur_000
 * Date: 6/18/13, 12:34 AM
 */

var command = {};
var commandFromString = {};

//test 1
var commandSet1 = ["put file1 contents1", //ok
    "get file1", //contents1
    "put file1 contents2",  //ok
    "put put put", //ok
    "get put", //put
    "get file1" //contents2
];

//test 2:
// perform test 1 then:
// pass
var commandSet2 = [
    "mkdir testdir", //ok
    "put testdir/put othercontents", // ok !!
    "get get", //fail
    "mkdir testdir/nested", //ok
    "put testdir/nested/another morecontents", //ok
    "get testdir/nested/another", //morecontents
    "mkdir testdir/nested/triple", //ok

    "mkdir testdir/testdir", //ok
    "put testdir/testdir/put 3contents", //ok
    "get testdir/put", // othercontents
];

//test ?: Unused--error cases
//
var commandSet3 = [
    "mkdir abc", //ok
    "mkdir abc", //fail

    "fakeCommand", //fail
    "ntoue oheu oeutn oethn uasthnaou natsehuansethu aou q/qjk/jqk/jqk/kj/qkj/", //fail

    "get abc", //fail -- a dir
    "put abc def", //fail a dir

    "put someFile someWords", //ok
    "put someFile/someOtherFile someWords", //fail

    "get noSuchFile", //fail or blank ? pick one
    "get someFile/test", //fail
];


(function(){
   "use strict";
    var DIR_SEPARATOR = "/";
    var Directory = HashMap;
    var newDir = function () { return new Directory(); };
    var ROOT = newDir();

    var currentPath = ROOT;

    var makeDir = function(oldPath, oldName) {
       var newParts = reparsePath(oldPath, oldName);
       var name = newParts[1];
       var newPath = newParts[0];

       if (newPath.hasKey(name)){
           return "fail";
       }

       newPath.put(name, newDir());
        return "ok";
    };

    var cat = function(oldPath, oldName) {
        var newParts = reparsePath(oldPath, oldName);
        var name = newParts[1];
        var newPath = newParts[0];

        if (!newPath.hasKey(name))
            return 'fail';
        var result = newPath.get(name);
        if (result instanceof Directory)
            return "fail";
        return result;
    };

    var makeFile = function(oldPath, oldName, contents) {
        var newParts = reparsePath(oldPath, oldName);
        var name = newParts[1];
        var newPath = newParts[0];

        if (newPath.hasKey(name) && (newPath.get(name) instanceof Directory))
            return "Is a directory";
        newPath.put(name, contents);
        return "ok";
    };

    var listFiles = function(path) {
        var newPath = path; //traverseToFile(path, name);
        return newPath.keys();
    };

    var pathIsValid = function(path) {
        return !!path;
    };

    /**
     * @returns false || Directory
     */
    var traverseToFile = function(path, namepath) {
        var newPath;
        if (!namepath)
            newPath = path;
        else {
            newPath = traverseTo(path, splitNamePath(namepath)[0]  );
        }
        return pathIsValid(newPath) && newPath;
    };

    // @return [HashMap, /*str*/ name]
    var reparsePath = function(/*Directory*/ oldPath, /* namepath */ oldName) {
        var path = traverseToFile(oldPath, oldName);
        var name = splitNamePath(oldName)[1];
        return [path, name];
    }

    var traverseTo = function traverseTo(/* Directory */ path, /* str[] */ dirs){
        assert(path instanceof Directory);
        if ((!dirs.length) || (!pathIsValid(path)) ) {
            return pathIsValid(path) && path;
        }
        var oneLevelDeeper = path.get(dirs[0]);
        if ((oneLevelDeeper) && (oneLevelDeeper instanceof Directory) )
            return traverseTo(oneLevelDeeper, dirs.slice(1));
        return false;
    };

    /**
     * @returns [(str[]) path, (str)name]
     */
    var splitNamePath = function(/*str*/ namepath) {
        var parts = namepath.split(DIR_SEPARATOR);
        var end = parts.splice(-1)[0];
        return [parts, end];
    };

    command = function(path, commandName, name /* args */) {
        var lookup = {"mkdir": makeDir, "put" : makeFile, "get": cat, "ls": listFiles};
        if (! lookup.hasOwnProperty(commandName) ) {
           return "fail";
        }

        if (! traverseToFile(path, name)) {
            return "fail";
        }

        var args = FA([path, name]).concat(FA(arguments).slice(3));

        return lookup[commandName].apply(null,args);
    };

    commandFromString = function(str) {
        var pieces = str.match(/[^ ]+/g);
        return command(currentPath, pieces[0], pieces[1], pieces[2]);
    };
})();
