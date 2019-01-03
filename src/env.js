'use strict'

const dotenv = require('dotenv')
const DEFAULT_PATH = '.env'

module.exports.init = (argv) => {
  const { error } = dotenv.config({ path: argv.env || DEFAULT_PATH })

  return error ? Promise.reject(error) : Promise.resolve(argv)
}
