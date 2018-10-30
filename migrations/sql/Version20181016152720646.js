module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'userGroup_pkey'
        ) THEN
          ALTER TABLE public."userGroup"
            ADD CONSTRAINT "userGroup_pkey" PRIMARY KEY(id);
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
    ALTER TABLE public."userGroup"
      DROP CONSTRAINT IF EXISTS "userGroup_pkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
