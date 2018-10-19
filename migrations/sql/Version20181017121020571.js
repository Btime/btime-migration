module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."companyAddress"
      DROP CONSTRAINT IF EXISTS "companyAddress_createdById_fkey";

    ALTER TABLE public."companyAddress"
      ADD CONSTRAINT "companyAddress_createdById_fkey" FOREIGN KEY ("createdById")
      REFERENCES public."user" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."companyAddress"
      DROP CONSTRAINT IF EXISTS "companyAddress_createdById_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
