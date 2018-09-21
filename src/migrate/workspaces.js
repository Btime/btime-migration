module.exports.getWorkspaces = (payload) => {
  return new Promise((resolve, reject) => {
    if (!payload.argv.m) {
      const connection = (
        payload.argv.t === 'sql' ? process.env.SQL_URI : process.env.NONSQL_URI
      )
      resolve(Object.assign(payload, { databaseUrls: [ connection ] }))
    }
    throw new Error('Multiple databases migration is not supported yet.')
  })
}
