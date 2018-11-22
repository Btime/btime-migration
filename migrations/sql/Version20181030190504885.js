module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
     INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'customerSegment' AS "entity", "id" AS "originalId"
      FROM "customerSegment";

    ALTER TABLE public."customer"
      DROP CONSTRAINT IF EXISTS "customer_segmentId_fkey";

    UPDATE public."customer" customertable SET "segmentId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = customertable."segmentId" AND "entity" = 'customerSegment'
    ) WHERE "segmentId" IS NOT NULL;

    ALTER TABLE public."customer"
      ADD CONSTRAINT "customer_segmentId_fkey" FOREIGN KEY ("segmentId")
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
    ALTER TABLE public."customer"
      DROP CONSTRAINT IF EXISTS "customer_segmentId_fkey";

    UPDATE public."customer" customertable SET "segmentId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = customertable."segmentId" AND "entity" = 'customerSegment'
    ) WHERE "segmentId" IS NOT NULL;

    ALTER TABLE public."customer"
      ADD CONSTRAINT "customer_segmentId_fkey" FOREIGN KEY ("segmentId")
      REFERENCES public."customerSegment" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'customerSegment';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
