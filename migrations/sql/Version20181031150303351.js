module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'refused' AS "entity", "id" AS "originalId"
      FROM "refused";

    ALTER TABLE public."serviceOrderRefused"
      DROP CONSTRAINT IF EXISTS "serviceOrderRefused_refusedId_fkey";

    UPDATE public."serviceOrderRefused" refusedtable SET "refusedId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = refusedtable."refusedId" AND "entity" = 'refused'
    ) WHERE "refusedId" IS NOT NULL;

    ALTER TABLE public."serviceOrderRefused"
      ADD CONSTRAINT "serviceOrderRefused_refusedId_fkey" FOREIGN KEY ("refusedId")
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
    ALTER TABLE public."serviceOrderRefused"
      DROP CONSTRAINT IF EXISTS "serviceOrderRefused_refusedId_fkey";

    UPDATE public."serviceOrderRefused" refusedtable SET "refusedId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = refusedtable."refusedId" AND "entity" = 'refused'
    ) WHERE "refusedId" IS NOT NULL;

    ALTER TABLE public."serviceOrderRefused"
      ADD CONSTRAINT "serviceOrderRefused_refusedId_fkey" FOREIGN KEY ("refusedId")
      REFERENCES public."refused" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'refused';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
