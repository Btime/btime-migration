'use strict'

const { argv } = require('./argv')
const FileManager = require('./file-manager')

module.exports.generate = () => {
  return new Promise((resolve, reject) => {
    try {
      FileManager
        .create(argv)
        .then(file => resolve(file))
        .catch(err => reject(err))
    } catch (err) {
      reject(err)
    }
  })
}
