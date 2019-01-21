'use strict'

const env = require('../env')
const { argv } = require('./argv')
const Logger = require('../logger')
const FileManager = require('./file-manager')
const DriverFactory = require('../drivers/factory')
const Workspace = require('./../migrate/workspaces')
const { OPTIONS } = require('./options')

module.exports.rollback = (payload) => {
  return new Promise((resolve, reject) => {
    return env.init(payload || argv())
      .then(mergePayloadOptions)
      .then(Workspace.getDatabaseUris)
      .then(FileManager.getByVersion)
      .then(apply)
      .then(resolve)
      .catch(reject)
  })
}

function mergePayloadOptions (payload) {
  return Promise.resolve({
    ...payload,
    options: {
      ...OPTIONS,
      ...payload.options
    }
  })
}

function apply (payload) {
  return new Promise((resolve, reject) => {
    return Promise.all(payload.databaseUris.map(uri => {
      return rollbackByUri({ ...payload, uri })
    }))
      .then(resolve)
      .catch(reject)
  })
}

function rollbackByUri (payload) {
  return new Promise((resolve, reject) => {
    return checkMigrationsRepository(payload)
      .then(payload => payload.driver.checkVersionTracking(payload))
      .then(handleVersionRollback)
      .then(closeConnection)
      .then(resolve)
      .catch(reject)
  })
}

function closeConnection (payload) {
  if (payload.options.closeConnection) {
    payload.connection.instance.close()
  }
  return payload
}

function checkMigrationsRepository (payload) {
  return new Promise((resolve, reject) => {
    if (payload.driver && payload.connection) {
      return payload.driver
        .checkRepository(payload)
        .then(resolve)
        .catch(reject)
    }

    return DriverFactory
      .make(payload)
      .then(payload => payload.driver.connection(payload))
      .then(payload => payload.driver.checkRepository(payload))
      .then(resolve)
      .catch(reject)
  })
}

function handleVersionRollback (payload) {
  return new Promise((resolve, reject) => {
    try {
      if (!payload.versionIsTracked) {
        Logger.untrackedVersion(payload)
        return resolve(payload)
      }

      const migration = require(payload.file)

      return migration
        .down(payload)
        .then(() => payload.driver.untrack(payload))
        .then(() => Logger.down(payload))
        .then(() => resolve(payload))
        .catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}
