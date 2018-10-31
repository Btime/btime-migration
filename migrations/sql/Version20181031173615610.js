module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'serviceType' AS "entity", "id" AS "originalId"
      FROM "serviceType";

    ALTER TABLE public."service"
      DROP CONSTRAINT IF EXISTS "service_serviceTypeId_fkey";

    UPDATE public."service" servicetable SET "serviceTypeId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = servicetable."serviceTypeId" AND "entity" = 'serviceType'
    ) WHERE "serviceTypeId" IS NOT NULL;

    ALTER TABLE public."service"
      ADD CONSTRAINT "service_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId")
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
    ALTER TABLE public."service"
      DROP CONSTRAINT IF EXISTS "service_serviceTypeId_fkey";

    UPDATE public."service" servicetable SET "serviceTypeId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = servicetable."serviceTypeId" AND "entity" = 'serviceType'
    ) WHERE "serviceTypeId" IS NOT NULL;

    ALTER TABLE public."service"
      ADD CONSTRAINT "service_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId")
      REFERENCES public."serviceType" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'serviceType';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
