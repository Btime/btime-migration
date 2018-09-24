'use strict'

const fs = require('fs')
const moment = require('moment')
const path = require('path')
const PATTERN = require('./filename-pattern')

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

function resolveFilePath (argv) {
  return path.join(
    __dirname,
    '../..',
    'migrations',
    argv.t,
    generateFilename()
  )
}

function generateFilename () {
  return PATTERN.prefix +
    moment().format('YYYYMMDDHHmmssSSS') +
    PATTERN.extension
}
