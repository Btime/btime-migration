'use strict'

require('dotenv').config()

const { argv } = require('./argv')
const Logger = require('./../logger')
const Filename = require('./../filename')
const Workspaces = require('./workspaces')
const { rollback } = require('../rollback')
const FileManager = require('./file-manager')
const DriverFactory = require('../drivers/factory')

module.exports.migrate = () => {
  return new Promise((resolve, reject) => {
    return FileManager.getFiles(argv)
      .then(Workspaces.getDatabaseUris)
      .then(apply)
      .then(resolve)
      .catch(reject)
  })
}

function apply (payload) {
  return new Promise((resolve, reject) => {
    return Promise.all(payload.databaseUris
      .map(uri => migrateWorkspace({ ...payload, uri })))
      .then(resolve)
      .catch(reject)
  })
}

function migrateWorkspace (payload) {
  return new Promise((resolve, reject) => {
    return prepareDatabase(payload)
      .then(filterMigrationsToRunUp)
      .then(runUp)
      .then(resolve)
      .catch(reject)
  })
}

function prepareDatabase (payload) {
  return new Promise((resolve, reject) => {
    return DriverFactory
      .make(payload)
      .then(payload => payload.driver.prepare(payload))
      .then(resolve)
      .catch(reject)
  })
}

function filterMigrationsToRunUp (payload) {
  return new Promise((resolve, reject) => {
    return payload.driver
      .getStartingPointVersion(payload)
      .then(payload => {
        const files = payload.files.filter((file) => {
          return Filename.getVersion(file) > payload.startingPointVersion
        })
        return { ...payload, files }
      })
      .then(resolve)
      .catch(reject)
  })
}

function runUp (payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const migrationsPromises = payload.files.map(async migration => {
        const migrationPromise = await require(migration)
          .up(payload)
          .then(() => payload.driver.markAsDone({ ...payload, migration }))
          .then(Logger.up)
          .then(payload => payload.version)
        return migrationPromise
      })

      const versions = await Promise.all(migrationsPromises)

      payload.connection.instance.close()

      return resolve(await Logger.upResume({ ...payload, versions }))
    } catch (error) {
      return payload.driver
        .getVersionsToRollback(payload)
        .then(rollbackVersions)
        .then(() => payload.connection.instance.close())
        .then(() => reject(error))
        .catch(err => {
          payload.connection.instance.close()
          return reject(err)
        })
    }
  })
}

function rollbackVersions (payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const versionsToRollback = payload.versionsToRollback.map(async version => {
        const rolledback = await rollback({
          type: payload.type,
          version,
          connection: payload.connection,
          driver: payload.driver,
          databaseUris: [ payload.uri ],
          options: {
            closeConnection: false
          },
          workdir: payload.workdir
        })
        return rolledback
      })

      return resolve(await Promise.all(versionsToRollback))
    } catch (error) {
      return reject(error)
    }
  })
}
