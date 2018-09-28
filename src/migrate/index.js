'use strict'

require('dotenv').config()

const { argv } = require('./argv')
const Logger = require('./../logger')
const Filename = require('./../filename')
const Workspaces = require('./workspaces')
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
      .map(uri => workspaceMigration({ uri, files: payload.files })))
      .then(resolve)
      .catch(reject)
  })
}

function workspaceMigration (payload) {
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
  return new Promise((resolve, reject) => {
    return Promise.all(payload.files.map(migration => {
      return require(migration)
        .up(payload)
        .then(() => payload.driver.markAsDone({ ...payload, migration }))
        .then(Logger.up)
        .then(payload => Filename.getVersion(payload.migration))
    }))
      .then(versions => {
        payload.connection.instance.close()
        return { ...payload, versions }
      })
      .then(Logger.upResume)
      .then(resolve)
      .catch(reject)
  })
}
