const log = console.log
const chalk = require('chalk')
const { getVersion } = require('../filename')

module.exports.workspace = (uri) => {
  log(chalk.bold.yellow(`Workspace: ${uri.split('/').pop()}`))
}

module.exports.migration = (file) => {
  log(`${chalk.underline.green('Running Up:')} ${getVersion(file)}`)
}

module.exports.resume = (versions) => {
  return new Promise((resolve, reject) => {
    let resume = 'Nothing to migrate'

    if (versions && versions.length) {
      const first = getVersion(versions.slice(0, 1)[0])

      if (versions.length === 1) {
        resume = `Only "${first}"`
      }

      if (versions.length > 1) {
        resume = `From: "${first}", To: "${getVersion(versions.slice(-1)[0])}"`
      }
    }

    log(`${chalk.bold.underline.yellow('Resume:')} ${resume}\n`)

    return resolve(versions)
  })
}
