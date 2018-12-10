module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."serviceOrder"
    DROP CONSTRAINT IF EXISTS "serviceOrder_resumeToken_key";
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
    ALTER TABLE public."serviceOrder"
    DROP CONSTRAINT IF EXISTS "serviceOrder_resumeToken_key";

    ALTER TABLE public."serviceOrder"
    ADD CONSTRAINT "serviceOrder_resumeToken_key" UNIQUE ("resumeToken");
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
