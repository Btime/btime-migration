module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."minicrud"
      ADD COLUMN "entity" CHARACTER VARYING (255) DEFAULT 'name' NOT NULL;

    ALTER TABLE public."minicrud"
      ADD COLUMN "originalId" INTEGER;`

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."minicrud"
      DROP COLUMN IF EXISTS "entity";

    ALTER TABLE public."minicrud"
      DROP COLUMN IF EXISTS "originalId";`

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
