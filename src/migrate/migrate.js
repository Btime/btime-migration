'use strict'

require('dotenv').config()

const { argv } = require('./argv')
const Logger = require('./logger')
const Filename = require('./../filename')
const Workspaces = require('./workspaces')
const FileManager = require('./file-manager')
const DriverFactory = require('../drivers/factory')

module.exports.migrate = () => {
  return new Promise(async (resolve, reject) => {
    return FileManager.getFiles(argv)
      .then(payload => Workspaces.getDatabaseUris(payload))
      .then(payload => apply(payload))
      .then(resolve)
      .catch(reject)
  })
}

function apply (payload) {
  return new Promise(async (resolve, reject) => {
    return Promise.all(payload.databaseUris
      .map(uri => workspaceMigration({ uri, files: payload.files })))
      .then(resolve)
      .catch(reject)
  })
}

function workspaceMigration (payload) {
  return new Promise((resolve, reject) => {
    return prepareDatabase(payload.uri)
      .then(connection => {
        return filterMigrationsToRunUp(Object.assign({}, payload, {
          connection
        }))
      })
      .then(runUp)
      .then(resolve)
      .catch(reject)
  })
}

function prepareDatabase (uri) {
  return new Promise((resolve, reject) => {
    return DriverFactory
      .make(uri)
      .then(driver => driver.prepare(driver.connection(uri)))
      .then(resolve)
      .catch(reject)
  })
}

function filterMigrationsToRunUp (payload) {
  return new Promise((resolve, reject) => {
    return DriverFactory
      .makeByType(payload)
      .then(payload => payload.driver.getRan(payload))
      .then(payload => {
        const files = payload.files.filter((file) => {
          return (!payload.ran.includes(Filename.getVersion(file)))
        })
        return Promise.resolve(Object.assign({}, payload, { files }))
      })
      .then(resolve)
      .catch(reject)
  })
}

function runUp (payload) {
  Logger.workspace(payload.uri)

  return new Promise((resolve, reject) => {
    return Promise.all(payload.files.map(file => {
      const migration = require(file)
      Logger.migration(file)
      return migration.up(payload.connection.instance)
    }))
      .then(Logger.resume)
      .then(versions => markAsDone(Object.assign({}, payload, { versions })))
      .then(resolve)
      .catch(reject)
  })
}

function markAsDone (payload) {
  return new Promise((resolve, reject) => {
    return Promise.all(payload.versions
      .map(
        version => markVersionAsDone(Object.assign({}, payload, { version }))
      ))
      .then(versions => {
        payload.connection.instance.close()
        return resolve(versions)
      })
      .catch(reject)
  })
}

function markVersionAsDone (payload) {
  return new Promise((resolve, reject) => {
    return DriverFactory
      .makeByType(payload)
      .then(params => params.driver.markAsDone(params))
      .then(resolve)
      .catch(reject)
  })
}
