'use strict'

const { argv } = require('./argv')
const FileManager = require('./file-manager')

module.exports.generate = () => {
  return new Promise((resolve, reject) => {
    return FileManager
      .create(argv)
      .then(resolve)
      .catch(reject)
  })
}
