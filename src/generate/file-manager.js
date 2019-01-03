'use strict'

const fs = require('fs')
const path = require('path')
const Filename = require('./../filename')

module.exports.create = (argv) => {
  return new Promise((resolve, reject) => {
    const file = resolveFilePath(argv)

    fs.readFile(`${__dirname}/stub.js`, (error, content) => {
      if (error) return reject(error)

      fs.appendFile(file, content, function (err) {
        if (err) return reject(err)

        return resolve(file)
      })
    })
  })
}

function resolveFilePath (payload) {
  const filePath = payload.workdir ||
    path.join(__dirname, '..', '..', 'migrations', payload.type)

  return path.join(filePath, Filename.generate())
}
