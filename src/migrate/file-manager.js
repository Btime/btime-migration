const fs = require('fs')
const { join } = require('path')

module.exports.getFiles = (argv) => {
  return new Promise((resolve, reject) => {
    let path = join(__dirname, '..', '..', 'migrations', argv.t)

    if (argv.w) {
      path = join(process.cwd(), argv.w)
    }

    fs.readdir(path, (err, files) => {
      if (err) return reject(err)

      files = files.filter(file => /^(.)*\.{1}(js)$/.test(file))

      files = files.map(file => join(path, file))

      return resolve({ argv, files })
    })
  })
}
