/**
 * User: anfur_000
 * Date: 6/9/13, 4:01 PM
 */

var DATABASE;
var q;

// workaround for weird issue on callbacks on sql calls
var delayedLog = {};
delayedLog.log = function(x){
    this.data.push(x);
};
delayedLog.data = [];
(function foreverLoop() {
    if(delayedLog.data.length)
        console.log(delayedLog.data.splice(0,1)[0]);
    setTimeout(foreverLoop, 100);
})();
var Log = delayedLog.log.bind(delayedLog);


 // SELECT * FROM sqlite_master

(function(){
    "use strict";
    var shortName = 'WorkWorkDB';
    var db;

    var defaultHandleError = function(args) {
        var sqlError = args[1];//promises here only pass 1 param
        Log(sqlError.message);
    }

    var testDump = function(args) {
        var resultSet = args[1];
        var len = resultSet.rows.length;
        var str = "Query Returned " + len + " rows";
        Log(str);
        for (var x=0; x < len; x++)
            Log(resultSet.rows.item(x));
        return resultSet.rows;
    }

    var argumentsToArray = function(cb) {
        return function() {
            var args = FA(arguments);
           return cb.call(null,args.toTrueArray());
        };
    };

    function execute(sql, substitutions) {
        return (new Promise(function(resolve,reject) {
            db.transaction(function(transaction){
                transaction.executeSql(sql, substitutions, argumentsToArray(resolve), argumentsToArray(reject));
            });
        })).then( testDump, defaultHandleError) /* can remove this later */;
    }

    function initDb() {
        try
        {
            if (!window.openDatabase) {
                alert('Not Supported -> Please try with a WebKit Browser');
            } else {

                var version = '1.0';
                var displayName = 'User Settings Database';
                var maxSize = 3072*1024; //  = 3MB            in bytes 65536
                db = openDatabase(shortName, version, displayName, maxSize);
            }
        }
        catch(e)
        {
            if (e == 2) {

                alert("Invalid database version.");
            } else {
                alert("Unknown error "+e+".");
            }return;
        }
    }
    function createTables() {
        // app-specific @todo move
      var code= 'CREATE  TABLE IF NOT EXISTS "savedCode" (' +
      '"id" INTEGER PRIMARY KEY AUTOINCREMENT  ,' +
      '"name" varchar(100) ,' +
      '"snippet" BLOB NULL ,' +
      '"isSuccessful" TINYINT NULL ,' +
      '"session_id" INT NULL , ' +
      '"when" DATETIME NULL , ' +
      '"isAutosave" TINYINT NULL ,' +
      '"challenge_id" INT NULL ,' +
      '"step_id" INT NULL ' +
       ')';

        execute(code);
    }

    initDb();
    createTables();

    DATABASE={db: db, execute: execute};
    q = execute; //console use only
}());
