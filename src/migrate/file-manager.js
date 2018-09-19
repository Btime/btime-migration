const fs = require('fs')
const { join } = require('path')

module.exports.resolve = (argv) => {
  return new Promise((resolve, reject) => {
    const path = argv.w || join(__dirname, '..', '..', 'migrations', argv.t)

    fs.readdir(path, (err, files) => {
      if (err) return reject(err)

      files = files.filter(file => /^(.)*\.{1}(js)$/.test(file))

      return resolve(files)
    })
  })
}
