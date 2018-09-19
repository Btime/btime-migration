'use strict'

const fs = require('fs')
const yargs = require('yargs')
const { join } = require('path')
const TYPE_OPTIONS = [ 'sql', 'nonsql' ]

module.exports.migrate = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const argv = commandArgv()

      const files = await resolveFiles(argv)

      if (files.length === 0) {
        resolve('Nothing to migrate')
      }

      resolve(files)
    } catch (err) {
      reject(err)
    }
  })
}

function commandArgv () {
  return yargs
    .usage('Usage: $0 -t [sql or nonsql]')
    .option('type', {
      alias: 't',
      describe: 'Relational (sql) or non-relational (nonsql)',
      required: true,
      type: 'string',
      choices: TYPE_OPTIONS
    })
    .option('workdir', {
      alias: 'w',
      describe: 'Path to locate the migration files (according to type)',
      required: false,
      type: 'string'
    })
    .argv
}

function resolveFiles (argv) {
  return new Promise((resolve, reject) => {
    const path = argv.w || join(__dirname, '..', 'migrations', argv.type)

    fs.readdir(path, (err, files) => {
      if (err) return reject(err)

      files = files.filter(file => /^(.)*\.{1}(js)$/.test(file))

      return resolve(files)
    })
  })
}
