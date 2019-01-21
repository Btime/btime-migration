const fs = require('fs')
const { join } = require('path')
const { migrationsPath } = require('../migrations-path')

module.exports.getFiles = (payload) => {
  return new Promise((resolve, reject) => {
    const path = migrationsPath(payload)

    fs.readdir(path, (err, files) => {
      if (err) return reject(err)

      files = files.filter(file => /^(.)*\.{1}(js)$/.test(file))

      files = files.map(file => join(path, file))

      return resolve({ ...payload, files })
    })
  })
}
