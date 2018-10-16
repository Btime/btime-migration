module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      ALTER TABLE public."userGroupAssociation"
        ADD CONSTRAINT "userGroupAssociation_userId_fkey" FOREIGN KEY ("userId")
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
      ALTER TABLE public."userGroupAssociation"
        DROP CONSTRAINT "userGroupAssociation_userId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
