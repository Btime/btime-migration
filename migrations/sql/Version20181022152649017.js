module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."userCompany"
    DROP CONSTRAINT IF EXISTS "userCompany_userId_fkey";

    ALTER TABLE public."userCompany"
      ADD CONSTRAINT "userCompany_userId_fkey" FOREIGN KEY ("userId")
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
    ALTER TABLE public."userCompany"
    DROP CONSTRAINT IF EXISTS "userCompany_userId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
