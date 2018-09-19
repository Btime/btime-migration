'use strict'

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const yargs = require('yargs')
const typeOptions = [ 'sql', 'nonsql' ]

module.exports.generate = () => {
  return new Promise((resolve, reject) => {
    try {
      const argv = yargs
        .usage('Usage: $0 -t [sql or nonsql]')
        .option('type', {
          alias: 't',
          describe: 'Relational (sql) or NonRelational (nonsql)',
          type: 'string'
        })
        .demandOption([ 'type' ])
        .argv

      if (typeOptions.indexOf(argv.type) === -1) {
        throw new Error('Invalid type format')
      }

      const fileExtension = argv.type === 'nonsql' ? '.json' : '.sql'
      const file = path.join(
        __dirname,
        '../..',
        'migrations',
        argv.t,
        'Version' + moment().format('YYYYMMDDHHmmssSSS') + fileExtension
      )

      fs.appendFile(file, '', function (err) {
        if (err) throw err

        resolve(file)
      })
    } catch (err) {
      reject(err)
    }
  })
}
