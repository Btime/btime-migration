module.exports = {
  resolve: (argv) => {
    return new Promise((resolve, reject) => {
      if (!argv.m) {
        const connection = (
          argv.t === 'sql' ? process.env.SQL_URI : process.env.NONSQL_URI
        )
        resolve([ connection ])
      }
    })
  }
}
