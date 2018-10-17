module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."companyAddress" (
      "id" SERIAL,
      "companyId" INTEGER,
      "addressId" INTEGER,
      "slug" CHARACTER VARYING(255) DEFAULT NULL,
      "enabled" BOOLEAN NOT NULL default true,
      "deleted" BOOLEAN NOT NULL default false,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    ALTER TABLE public."companyAddress"
    ADD CONSTRAINT companyAddress_pkey PRIMARY KEY(id);
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
    DROP TABLE IF EXISTS public."companyAddress";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
