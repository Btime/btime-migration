const { Sequelize, Op } = require('sequelize')

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
    CREATE TABLE IF NOT EXISTS public."migrations" (
      "id" SERIAL,
      "version" CHARACTER VARYING (80) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );`

    connection.instance
      .query(query)
      .then(() => resolve(connection))
      .catch((err) => reject(err))
  })
}

module.exports.markAsDone = (migration, connection) => {
  return new Promise((resolve, reject) => {
    resolve(migration)
  })
}
