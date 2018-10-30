module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    DELETE FROM public."minicrud";`

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdAt", "updatedAt")
      VALUES ('name', true, false, now(), now());`

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
