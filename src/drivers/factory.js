'use strict'

const UriParser = require('../migrate/uri-parser')

module.exports.make = (uri) => {
  return new Promise((resolve, reject) => {
    try {
      const type = UriParser.parse(uri)

      return makeByType({ connection: { type } })
        .then(payload => resolve(payload.driver))
        .catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}

function makeByType (payload) {
  return new Promise((resolve, reject) => {
    try {
      const type = payload.connection.type

      if (type === 'sql') {
        return resolve(Object.assign({}, payload, {
          driver: require('./sql')
        }))
      }

      return reject(Error(`Could not resolve driver for type: ${type}`))
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports.makeByType = makeByType
