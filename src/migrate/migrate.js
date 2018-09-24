'use strict'

require('dotenv').config()

const { argv } = require('./argv')
const Workspaces = require('./workspaces')
const FileManager = require('./file-manager')
const DriverFactory = require('../drivers/factory')

module.exports.migrate = () => {
  return new Promise(async (resolve, reject) => {
    return FileManager.getFiles(argv)
      .then(payload => Workspaces.getWorkspaces(payload))
      .then(payload => apply(payload))
      .then(resolve)
      .catch(reject)
  })
}

function apply (payload) {
  return new Promise(async (resolve, reject) => {
    if (payload.files.length === 0) {
      return resolve('Nothing to migrate')
    }

    return Promise.all(payload.databaseUrls
      .map(databaseUrl => workspaceMigration(databaseUrl, payload.files)))
      .then(resolve)
      .catch(reject)
  })
}

function workspaceMigration (uri, files) {
  return new Promise((resolve, reject) => {
    return prepareDatabase(uri)
      .then(connection => runUp({
        connection,
        files
      }))
      .then(resolve)
      .catch(reject)
  })
}

function prepareDatabase (uri) {
  return new Promise((resolve, reject) => {
    const driver = DriverFactory.make(uri)

    return driver
      .prepare(driver.connection(uri))
      .then(connection => resolve(connection))
      .catch(reject)
  })
}

function runUp (payload) {
  return new Promise((resolve, reject) => {
    return Promise.all(payload.files.map(file => {
      const migration = require(file)
      return migration.up(payload.connection.instance)
    }))
      .then(versions => markAsDone(Object.assign(payload, {
        versions
      })))
      .then(resolve)
      .catch(reject)
  })
}

function markAsDone (payload) {
  return new Promise((resolve, reject) => {
    return Promise.all(payload.versions
      .map(version => markAsDonePersist(Object.assign(payload, {
        version
      }))))
      .then(versions => {
        payload.connection.instance.close()
        return resolve(versions)
      })
      .catch(reject)
  })
}

function markAsDonePersist (payload) {
  return new Promise((resolve, reject) => {
    return resolve(payload.version)
  })
}
