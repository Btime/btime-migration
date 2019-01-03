'use strict'

const { join } = require('path')
const DEFAULT_FOLDER_NAME = 'migrations'

module.exports.migrationsPath = ({ workdir, type }) => {
  return workdir || join(process.cwd(), DEFAULT_FOLDER_NAME, type)
}
