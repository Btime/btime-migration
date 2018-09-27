module.exports.up = (connection) => {
  return new Promise((resolve, reject) => {
    return resolve(__filename)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    return resolve({ ...payload })
  })
}
