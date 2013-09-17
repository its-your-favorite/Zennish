/**
 * User: anfur_000
 * Date: 6/9/13, 6:05 PM
 */

var PersistentStorage = {};

/**
 * @param DB object with .execute that takes sql
 */
(function(DB) {
    var execute = function() {
        return PersistentStorage.resultSetToArray(DB.execute.apply(DB, arguments));
    };

    var objToInsert = function(obj2){
        var obj = FO(obj2);
        return ["([" + obj.keys().join("],[") + "]) VALUES (" + obj.keys().map("'?'").join(",") + ")", obj.values() ];
    };

    var genericInsert = function (table, obj) {
        var toInsert = objToInsert(obj);
        var query = "INSERT INTO [" + table + "] " + toInsert[0];
        return execute(query, toInsert[1]);
    };

    var getWhereClause = function (whereObj) {
        var obj = FO(whereObj);
        var substitutions = [];
        var query = obj.pairs().map(function(item) {
            substitutions.push(item[1]);
            return '[' + item[0] + '] = ?';
        }).join(" AND ");
        if (query.length ) {
            query = " WHERE " + query;
        }
        return [query, substitutions];
    };

    var genericUpdate = function(table, changes, where) {
        var substitutions = [];
          var queryPiece = FO(changes).pairs().map(function (pair) {
              substitutions.push(pair[1]);
              return pair[0] + " = ? ";
          }).join(",");
          var whereClause = getWhereClause(where);
          var fullQuery = "UPDATE " + table + " SET " + queryPiece + " " + whereClause[0];
            substitutions = substitutions.concat(whereClause[1]);
        x = execute(fullQuery, substitutions);
        return x;
    };
    /**
     *  @todo obj needs to take more forms e.g. regex comparator
     * @param obj
     * @param limit
     */
    var genericLoad = function(table, whereObj, orderBy, limit) {
        var where = getWhereClause(whereObj);
        var query = "SELECT * from " + table  + where[0];
        var x;

        if (orderBy  && FO(orderBy).keys().length)
            query += " ORDER BY " + FO(orderBy).map("y, x -> x + ' ' + y ");
        if (limit)
            query += " LIMIT " + limit;

        x = execute(query, where[1]);
        return x;
    }


    ///////////////////////////////////////////////////////////////
    // Specific to this app

    PersistentStorage.saveCode = function(obj){
        var sets = [];
        genericInsert("savedCode", obj);
    };

    PersistentStorage.loadCodeInitial = function(stepId, challengeId) {
        return PersistentStorage.loadCode({step_id: stepId, challenge_id: challengeId}, {session_id: "DESC", id: "DESC"}, 1);
    };

    PersistentStorage.loadAllSaves = function(stepId, challengeId){
        return PersistentStorage.loadCode({challenge_id: challengeId}, {id: "DESC"}).then(function(success,fail){
            return success.map(function(load){
               load.linesOfCode = load.snippet.split("\n").length;
               load.prettyDate = (new Date(load.when)).format("mmm d h:MM:ss");
               load.stepNum = load.step_id + 1;

                return load;
            });
        });
    };

    PersistentStorage.renameSave = function(saveId, newName) {
      return genericUpdate("savedCode", {"name": newName}, {"id": saveId});
    };

    PersistentStorage.loadCode = function(obj, orderBy, limit) {
        return genericLoad("savedCode", obj, orderBy, limit);
    };

    /**
     * Makes an array promise
     * @param sqlResultsetPromise
     * @return array of object Promise
     */
    PersistentStorage.resultSetToArray = function(sqlResultsetPromise){
        return sqlResultsetPromise.then(function(okay,fail){
            var newResult = FA([]);
            for (var x = 0; x < okay.length; x++)
                newResult.push( okay.item(x));
            return newResult;
        });
    };
}(DATABASE));