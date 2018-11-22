module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."company"
      ALTER COLUMN "phoneNumber" DROP NOT NULL;
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."company"
    ALTER COLUMN "phoneNumber" TYPE CHARACTER VARYING (15),
    ALTER COLUMN "phoneNumber" SET NOT NULL
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
