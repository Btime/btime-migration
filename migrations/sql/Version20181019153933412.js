module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    CREATE TABLE IF NOT EXISTS public."userLocation" (
      "id" SERIAL,
      "latitude" DOUBLE PRECISION NOT NULL,
      "longitude" DOUBLE PRECISION NOT NULL,
      "userId" INTEGER NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    );

    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'userLocation_pkey'
        ) THEN
          ALTER TABLE public."userLocation"
            ADD CONSTRAINT "userLocation_pkey" PRIMARY KEY(id);
        END IF;
      END;
    $$;

    ALTER TABLE public."userLocation"
      DROP CONSTRAINT IF EXISTS "userLocation_userId_fkey";

     ALTER TABLE public."userLocation"
      ADD CONSTRAINT "userLocation_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."userLocation"
      DROP CONSTRAINT IF EXISTS "userLocation_pkey";

    ALTER TABLE public."userLocation"
      DROP CONSTRAINT IF EXISTS "userLocation_userId_fkey";

    DROP TABLE IF EXISTS public."userLocation";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
