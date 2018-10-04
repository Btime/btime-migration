const fs = require('fs')
const { join } = require('path')

module.exports.getFiles = (payload) => {
  return new Promise((resolve, reject) => {
    let path = join(__dirname, '..', '..', 'migrations', payload.type)

    if (payload.workdir) {
      path = join(process.cwd(), payload.workdir)
    }

    fs.readdir(path, (err, files) => {
      if (err) return reject(err)

      files = files.filter(file => /^(.)*\.{1}(js)$/.test(file))

      files = files.map(file => join(path, file))

      return resolve({ ...payload, files })
    })
  })
}
