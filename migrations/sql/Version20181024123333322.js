module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."serviceCompany" (
      "id" SERIAL,
      "serviceId" INTEGER NOT NULL,
      "companyId" INTEGER NOT NULL,
      "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'serviceCompany_pkey'
        ) THEN
          ALTER TABLE public."serviceCompany"
            ADD CONSTRAINT "serviceCompany_pkey" PRIMARY KEY(id);
        END IF;
      END;
    $$;
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
    DROP TABLE IF EXISTS public."serviceCompany";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}