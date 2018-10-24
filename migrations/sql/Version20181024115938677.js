module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."customerCompany"
    DROP CONSTRAINT IF EXISTS "customerCompany_customerId_fkey";

    ALTER TABLE public."customerCompany"
    ADD CONSTRAINT "customerCompany_customerId_fkey" FOREIGN KEY ("customerId")
    REFERENCES public."customer" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    DROP CONSTRAINT IF EXISTS "customerCompany_customerId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
