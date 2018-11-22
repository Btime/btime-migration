module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'pending' AS "entity", "id" AS "originalId"
      FROM "pending";

    ALTER TABLE public."serviceOrderPending"
      DROP CONSTRAINT IF EXISTS "serviceOrderPending_pendingId_fkey";

    UPDATE public."serviceOrderPending" pendingtable SET "pendingId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = pendingtable."pendingId" AND "entity" = 'pending'
    ) WHERE "pendingId" IS NOT NULL;

    ALTER TABLE public."serviceOrderPending"
      ADD CONSTRAINT "serviceOrderPending_pendingId_fkey" FOREIGN KEY ("pendingId")
      REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."serviceOrderPending"
      DROP CONSTRAINT IF EXISTS "serviceOrderPending_pendingId_fkey";
      
    UPDATE public."serviceOrderPending" pendingtable SET "pendingId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = pendingtable."pendingId" AND "entity" = 'pending'
    ) WHERE "pendingId" IS NOT NULL;

    ALTER TABLE public."serviceOrderPending"
      ADD CONSTRAINT "serviceOrderPending_pendingId_fkey" FOREIGN KEY ("pendingId")
      REFERENCES public."pending" (id) ON UPDATE CASCADE ON DELETE SET NULL;
  
    DELETE FROM public."minicrud"
      WHERE "entity" = 'pending';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
