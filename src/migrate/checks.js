module.exports.checks = (argv) => {
  return (
    migrationType(argv)
  )
}

function migrationType (argv) {
  if (!argv.m) {
    return true
  }

  if (argv.m !== argv.t) {
    throw new Error(
      'Migration type (parameters --type and --mult) MUST HAVE the same value'
    )
  }

  return true
}
