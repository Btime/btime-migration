module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."customerCompany"
    DROP CONSTRAINT IF EXISTS "customerCompany_deletedById_fkey";

    ALTER TABLE public."customerCompany"
    ADD CONSTRAINT "customerCompany_deletedById_fkey" FOREIGN KEY ("deletedById")
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
    ALTER TABLE public."customerCompany"
    DROP CONSTRAINT IF EXISTS "customerCompany_deletedById_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}