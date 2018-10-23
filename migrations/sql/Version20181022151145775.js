module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."userCompany" (
      "id" SERIAL,
      "userId" INTEGER NOT NULL,
      "companyId" INTEGER NOT NULL,
      "enabled" BOOLEAN NOT NULL default true,
      "deleted" BOOLEAN NOT NULL default false,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    ALTER TABLE public."userCompany"
      DROP CONSTRAINT IF EXISTS "userCompany_pkey";

    ALTER TABLE public."userCompany"
      ADD CONSTRAINT "userCompany_pkey" PRIMARY KEY(id);
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
    DROP TABLE IF EXISTS public."userCompany";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}