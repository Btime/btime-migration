module.exports.up = (connection) => {
  return new Promise((resolve, reject) => {
    return resolve(__filename)
  })
}

module.exports.down = (connection) => {
  return new Promise((resolve, reject) => {
    return resolve(__filename)
  })
}