module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'canceled' AS "entity", "id" AS "originalId"
      FROM "canceled";

    ALTER TABLE public."serviceOrderCanceled"
      DROP CONSTRAINT IF EXISTS "serviceOrderCanceled_canceledId_fkey";

    UPDATE public."serviceOrderCanceled" canceledtable SET "canceledId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = canceledtable."canceledId" AND "entity" = 'canceled'
    ) WHERE "canceledId" IS NOT NULL;

    ALTER TABLE public."serviceOrderCanceled"
      ADD CONSTRAINT "serviceOrderCanceled_canceledId_fkey" FOREIGN KEY ("canceledId")
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
    ALTER TABLE public."serviceOrderCanceled"
      DROP CONSTRAINT IF EXISTS "serviceOrderCanceled_canceledId_fkey";

    UPDATE public."serviceOrderCanceled" canceledtable SET "canceledId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = canceledtable."canceledId" AND "entity" = 'canceled'
    ) WHERE "canceledId" IS NOT NULL;

    ALTER TABLE public."serviceOrderCanceled"
      ADD CONSTRAINT "serviceOrderCanceled_canceledId_fkey" FOREIGN KEY ("canceledId")
      REFERENCES public."canceled" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'canceled';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
