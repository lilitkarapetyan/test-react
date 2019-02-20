import PouchDB from 'pouchdb-browser'
import pouchdbFullSync from 'pouchdb-full-sync'
import defaultOptions from './config-default.json'
let options;

try {
 options = require('./config-local.json')
}
catch (e) {
 options = {}
}

options = {
  ...defaultOptions,
  ...options
}

PouchDB.plugin(pouchdbFullSync)

const getDb = dbKey => {

  if(!options[dbKey])
    return new PouchDB(dbKey)

  const db = new PouchDB(options[dbKey].name)

  if(options[dbKey].remote) {
    const remoteDB = new PouchDB(options[dbKey].remote)
    db.fullySync(remoteDB, {
      live: options[dbKey].live,
      retry: options[dbKey].retry
    })
  }
  return db
}

export default getDb
/*
db.fullySync(remoteDB, {
  live: true,
  retry: true
}).on('change', function (info) {
  // handle change
}).on('paused', function () {
  // replication paused (e.g. user went offline)
}).on('active', function () {
  // replicate resumed (e.g. user went back online)
}).on('denied', function (info) {
  // a document failed to replicate, e.g. due to permissions
}).on('complete', function (info) {
  // handle complete
}).on('error', function (err) {
  // handle error
});
*/
