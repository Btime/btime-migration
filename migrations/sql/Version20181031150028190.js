module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'rescheduling' AS "entity", "id" AS "originalId"
      FROM "rescheduling";

    ALTER TABLE public."serviceOrderRescheduling"
      DROP CONSTRAINT IF EXISTS "serviceOrderRescheduling_reschedulingId_fkey";

    UPDATE public."serviceOrderRescheduling" reschedulingtable SET "reschedulingId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = reschedulingtable."reschedulingId" AND "entity" = 'rescheduling'
    ) WHERE "reschedulingId" IS NOT NULL;

    ALTER TABLE public."serviceOrderRescheduling"
      ADD CONSTRAINT "serviceOrderRescheduling_reschedulingId_fkey" FOREIGN KEY ("reschedulingId")
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
    ALTER TABLE public."serviceOrderRescheduling"
      DROP CONSTRAINT IF EXISTS "serviceOrderRescheduling_reschedulingId_fkey";

    UPDATE public."serviceOrderRescheduling" reschedulingtable SET "reschedulingId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = reschedulingtable."reschedulingId" AND "entity" = 'rescheduling'
    ) WHERE "reschedulingId" IS NOT NULL;

    ALTER TABLE public."serviceOrderRescheduling"
      ADD CONSTRAINT "serviceOrderRescheduling_reschedulingId_fkey" FOREIGN KEY ("reschedulingId")
      REFERENCES public."rescheduling" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'rescheduling';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
