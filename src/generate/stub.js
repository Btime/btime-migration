module.exports.up = (connection) => {
  return new Promise((resolve, reject) => {
    resolve(__filename)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    resolve({ ...payload })
  })
}
