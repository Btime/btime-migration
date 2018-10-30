module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."company" (
      "id" SERIAL,
      "name" CHARACTER VARYING(100) NOT NULL,
      "nationalRegistration" CHARACTER VARYING(45) UNIQUE NOT NULL,
      "stateRegistration" CHARACTER VARYING(45),
      "municipalRegistration" CHARACTER VARYING(45),
      "phoneNumber" CHARACTER VARYING(15) NOT NULL,
      "phoneNumber2" CHARACTER VARYING(15),
      "email" CHARACTER VARYING(255) NOT NULL,
      "financialEmail" CHARACTER VARYING(255) NOT NULL,
      "avatarId" INTEGER,
      "createdById" INTEGER,
      "deletedById" INTEGER,
      "enabled" BOOLEAN NOT NULL default true,
      "deleted" BOOLEAN NOT NULL default false,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'company_pkey'
        ) THEN
          ALTER TABLE public."company"
            ADD CONSTRAINT "company_pkey" PRIMARY KEY(id);
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
    DROP TABLE IF EXISTS public."company";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
