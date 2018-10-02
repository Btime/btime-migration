const yargs = require('yargs')
const TYPE_OPTIONS = [ 'sql', 'nonsql' ]

module.exports.argv = () => {
  return yargs
    .usage('Usage: $0 -v [version]')
    .version(false)
    .option('version', {
      alias: 'v',
      describe: 'Migration version (identifier)',
      type: 'string',
      nargs: 1
    })
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
      describe: 'Path to locate the migration file',
      nargs: 1,
      type: 'string'
    })
    .option('multiple', {
      alias: 'm',
      describe: 'Bulk-rollback process for each available workspace',
      type: 'boolean'
    })
    .demandOption([ 'version' ])
    .argv
}
