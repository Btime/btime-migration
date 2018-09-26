const log = console.log
const chalk = require('chalk')
const Filename = require('./filename')

module.exports.workspace = (uri) => {
  log(chalk.bold.yellow(`Workspace: ${getWorkspaceFromUri(uri)}`))
}

module.exports.up = (file) => {
  log(
    `${chalk.underline.green('Running Up:')} ${Filename.getVersion(file)}`
  )
}

module.exports.down = (payload) => {
  log(
    `${chalk.underline.yellow('Rolling back:')} ${Filename.getVersion(payload.file)}`
  )
}

module.exports.untrackedVersion = (payload) => {
  log(
    chalk.black.bgYellow(' Skipped '),
    `Version "${payload.argv.v}" is not tracked on repository.`,
  )
}

module.exports.upResume = (versions) => {
  return new Promise((resolve, reject) => {
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

    log(`${chalk.bold.underline.yellow('Resume:')} ${resume}\n`)

    return resolve(versions)
  })
}

function getWorkspaceFromUri (uri) {
  return uri.split('/').pop()
}
