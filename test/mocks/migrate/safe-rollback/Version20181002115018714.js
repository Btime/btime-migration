module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `AN INVALID QUERY, FORCING AN ERROR TO OCCOUR`

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = ``

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
