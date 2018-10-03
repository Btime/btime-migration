const log = console.log
const chalk = require('chalk')
const Filename = require('./filename')

module.exports.workspace = (payload) => {
  log(chalk.bold.yellow(`Workspace: ${getWorkspaceFromUri(payload.uri)}`))

  return Promise.resolve(payload)
}

module.exports.up = (payload) => {
  const version = Filename.getVersion(payload.migration)

  log(`${chalk.underline.green(`Migrated:`)} ${version}`)

  return Promise.resolve(payload)
}

module.exports.down = (payload) => {
  const version = Filename.getVersion(payload.file)

  log(`${chalk.underline.yellow(`Rolled back:`)} ${version}`)

  return Promise.resolve(payload)
}

module.exports.untrackedVersion = (payload) => {
  const workspace = getWorkspaceFromUri(payload.uri)
  log(
    chalk.black.bgYellow(' Skipped '),
    chalk.bold.yellow(`(${workspace})`),
    `Version "${payload.version}" is not tracked on repository.`,
  )
}

module.exports.upResume = (payload) => {
  const versions = payload.versions
  const workspace = getWorkspaceFromUri(payload.uri)

  let resume = 'Nothing to migrate'

  if (versions && versions.length) {
    const first = Filename.getVersion(versions.slice(0, 1)[0])

    if (versions.length === 1) {
      resume = `Only "${first}"`
    }

    if (versions.length > 1) {
      resume = `From: "${first}", To: "${Filename.getVersion(versions.slice(-1)[0])}"`
    }
  }

  log(`${chalk.bold.underline.yellow(`Resume (${workspace}):`)} ${resume}\n`)

  return Promise.resolve(versions)
}

module.exports.migrationFailed = () => {
  const flag = chalk.bgRed(chalk.bold.yellow('MIGRATION FAILED'))

  log(`\n${flag} ${chalk.bold.yellow('Rolling back changes...')}\n`)
}

function getWorkspaceFromUri (uri) {
  return uri.split('/').pop()
}
