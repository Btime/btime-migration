const fs = require('fs')
const path = require('path')
const { PATTERN } = require('./../filename')

module.exports.getByVersion = (payload) => {
  return new Promise((resolve, reject) => {
    const filePath = getFilePath(payload)

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
      return resolve({ ...payload, file: path.join(filePath, file) })
    })
  })
}

function getFilePath (payload) {
  if (payload.workdir) {
    return path.join(process.cwd(), payload.workdir)
  }
  return path.join(__dirname, '..', '..', 'migrations', payload.type)
}
