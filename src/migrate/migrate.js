'use strict'

const { argv } = require('./argv')
const FileManager = require('./file-manager')

module.exports.migrate = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const files = await FileManager.resolve(argv)

      if (files.length === 0) {
        resolve('Nothing to migrate')
      }

      resolve(files)
    } catch (err) {
      reject(err)
    }
  })
}
