const fs = require('fs')
const { join } = require('path')
const { PATTERN } = require('./../filename')
const { migrationsPath } = require('../migrations-path')

module.exports.getByVersion = (payload) => {
  return new Promise((resolve, reject) => {
    const filePath = migrationsPath(payload)

    fs.readdir(filePath, (error, files) => {
      if (error) return reject(error)

      const version = payload.version

      const regex = new RegExp(`(${PATTERN.prefix})(${version})(${PATTERN.extension})`, 'gi')

      const file = files.filter(file => regex.test(file)).pop()

      if (!file) {
        return reject(new Error(
          `The specified version could not be found: ${version} (work dir: ${filePath})`
        ))
      }
      return resolve({ ...payload, file: join(filePath, file) })
    })
  })
}
