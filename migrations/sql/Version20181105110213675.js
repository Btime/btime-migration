module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."importEntity"
      DROP CONSTRAINT IF EXISTS "importEntity_importId_fkey";

    ALTER TABLE public."importEntity"
      ADD CONSTRAINT "importEntity_importId_fkey" FOREIGN KEY ("importId")
      REFERENCES public."import" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."importEntity"
      DROP CONSTRAINT IF EXISTS "importEntity_importId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
