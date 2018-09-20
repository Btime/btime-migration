'use strict'

const yargs = require('yargs')
const TYPE_OPTIONS = [ 'sql', 'nonsql' ]

module.exports.argv = (() => {
  return yargs
    .usage('Usage: $0 -t [sql or nonsql]')
    .option('type', {
      alias: 't',
      describe: 'Relational (sql) or NonRelational (nonsql)',
      type: 'string',
      choices: TYPE_OPTIONS
    })
    .demandOption([ 'type' ])
    .argv
})()
