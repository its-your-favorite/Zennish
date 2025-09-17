/**
 * User: anfur_000
 * Date: 6/9/13, 4:01 PM
 */

var DATABASE;
(function(){
    "use strict";

    if (!window.indexedDB) {
        alert('IndexedDB Not Supported -> Please try with a modern browser');
        DATABASE = {
            ready: Promise.reject(new Error('IndexedDB not supported')),
            insert: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            update: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            select: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            selectRowList: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            selectScoresGrouped: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            clearStore: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            eradicate: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            ensureDefaultSetting: function(){ return Promise.reject(new Error('IndexedDB not supported')); },
            createRowList: function(){ return { length: 0, item: function(){ return undefined; } }; }
        };
        return;
    }

    var DB_NAME = 'WorkWorkDB';
    var DB_VERSION = 1;
    var STORE_SAVED_CODE = 'savedCode';
    var STORE_APP_SETTINGS = 'appSettings';
    var STORE_SCORES = 'scores';

    function promisifyRequest(request) {
        return new Promise(function(resolve, reject) {
            request.onsuccess = function() {
                resolve(request.result);
            };
            request.onerror = function(event) {
                reject(event.target.error || request.error);
            };
        });
    }

    function openDatabase() {
        return new Promise(function(resolve, reject) {
            var request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = function(event) {
                var db = event.target.result;

                if (!db.objectStoreNames.contains(STORE_SAVED_CODE)) {
                    db.createObjectStore(STORE_SAVED_CODE, { keyPath: 'id', autoIncrement: true });
                }

                if (!db.objectStoreNames.contains(STORE_APP_SETTINGS)) {
                    db.createObjectStore(STORE_APP_SETTINGS, { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains(STORE_SCORES)) {
                    db.createObjectStore(STORE_SCORES, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = function(event) {
                var db = event.target.result;
                db.onversionchange = function() {
                    db.close();
                };
                resolve(db);
            };

            request.onerror = function(event) {
                reject(event.target.error || request.error);
            };
        });
    }

    var dbPromise = openDatabase();

    function withStore(storeName, mode, handler) {
        return dbPromise.then(function(db) {
            return new Promise(function(resolve, reject) {
                var tx = db.transaction(storeName, mode);
                var store = tx.objectStore(storeName);
                var handlerResult;
                var handlerPromise;

                try {
                    handlerResult = handler(store, tx);
                    if (handlerResult && typeof handlerResult.then === 'function') {
                        handlerPromise = handlerResult;
                    }
                } catch (err) {
                    reject(err);
                    return;
                }

                tx.oncomplete = function() {
                    if (handlerPromise) {
                        handlerPromise.then(resolve).catch(reject);
                    } else {
                        resolve(handlerResult);
                    }
                };

                tx.onabort = tx.onerror = function(event) {
                    reject(event.target.error || tx.error);
                };

                if (handlerPromise) {
                    handlerPromise.catch(reject);
                }
            });
        });
    }

    function getAll(storeName) {
        return withStore(storeName, 'readonly', function(store) {
            if (typeof store.getAll === 'function') {
                return promisifyRequest(store.getAll());
            }

            return new Promise(function(resolve, reject) {
                var items = [];
                var request = store.openCursor();
                request.onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (!cursor) {
                        resolve(items);
                        return;
                    }
                    items.push(cursor.value);
                    cursor.continue();
                };
                request.onerror = function(event) {
                    reject(event.target.error || request.error);
                };
            });
        });
    }

    function matchesWhere(item, where) {
        if (!where) {
            return true;
        }
        var keys = Object.keys(where);
        if (!keys.length) {
            return true;
        }
        return keys.every(function(key) {
            // loose equality keeps compatibility with legacy string/number mixes
            return item[key] == where[key];
        });
    }

    function applyOrdering(items, orderBy) {
        if (!orderBy) {
            return items;
        }
        var keys = Object.keys(orderBy);
        if (!keys.length) {
            return items;
        }
        return items.sort(function(a, b) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var dir = String(orderBy[key]).toUpperCase() === 'DESC' ? -1 : 1;
                var aVal = a[key];
                var bVal = b[key];
                if (aVal < bVal) {
                    return -1 * dir;
                }
                if (aVal > bVal) {
                    return 1 * dir;
                }
            }
            return 0;
        });
    }

    function select(storeName, options) {
        options = options || {};
        var where = options.where || {};
        var orderBy = options.orderBy;
        var limit = options.limit;

        return getAll(storeName).then(function(items) {
            var filtered = items.filter(function(item) {
                return matchesWhere(item, where);
            });

            filtered = applyOrdering(filtered, orderBy);

            if (typeof limit === 'number') {
                filtered = filtered.slice(0, limit);
            }

            return FA(filtered);
        });
    }

    function insert(storeName, data) {
        return withStore(storeName, 'readwrite', function(store) {
            return promisifyRequest(store.add(data)).then(function(key) {
                return { insertId: key };
            });
        });
    }

    function update(storeName, changes, where) {
        where = where || {};
        return withStore(storeName, 'readwrite', function(store) {
            return new Promise(function(resolve, reject) {
                var updated = [];
                var request = store.openCursor();
                request.onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (!cursor) {
                        resolve(updated);
                        return;
                    }
                    var value = cursor.value;
                    if (matchesWhere(value, where)) {
                        Object.keys(changes).forEach(function(key) {
                            value[key] = changes[key];
                        });
                        var updateRequest = cursor.update(value);
                        updateRequest.onerror = function(evt) {
                            reject(evt.target.error || updateRequest.error);
                        };
                        updated.push(value);
                    }
                    cursor.continue();
                };
                request.onerror = function(event) {
                    reject(event.target.error || request.error);
                };
            });
        });
    }

    function clearStore(storeName) {
        return withStore(storeName, 'readwrite', function(store) {
            return promisifyRequest(store.clear()).then(function() {
                return true;
            });
        });
    }

    function createRowList(rows) {
        var list = FA(rows || []);
        list.item = function(index) {
            return list[index];
        };
        list.toArray = function() {
            return list.slice();
        };
        return list;
    }

    function selectRowList(storeName, options) {
        return select(storeName, options).then(function(rows) {
            return createRowList(rows);
        });
    }

    function selectScoresGrouped() {
        return getAll(STORE_SCORES).then(function(items) {
            var grouped = {};
            items.forEach(function(item) {
                var challengeId = item.challenge_id;
                if (grouped[challengeId] == null || item.score > grouped[challengeId]) {
                    grouped[challengeId] = item.score;
                }
            });
            var rows = Object.keys(grouped).map(function(challengeId) {
                return {
                    top_score: grouped[challengeId],
                    challenge_id: challengeId
                };
            });
            return createRowList(rows);
        });
    }

    function ensureDefaultSetting() {
        return withStore(STORE_APP_SETTINGS, 'readwrite', function(store) {
            return promisifyRequest(store.get(0)).then(function(existing) {
                if (existing == null) {
                    return promisifyRequest(store.put({ id: 0, showed_splash_screen: 0 }));
                }
            });
        });
    }

    function eradicate() {
        return Promise.all([
            clearStore(STORE_SAVED_CODE),
            clearStore(STORE_APP_SETTINGS),
            clearStore(STORE_SCORES)
        ]);
    }

    dbPromise.then(function() {
        return ensureDefaultSetting();
    }).catch(function(err) {
        console.error('Failed to initialize database', err);
    });

    DATABASE = {
        ready: dbPromise,
        insert: insert,
        update: update,
        select: select,
        selectRowList: selectRowList,
        selectScoresGrouped: selectScoresGrouped,
        clearStore: clearStore,
        eradicate: eradicate,
        ensureDefaultSetting: ensureDefaultSetting,
        createRowList: createRowList
    };
})();
