module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."userCustomer" (
      "id" SERIAL,
      "userId" INTEGER NOT NULL,
      "customerId" INTEGER NOT NULL,
      "enabled" BOOLEAN NOT NULL default true,
      "deleted" BOOLEAN NOT NULL default false,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'userCustomer_pkey'
        ) THEN
          ALTER TABLE public."userCustomer"
            ADD CONSTRAINT "userCustomer_pkey" PRIMARY KEY(id);
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
    DROP TABLE IF EXISTS public."userCustomer";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
