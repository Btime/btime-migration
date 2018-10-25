module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."customerCompany" (
      "id" SERIAL,
      "customerId" INTEGER NOT NULL,
      "companyId" INTEGER NOT NULL,
      "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    ALTER TABLE public."customerCompany"
    DROP CONSTRAINT IF EXISTS "customerCompany_pkey";

    ALTER TABLE public."customerCompany"
    ADD CONSTRAINT "customerCompany_pkey" PRIMARY KEY (id);
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
    DROP TABLE IF EXISTS public."customerCompany";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
