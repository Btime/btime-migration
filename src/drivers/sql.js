const { Sequelize, Op, QueryTypes } = require('sequelize')
const MIGRATIONS_TABLE = 'migrations'
const Filename = require('./../filename')

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
        new Error(
          `Couldn't resolve filename. Cannot persist. ${payload.version}`
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
      .then(result => resolve(version))
      .catch(error => reject(error))
  })
}

module.exports.getRan = (payload) => {
  const query = `SELECT "version" from public."${MIGRATIONS_TABLE}"`

  return new Promise((resolve, reject) => {
    return payload.connection.instance
      .query(query, { type: QueryTypes.SELECT })
      .then(migrations => {
        const ran = migrations.map((migration) => {
          return migration.version
        })
        return resolve({ ...payload, ran })
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
      WHERE "version" = '${payload.argv.v}'
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
      WHERE "version" = '${payload.argv.v}'
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
