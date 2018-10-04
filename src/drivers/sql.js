const { Sequelize, Op, QueryTypes } = require('sequelize')
const MIGRATIONS_TABLE = 'migrations'
const Filename = require('./../filename')

function connection (payload) {
  return new Promise((resolve, reject) => {
    const connection = {
      type: 'sql',
      instance: new Sequelize(payload.uri, {
        logging: false,
        operatorsAliases: Op
      })
    }
    return resolve({ ...payload, connection })
  })
}
module.exports.connection = connection

module.exports.prepare = (payload) => {
  return new Promise(async (resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."${MIGRATIONS_TABLE}" (
      "version" CHARACTER VARYING (80) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );`

    payload = await connection(payload)

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch((err) => reject(err))
  })
}

module.exports.markAsDone = (payload) => {
  return new Promise((resolve, reject) => {
    const filename = payload.migration.split('/').pop()

    if (!filename) {
      return reject(
        new Error(
          `Couldn't resolve filename. Cannot persist. ${payload.migration}`
        )
      )
    }

    const query = `
    INSERT INTO public."${MIGRATIONS_TABLE}" ("version", "createdAt") VALUES
    (?, ?);
    `
    const version = Filename.getVersion(filename)

    return payload.connection.instance
      .query(query, {
        type: QueryTypes.INSERT,
        replacements: [ version, 'NOW()' ]
      })
      .then(result => resolve({ ...payload, version }))
      .catch(error => reject(error))
  })
}

module.exports.getStartingPointVersion = (payload) => {
  const query = `SELECT MAX("version") from public."${MIGRATIONS_TABLE}"`

  return new Promise((resolve, reject) => {
    return payload.connection.instance
      .query(query, { type: QueryTypes.SELECT })
      .then(migration => {
        const startingPointVersion = (migration.pop().max || 0)

        return resolve({ ...payload, startingPointVersion })
      })
      .catch(reject)
  })
}

module.exports.checkRepository = (payload) => {
  const query = `SELECT EXISTS (SELECT 1 FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name = '${MIGRATIONS_TABLE}');
   `

  return new Promise((resolve, reject) => {
    return payload.connection.instance
      .query(query, { type: QueryTypes.SELECT })
      .then(response => {
        if (response.pop().exists) {
          return resolve(payload)
        }
        payload.connection.instance.close()

        return reject(new Error(
          `Could not find migrations repository at connection: ${payload.uri}`
        ))
      })
      .catch(error => {
        payload.connection.instance.close()
        return reject(error)
      })
  })
}

module.exports.untrack = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM public."${MIGRATIONS_TABLE}"
      WHERE "version" = '${payload.version}'
    `
    return payload.connection.instance.query(query, {
      type: QueryTypes.DELETE
    })
      .then(response => resolve(payload))
      .catch(error => {
        payload.connection.instance.close()
        return reject(error)
      })
  })
}

module.exports.checkVersionTracking = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM public."${MIGRATIONS_TABLE}"
      WHERE "version" = '${payload.version}'
    `
    return payload.connection.instance
      .query(query)
      .then(response => {
        const result = response.slice(-1).pop()

        return resolve({ ...payload, versionIsTracked: !!(result.rowCount) })
      })
      .catch(reject)
  })
}

module.exports.getVersionsToRollback = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT "version" FROM public."migrations"
    WHERE "version" > '${payload.startingPointVersion}'
    ORDER BY "version" DESC`

    return payload.connection.instance
      .query(query)
      .then(response => {
        const result = response.slice(-1).pop()

        const versions = result.rows.map((entry) => entry.version)

        return resolve({ ...payload, versionsToRollback: versions })
      })
      .catch(reject)
  })
}
