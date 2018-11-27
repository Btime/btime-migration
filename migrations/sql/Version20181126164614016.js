module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."checkList"
    ADD COLUMN "photoEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN "annotationEnabled" BOOLEAN NOT NULL DEFAULT TRUE
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
    ALTER TABLE public."checkList"
    DROP COLUMN IF EXISTS "photoEnabled",
    DROP COLUMN IF EXISTS "annotationEnabled"
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
