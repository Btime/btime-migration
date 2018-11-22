module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'serviceTransport' AS "entity", "id" AS "originalId"
      FROM "serviceTransport";

    ALTER TABLE public."serviceOrder"
      DROP CONSTRAINT IF EXISTS "serviceOrder_transportId_fkey";

    UPDATE public."serviceOrder" serviceordertable SET "transportId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = serviceordertable."transportId" AND "entity" = 'serviceTransport'
    ) WHERE "transportId" IS NOT NULL;

    ALTER TABLE public."serviceOrder"
      ADD CONSTRAINT "serviceOrder_transportId_fkey" FOREIGN KEY ("transportId")
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
    ALTER TABLE public."serviceOrder"
      DROP CONSTRAINT IF EXISTS "serviceOrder_transportId_fkey";

    UPDATE public."serviceOrder" serviceordertable SET "transportId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = serviceordertable."transportId" AND "entity" = 'serviceTransport'
    ) WHERE "transportId" IS NOT NULL;

    ALTER TABLE public."serviceOrder"
      ADD CONSTRAINT "serviceOrder_transportId_fkey" FOREIGN KEY ("transportId")
      REFERENCES public."serviceTransport" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'serviceTransport';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
