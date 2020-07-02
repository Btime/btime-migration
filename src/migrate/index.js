'use strict'

const env = require('../env')
const { argv } = require('./argv')
const Logger = require('./../logger')
const Filename = require('./../filename')
const Workspaces = require('./workspaces')
const { rollback } = require('../rollback')
const FileManager = require('./file-manager')
const DriverFactory = require('../drivers/factory')

module.exports.migrate = () =>
  env.init(argv)
    .then(FileManager.getFiles)
    .then(mapWorkspaces)

async function mapWorkspaces (payload) {
  payload = await Workspaces.getDatabaseUris(payload)

  for (let i = 0; i < payload.databaseUris.length; i++) {
    const uri = payload.databaseUris[i]
    await prepareDatabase({ ...payload, uri })
      .then(payload => payload.driver.getStartingPointVersion(payload))
      .then(payload => {
        const { driver, connection, startingPointVersion } = payload
        return { uri, driver, connection, startingPointVersion }
      })

      .then(workspace => apply({ ...payload, workspace }))
  }

  return { ...payload }
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

async function apply (payload) {
  try {
    await migrateWorkspace({ ...payload, ...payload.workspace })
    return payload
  } catch (error) {
    Logger.migrationFailed()

    await payload.workspace.driver
      .getVersionsToRollback({ ...payload, ...payload.workspace })
      .then(rollbackVersions)

    throw error
  } finally {
    payload.workspace.connection.instance.close()
  }
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
        const { type, connection, driver, uri, workdir, env } = payload

        await rollback({
          type,
          version,
          connection,
          driver,
          databaseUris: [ uri ],
          options: {
            closeConnection: false
          },
          workdir,
          env
        })
      }
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
}
