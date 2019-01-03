'use strict'

const yargs = require('yargs')
const TYPE_OPTIONS = [ 'sql', 'nonsql' ]

module.exports.argv = (() => {
  return yargs
    .usage('Usage: $0 -t [sql or nonsql]')
    .option('type', {
      alias: 't',
      describe: 'Relational (sql) or non-relational (nonsql)',
      type: 'string',
      nargs: 1,
      default: 'sql',
      choices: TYPE_OPTIONS
    })
    .option('workdir', {
      alias: 'w',
      describe: 'Path to locate the migration files (according to type)',
      nargs: 1,
      type: 'string'
    })
    .option('multiple', {
      alias: 'm',
      describe: 'Bulk-migrate process for each available workspace',
      type: 'boolean'
    })
    .option('env', {
      alias: 'e',
      describe: 'Path to locate the environment variables file',
      type: 'string'
    })
    .demandOption([ 'type' ])
    .argv
})()
