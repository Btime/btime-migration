module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."serviceOrder"
      ADD COLUMN "parentId" INTEGER DEFAULT NULL;

    ALTER TABLE public."serviceOrder"
      ADD CONSTRAINT "serviceOrder_parentId_fkey" FOREIGN KEY ("parentId")
      REFERENCES public."serviceOrder" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."serviceOrder"
      DROP CONSTRAINT IF EXISTS "serviceOrder_parentId_fkey";

    ALTER TABLE public."serviceOrder"
      DROP COLUMN IF EXISTS "parentId";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
