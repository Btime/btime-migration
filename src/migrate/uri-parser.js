const SUPPORTED_DRIVERS = {
  'sql': [
    'postgres',
    'mysql',
    'sqlite',
    'mssql'
  ],
  'nonsql': [ 'mongodb' ]
}

module.exports.parse = (uri) => {
  const regexDriversPattern = [].concat(
    SUPPORTED_DRIVERS.sql,
    SUPPORTED_DRIVERS.nonsql
  ).join('|')

  const driver = RegExp(`^(${regexDriversPattern})`).exec(uri)

  if (!driver) {
    throw new Error(
      `The connection "${uri}" could not be resolved as SQL or NONSQL`
    )
  }
  return driverType(driver.shift())
}

function driverType (driver) {
  if (SUPPORTED_DRIVERS.sql.includes(driver)) {
    return 'sql'
  }

  if (SUPPORTED_DRIVERS.nonsql.includes(driver)) {
    return 'nonsql'
  }

  throw new Error(`${driver} is not supported.`)
}
