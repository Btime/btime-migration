'use strict'

require('dotenv').config()

const { argv } = require('./argv')
const Logger = require('../logger')
const FileManager = require('./file-manager')
const DriverFactory = require('../drivers/factory')
const Workspace = require('./../migrate/workspaces')

module.exports.rollback = () => {
  return new Promise((resolve, reject) => {
    return Workspace
      .getDatabaseUris({ argv })
      .then(FileManager.getByVersion)
      .then(apply)
      .then(resolve)
      .catch(reject)
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
    Logger.workspace(payload.uri)

    return checkMigrationsRepository(payload)
      .then(payload => payload.driver.checkVersionTracking(payload))
      .then(handleVersionRollback)
      .then(handleVersionUntrack)
      .then(closeConnection)
      .then(resolve)
      .catch(reject)
  })
}

function closeConnection (payload) {
  payload.connection.instance.close()
  return { ...payload }
}

function checkMigrationsRepository (payload) {
  return new Promise((resolve, reject) => {
    return DriverFactory
      .make(payload.uri)
      .then(driver => driver.checkRepository({
        ...payload, connection: driver.connection(payload.uri), driver
      }))
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
      Logger.down(payload)
      const migration = require(payload.file)
      return resolve(migration.down(payload))
    } catch (error) {
      return reject(error)
    }
  })
}

function handleVersionUntrack (payload) {
  return new Promise((resolve, reject) => {
    try {
      if (!payload.versionIsTracked) {
        return resolve(payload)
      }
      return resolve(payload.driver.untrack(payload))
    } catch (error) {
      return reject(error)
    }
  })
}
