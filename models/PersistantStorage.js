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
        return DB.execute.apply(DB, arguments);
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

    /**
     *  @todo obj needs to take more forms e.g. regex comparator
     * @param obj
     * @param limit
     */
    var genericLoad = function(table, obj2, orderBy, limit) {
        var obj = FO(obj2);
        var values = [];
        var query = "SELECT * from " + table  + (obj.keys().length ? ' WHERE ' : '');
        var x;

        query = query + obj.pairs().map(function(item) {
            values.push(item[1]);
            return '[' + item[0] + '] = ?';
        }).join(" AND ");
        if (orderBy  && FO(orderBy).keys().length)
            query += " ORDER BY " + FO(orderBy).map("y, x -> x + ' ' + y ");
        if (limit)
            query += " LIMIT " + limit;
        x = execute(query, values);
        return x;
    }


    ///////////////////////////////////////////////////////////////
    // Specific to this app

    PersistentStorage.saveCode = function(obj){
        var sets = [];
        genericInsert("savedCode", obj);
    };

    PersistentStorage.loadCodeInitial = function(step_id, challenge_id) {
        return PersistentStorage.loadCode({step_id: step_id, challenge_id: challenge_id}, {session_id: "DESC", id: "DESC"}, 1);
    };

    PersistentStorage.loadCode = function(obj, orderBy, limit) {
        return genericLoad("savedCode", obj, orderBy, limit);
    };

}(DATABASE));