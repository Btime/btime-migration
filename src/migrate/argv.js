'use strict'

const yargs = require('yargs')
const TYPE_OPTIONS = [ 'sql', 'nonsql' ]

module.exports.argv = (() => {
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
    .option('mult', {
      alias: 'm',
      describe: 'Bulk-migrate process for each available workspace',
      required: false,
      type: 'boolean'
    })
    .argv
})()
