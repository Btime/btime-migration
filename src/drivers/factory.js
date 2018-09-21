const UriParser = require('../migrate/uri-parser')

module.exports.make = (uri) => {
  try {
    const type = UriParser.parse(uri)

    if (type === 'sql') {
      return require('./sql')
    }

    throw new Error('Could not resolve driver from connection URI')
  } catch (error) {
    throw error
  }
}
