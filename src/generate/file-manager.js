'use strict'

const fs = require('fs')
const moment = require('moment')
const path = require('path')
const PATTERN = {
  prefix: 'Version',
  extension: '.js'
}

module.exports.create = (argv) => {
  return new Promise((resolve, reject) => {
    const file = resolveFilePath(argv)

    fs.appendFile(file, '', function (err) {
      if (err) reject(err)

      resolve(file)
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
