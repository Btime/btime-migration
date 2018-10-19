module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."userGroupAssociation" (
      "id" SERIAL,
      "userId" INTEGER NOT NULL,
      "groupId" INTEGER NOT NULL,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "enabled" BOOLEAN NOT NULL default true,
      "deleted" BOOLEAN NOT NULL default false,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );
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
    DROP TABLE IF EXISTS public."userGroupAssociation";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
