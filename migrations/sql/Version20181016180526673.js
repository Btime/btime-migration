module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."userGroupAssociation"
      DROP CONSTRAINT IF EXISTS "userGroupAssociation_pkey";

    ALTER TABLE public."userGroupAssociation"
      ADD CONSTRAINT "userGroupAssociation_pkey" PRIMARY KEY(id);
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
      DROP CONSTRAINT IF EXISTS "userGroupAssociation_pkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
