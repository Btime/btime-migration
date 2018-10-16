module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."userGroup" (
      "id" SERIAL,
      "name" CHARACTER VARYING(255) NOT NULL,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "enabled" BOOLEAN NOT NULL default true,
      "deleted" BOOLEAN NOT NULL default false,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    ALTER TABLE public."userGroup"
      ADD CONSTRAINT userGroup_pkey PRIMARY KEY(id);
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
    ALTER TABLE public."userGroup"
      DROP CONSTRAINT userGroup_pkey;

    DROP TABLE public."userGroup";`

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
