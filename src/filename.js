const moment = require('moment')

const PATTERN = {
  prefix: 'Version',
  extension: '.js'
}

module.exports.PATTERN = PATTERN

module.exports.generate = () => {
  return PATTERN.prefix +
    moment().format('YYYYMMDDHHmmssSSS') +
    PATTERN.extension
}

module.exports.getVersion = (filename) => {
  filename = filename.split('/').pop()

  return filename.replace(versionRegExp(), '')
}

function versionRegExp () {
  const pattern = `[(${PATTERN.prefix})|(${PATTERN.extension})]*`

  return new RegExp(pattern, 'gi')
}
