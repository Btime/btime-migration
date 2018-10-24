module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."serviceCompany"
    DROP CONSTRAINT IF EXISTS "serviceCompany_serviceId_fkey";

    ALTER TABLE public."serviceCompany"
    ADD CONSTRAINT "serviceCompany_serviceId_fkey" FOREIGN KEY ("serviceId")
    REFERENCES public."service" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."serviceCompany"
    DROP CONSTRAINT IF EXISTS "serviceCompany_serviceId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
