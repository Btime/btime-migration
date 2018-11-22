module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'unproductive' AS "entity", "id" AS "originalId"
      FROM "unproductive";

    ALTER TABLE public."serviceOrderUnproductive"
      DROP CONSTRAINT IF EXISTS "serviceOrderUnproductive_unproductiveId_fkey";

    UPDATE public."serviceOrderUnproductive" unproductivetable SET "unproductiveId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = unproductivetable."unproductiveId" AND "entity" = 'unproductive'
    ) WHERE "unproductiveId" IS NOT NULL;

    ALTER TABLE public."serviceOrderUnproductive"
      ADD CONSTRAINT "serviceOrderUnproductive_unproductiveId_fkey" FOREIGN KEY ("unproductiveId")
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
      DROP CONSTRAINT IF EXISTS "serviceOrderCanceled_unproductiveId_fkey";

    UPDATE public."serviceOrderCanceled" unproductivetable SET "unproductiveId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = unproductivetable."unproductiveId" AND "entity" = 'unproductive'
    ) WHERE "unproductiveId" IS NOT NULL;

    ALTER TABLE public."serviceOrderCanceled"
      ADD CONSTRAINT "serviceOrderCanceled_unproductiveId_fkey" FOREIGN KEY ("unproductiveId")
      REFERENCES public."unproductive" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'unproductive';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
