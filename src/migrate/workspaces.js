const { MongoClient } = require('mongodb')
const MULTIPLE = {
  uri: process.env.MULTIPLE_URI,
  collection: process.env.MULTIPLE_COLLECTION,
  column: process.env.MULTIPLE_COLLECTION_COLUMN
}

module.exports.getDatabaseUris = (payload) => {
  return new Promise((resolve, reject) => {
    if (payload.databaseUris) {
      return resolve({ ...payload })
    }

    if (!payload.multiple) {
      const databaseUri = (
        payload.type === 'sql' ? process.env.SQL_URI : process.env.NONSQL_URI
      )
      return resolve({ ...payload, databaseUris: [ databaseUri ] })
    }

    if (payload.multiple) {
      return getMultiple()
        .then(databaseUris => resolve({ ...payload, databaseUris: databaseUris }))
        .catch(reject)
    }
  })
}

function getMultiple () {
  return new Promise((resolve, reject) => {
    return MongoClient.connect(MULTIPLE.uri, {
      useNewUrlParser: true
    }, (err, client) => {
      if (err) return reject(err)

      return client.db()
        .collection(MULTIPLE.collection)
        .find({ deleted: false })
        .project({ [MULTIPLE.column]: 1 })
        .toArray((error, entities) => {
          if (error) return reject(error)

          const databaseUris = [ ...new Set(entities.map(
            (entity) => entity[MULTIPLE.column]
          )) ]

          client.close()

          return resolve(databaseUris)
        })
    })
  })
}
