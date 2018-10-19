module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."userGroupAssociation"
      DROP CONSTRAINT IF EXISTS "userGroupAssociation_groupId_fkey";

    ALTER TABLE public."userGroupAssociation"
      ADD CONSTRAINT "userGroupAssociation_groupId_fkey" FOREIGN KEY ("groupId")
      REFERENCES public."userGroup" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
      DROP CONSTRAINT IF EXISTS "userGroupAssociation_groupId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
