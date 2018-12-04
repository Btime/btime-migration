module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."userLocation"
      ADD COLUMN "locationEnabled" VARCHAR(255) DEFAULT NULL;
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
    ALTER TABLE public."userLocation"
      DROP COLUMN IF EXISTS "locationEnabled";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
