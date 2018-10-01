const log = console.log
const chalk = require('chalk')
const Filename = require('./filename')

module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const version = Filename.getVersion(payload.migration)
      const workspace = getWorkspaceFromUri(payload.uri)
      log(
        `${chalk.underline.green(`Migrated (${workspace}):`)} ${version}`
      )
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const version = Filename.getVersion(payload.file)
      const workspace = getWorkspaceFromUri(payload.uri)
      log(
        `${chalk.underline.yellow(`Rolled back (${workspace}):`)} ${version}`
      )
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
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

    log(`${chalk.bold.underline.yellow(`Resume (${workspace}):`)} ${resume}\n`)

    return resolve(versions)
  })
}

function getWorkspaceFromUri (uri) {
  return uri.split('/').pop()
}
