'use strict'

const fs = require('fs')
const { join } = require('path')
const Filename = require('./../filename')
const { migrationsPath } = require('../migrations-path')

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
  return join(migrationsPath(payload), Filename.generate())
}
