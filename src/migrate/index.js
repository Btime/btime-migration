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
      .then(mapWorkspaces)
      .then(apply)
      .then(resolve)
      .catch(reject)
  })
}

function mapWorkspaces (payload) {
  return new Promise(async (resolve, reject) => {
    try {
      payload = await Workspaces.getDatabaseUris(payload)

      const workspaces = await Promise.all(payload.databaseUris.map(uri => {
        return prepareDatabase({ ...payload, uri })
          .then(payload => payload.driver.getStartingPointVersion(payload))
          .then(payload => {
            const { driver, connection, startingPointVersion } = payload

            return { uri, driver, connection, startingPointVersion }
          })
      }))

      return resolve({ ...payload, workspaces })
    } catch (error) {
      return reject(error)
    }
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

function apply (payload) {
  return new Promise(async (resolve, reject) => {
    try {
      for (const workspace of payload.workspaces) {
        await migrateWorkspace({ ...payload, ...workspace })
      }
      return resolve(payload)
    } catch (error) {
      for (const workspace of payload.workspaces) {
        await workspace.driver
          .getVersionsToRollback({ ...payload, ...workspace })
          .then(rollbackVersions)
      }
      return reject(error)
    } finally {
      for (const workspace of payload.workspaces) {
        workspace.connection.instance.close()
      }
    }
  })
}

function migrateWorkspace (payload) {
  return new Promise((resolve, reject) => {
    return filterMigrationsToRunUp(payload)
      .then(runUp)
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
      Logger.workspace(payload)

      const versions = []

      for (const migration of payload.files) {
        const result = await require(migration)
          .up(payload)
          .then(() => payload.driver.markAsDone({ ...payload, migration }))
          .then(Logger.up)
          .then(payload => payload.version)

        versions.push(result)
      }
      return resolve(await Logger.upResume({ ...payload, versions }))
    } catch (error) {
      return reject(error)
    }
  })
}

function rollbackVersions (payload) {
  return new Promise(async (resolve, reject) => {
    try {
      Logger.workspace(payload)

      for (const version of payload.versionsToRollback) {
        const { type, connection, driver, uri, workdir } = payload

        await rollback({
          type,
          version,
          connection,
          driver,
          databaseUris: [ uri ],
          options: {
            closeConnection: false
          },
          workdir
        })
      }
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
}
