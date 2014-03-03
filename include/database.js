/**
 * User: anfur_000
 * Date: 6/9/13, 4:01 PM
 */

var DATABASE;
var q;

// delayedLog is a workaround for weird issue on callbacks on sql calls
var delayedLog = {};
delayedLog.log = function(x){
    this.data.push(x);
};

delayedLog.data = [];
(function foreverLoop() {
    if(delayedLog.data.length) {
        console.log(delayedLog.data.splice(0,1)[0]);
    }
    setTimeout(foreverLoop, 100);
})();
var log = delayedLog.log.bind(delayedLog);


 // SELECT * FROM sqlite_master

(function(){
    "use strict";
    var shortName = 'WorkWorkDB';
    var db;

    var defaultHandleError = function(args) {
        var sqlError = args[1];//promises here only pass 1 param
        log(sqlError.message);
    }

    //used for select queries
    var testDump = function(args) {
        var resultSet = args[1];
        var len = resultSet.rows.length;
        var str = "Query Returned " + len + " rows";
        //Log(str);
        for (var x=0; x < len; x++) {

            //log(resultSet.rows.item(x));
        }
        return resultSet.rows;
    }

    var argumentsToArray = function(cb) {
        return function() {
            var args = FA(arguments);
           return cb.call(null,args.toTrueArray());
        };
    };

    function execute(sql, substitutions) {
        var summarizeResults = testDump; //for select
        if (sql.substring(0,6).toLowerCase() == "insert" ) {
            summarizeResults = function(res){
                return res[1];//insert Id and such info
            }
        }
        //could do an update case too, and/or delete

        return (new Promise(function(resolve,reject) {
            db.transaction(function(transaction){
                transaction.executeSql(sql, substitutions, argumentsToArray(resolve), argumentsToArray(reject));
            });
        })).then( summarizeResults, defaultHandleError) /* can remove this later */;
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
            }
            return;
        }
    }


    function createTablesIfNecessary() {
        // app-specific @todo move
      var code= 'CREATE  TABLE IF NOT EXISTS "savedCode" (' +
      '"id" INTEGER PRIMARY KEY AUTOINCREMENT  ,' +
      '"name" varchar(100) ,' +
      '"snippet" BLOB NULL ,' +
      '"isSuccessful" TINYINT NULL ,' +
      '"created_session_id" INT NULL , ' +
      '"when" DATETIME NULL , ' +
      '"isAutosave" TINYINT NULL ,' +
      '"deleted" TINYINT default 0 ,' +
      '"challenge_id" INT NULL ,' +
      '"step_id" INT NULL , ' +
      '"last_utilized_session_id" INT NULL ' +
       '); ';

       var code2 = 'CREATE TABLE IF NOT EXISTS "appSettings" (' +
            '"id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            '"showed_splash_screen" TINYINT NULL' +
            ');' ;

       var code3 = 'CREATE TABLE IF NOT EXISTS "scores" (' +
           '"id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"score" INT default 0, ' +
           '"WHEN" DATETIME NULL,' +
           '"challenge_id" VARCHAR(30) NULL ' +
           ' )';


        execute(code);
        execute(code2);
        return execute(code3);
    }

    function setupAppSettingsIfNecessary() {
        var query = "SELECT count(id) from 'appSettings'; ";
        var addQuery = "INSERT INTO appSettings (id, showed_splash_screen) VALUES (0, 0);";
        return new Promise(function(succ, fail) {
            execute(query).then(function(x){
                if (_.values(x.item(0))[0])
                    return succ(); //already has row
                return execute(addQuery).then(succ);
            });
        });

    }

    function eradicate() {
        execute("DELETE from savedCode");
        execute("DELETE from appSettings");
        execute("DROP TABLE savedCode");
        execute("DROP TABLE appSettings");
        execute("DROP TABLE scores");
    }

    initDb();
    createTablesIfNecessary().then(function(){
        setupAppSettingsIfNecessary();
    });

    DATABASE={db: db, execute: execute, eradicate: eradicate};
    q = execute; //console use only
}());
