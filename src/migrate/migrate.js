'use strict'

const { argv } = require('./argv')
const FileManager = require('./file-manager')
const Workspaces = require('./workspaces')

module.exports.migrate = () => {
  return new Promise(async (resolve, reject) => {
    const files = await FileManager.resolve(argv)

    if (files.length === 0) {
      resolve('Nothing to migrate')
    }

    Workspaces
      .resolve(argv)
      .then(workspaces => apply({ workspaces, files }))
      .then(result => resolve(result))
      .catch(err => { reject(err) })
  })
}

function apply (payload) {
  return new Promise((resolve, reject) => {
    let promises = []

    try {
      for (let workspace of payload.workspaces) {
        promises.push(
          workspaceMigration(workspace, payload.files)
        )
      }

      Promise
        .all(promises)
        .then(result => resolve(result))
        .catch(error => reject(error))
    } catch (error) {
      reject(error)
    }
  })
}

function workspaceMigration (connection, files) {
  const driver = driverMock()

  return new Promise((resolve, reject) => {
    driver
      .connect(connection)
      .then(driver => driver.setupMigrations())
      .then(driver => driver.runUp(files))
      .then(result => resolve(result))
      .catch(error => {
        driver
          .runDown(files)
          .then(() => reject(error))
      })
  })
}

function driverMock () {
  const driver = {}

  driver.connect = () => Promise.resolve(driver)
  driver.setupMigrations = () => Promise.resolve(driver)
  driver.runUp = (files) => Promise.resolve(files)
  driver.downUp = (files) => Promise.resolve(files)

  return driver
}
