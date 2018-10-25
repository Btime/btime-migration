module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."refund"
    ADD COLUMN "companyId" INTEGER DEFAULT NULL
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
    ALTER TABLE public."refund"
    DROP COLUMN IF EXISTS "companyId"
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
