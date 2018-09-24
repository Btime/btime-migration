const UriParser = require('../migrate/uri-parser')

module.exports.make = (uri) => {
  try {
    const type = UriParser.parse(uri)

    if (type === 'sql') {
      return require('./sql')
    }

    throw new Error(`Could not resolve driver from connection URI: ${uri}`)
  } catch (error) {
    throw error
  }
}

module.exports.makeByType = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const type = payload.connection.type

      if (type === 'sql') {
        return resolve(Object.assign(payload, {
          driver: require('./sql')
        }))
      }

      throw new Error(`Could not resolve driver for type: ${type}`)
    } catch (error) {
      return reject(error)
    }
  })
}
