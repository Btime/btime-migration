const { Sequelize, Op } = require('sequelize')
const MIGRATIONS_TABLE = 'migrations'
const FILENAME_PATTERN = require('./../generate/filename-pattern')

module.exports.connection = (uri) => {
  return {
    type: 'sql',
    instance: new Sequelize(uri, {
      logging: false,
      operatorsAliases: Op
    })
  }
}

module.exports.prepare = (connection) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."${MIGRATIONS_TABLE}" (
      "version" CHARACTER VARYING (80) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );`

    connection.instance
      .query(query)
      .then(() => resolve(connection))
      .catch((err) => reject(err))
  })
}

module.exports.markAsDone = (payload) => {
  return new Promise((resolve, reject) => {
    const filename = payload.version.split('/').pop()

    if (!filename) {
      return reject(
        new Error(`Couldn't resolve filename. Cannot persist. ${payload.version}`)
      )
    }

    const query = `
    INSERT INTO public."${MIGRATIONS_TABLE}" ("version", "createdAt") VALUES
    (?, ?);
    `
    const version = filename.replace(versionRegEx(), '')

    return payload.connection.instance
      .query(query, {
        type: Sequelize.QueryTypes.INSERT,
        replacements: [ version, 'NOW()' ]
      })
      .then(result => resolve(version))
      .catch(error => reject(error))
  })
}

function versionRegEx () {
  const pattern = `[(${FILENAME_PATTERN.prefix})|(${FILENAME_PATTERN.extension})]*`

  return new RegExp(pattern, 'gi')
}
