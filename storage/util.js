export const IDB = {
  openDB(dbName, storeName, version = 1) {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
      let db;
      const request = indexedDB.open(dbName, version);

      request.onsuccess = function (e) {
        db = e.target.result;
        resolve(db);
      };

      request.onerror = function (e) {
        reject(e);
      };

      request.onupgradeneeded = function (e) {
        db = e.target.result;
        let store;
        if (!db.objectStoreNames.contains(storeName)) {
          store = db.createObjectStore(storeName, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  },
  add(db, storeName, data) {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).add(data);

    request.onsuccess = function (e) {
      console.log('add success: ', e);
    };

    request.onerror = function (e) {
      console.log('add fail');
      throw new Error(e.target.error);
    };
  },
  getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName]);
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = function (e) {
        console.log('getDataByKey Failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('getDataByKey Success: ', request.result, event);
        resolve(request.result);
      };
    });
  },
  cursorGetData(db, storeName) {
    return new Promise((resolve, reject) => {
      const res = [];
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
      const request = store.openCursor();

      request.onsuccess = function (e) {
        let cursor = e.target.value;
        if (cursor) {
          res.push(cursor.value);
          cursor.continue();
        } else {
          console.log('cursorGetData: ', res);
          resolve(res);
        }
      };

      request.onerror = function (e) {
        console.log('cursorGetData: ', e);
        reject(e);
      };
    });
  },
  getDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
      const request = store.index(indexName).get(indexValue);

      request.onerror = function (e) {
        console.log('getDataByIndex failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('getDataByIndex success: ', e);
        const res = e.target.result;
        resolve(res);
      };
    });
  },
  cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
      const request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue));

      request.onerror = function (e) {
        console.log('cursorGetDataByIndex failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('cursorGetDataByIndex success: ', e);
        const res = e.target.result;
        resolve(res);
      };
    });
  },
  update(db, storeName, data) {
    return new Promise((resolve, reject) => {
      const request = db.transaction([storeName], 'readwrite').objectStore(storeName).put(data);

      request.onerror = function (e) {
        console.log('update failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('update success: ', e);
        const res = e.target.result;
        resolve(res);
      };
    });
  },
  delete(db, storeName, id) {
    return new Promise((resolve, reject) => {
      const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id);

      request.onerror = function (e) {
        console.log('delete failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('delete success: ', e);
        const res = e.target.result;
        resolve(res);
      };
    });
  },
  cursorDelete(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
      const request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue));

      request.onerror = function (e) {
        console.log('delete failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('delete success: ', e);
        const res = e.target.result;
        let deleteRequest;
        let ret = [];
        if (res) {
          deleteRequest = res.delete();

          deleteRequest.onerror = function (e) {
            console.log('delete failed: ', e);
            reject(e);
          };

          deleteRequest.onsuccess = function (e) {
            console.log('delete success: ', e);
            const res = e.target.result;
            ret.push(res);
          };
        }
        resolve(ret);
      };
    });
  },
  closeDB(db) {
    db.close();
    console.log('db is closed!');
  },
  deleteDB(dbName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onerror = function (e) {
        console.log('delete failed: ', e);
        reject(e);
      };

      request.onsuccess = function (e) {
        console.log('delete success: ', e);
        const res = e.target.result;
        resolve(res);
      };
    });
  }
};
