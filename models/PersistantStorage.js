/**
 * User: anfur_000
 * Date: 6/9/13, 6:05 PM
 */

var PersistentStorage = {};
const savedCode = "savedCode";

/**
 * @param DB object that provides IndexedDB helpers
 */
(function(DB) {
    function select(table, whereObj, orderBy, limit) {
        return DB.select(table, {
            where: whereObj || {},
            orderBy: orderBy,
            limit: limit
        });
    }

    function update(table, changes, where) {
        return DB.update(table, changes || {}, where || {});
    }

    PersistentStorage.saveCode = function(obj){
        var record = Object.assign({ deleted: 0 }, obj);
        return DB.insert(savedCode, record);
    };

    PersistentStorage.loadScores = function(){
        return DB.selectScoresGrouped();
    };

    PersistentStorage.saveScore = function(score, challengeId){
        return DB.insert('scores', { score: score, when: new Date(), challenge_id: challengeId });
    };

    PersistentStorage.loadCodeInitial = function(stepId, challengeId) {
        return PersistentStorage.loadCode({step_id: stepId, challenge_id: challengeId}, {created_session_id: "DESC", id: "DESC"}, 1);
    };

    PersistentStorage.loadParticularSave = function(stepId, challengeId, sessionId){
        return PersistentStorage.loadCode({step_id: stepId, challenge_id: challengeId}, {created_session_id: "DESC", id: "DESC"}).then(function(rows) {
            if (!sessionId) {
                return rows;
            }
            var match = rows.filter(function(row) {
                return row.created_session_id == sessionId;
            });
            return match.length ? match : rows;
        });
    };

    PersistentStorage.deleteParticularSave = function (saveId) {
        return update(savedCode, {deleted: 1}, {id: saveId} );
    };

    PersistentStorage.loadAllUndeletedSaves = function(sessionId, challengeId){
        var where = {challenge_id: challengeId, deleted: 0};
        return PersistentStorage.loadCode(where, {created_session_id: "DESC", id: "DESC"}).then(function(success){
            var prioritized = success.slice();
            if (sessionId != null) {
                prioritized = success.filter(function(load){
                    return load.created_session_id == sessionId;
                }).concat(success.filter(function(load){
                    return load.created_session_id != sessionId;
                }));
            }
            return FA(prioritized).map(function(load){
               var newLoad = {};
               newLoad.name = load.name;
               newLoad.linesOfCode = (load.snippet || '').split("\n").length;
               newLoad.prettyDate = (new Date(load.when)).format("mmm d h:MM:ss");
               newLoad.stepNum = load.step_id + 1;
               newLoad.id = load.id;
               newLoad.snippet = load.snippet;
                newLoad.created_session_id = load.created_session_id;
                newLoad.isCurrentSession = sessionId != null && load.created_session_id == sessionId;

               return newLoad;
            });
        });
    };

    PersistentStorage.renameSave = function(saveId, newName) {
        return update(savedCode, {"name": newName}, {"id": saveId});
    };

    PersistentStorage.loadCode = function(obj, orderBy, limit) {
        return select(savedCode, obj, orderBy, limit);
    };

    PersistentStorage.loadSettings = function(){
        return DB.ensureDefaultSetting().then(function(){
            return select('appSettings', {'id': 0}).then(function(rows) {
                if (!rows.length) {
                    return [{id: 0, showed_splash_screen: 0}];
                }
                return rows;
            });
        });
    };

    PersistentStorage.saveSetting = function(changes){
        return update('appSettings', changes, {'id': 0} );
    };

    PersistentStorage.resultSetToArray = function(promise){
        return promise.then(function(results){
            var rowList = DB.createRowList(results);
            return [results, rowList];
        });
    };
}(DATABASE));
