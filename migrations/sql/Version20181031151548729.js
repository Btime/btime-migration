module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'validated' AS "entity", "id" AS "originalId"
      FROM "validated";

    ALTER TABLE public."serviceOrderValidated"
      DROP CONSTRAINT IF EXISTS "serviceOrderValidated_validatedId_fkey";

    UPDATE public."serviceOrderValidated" validatedtable SET "validatedId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = validatedtable."validatedId" AND "entity" = 'validated'
    ) WHERE "validatedId" IS NOT NULL;

    ALTER TABLE public."serviceOrderValidated"
      ADD CONSTRAINT "serviceOrderValidated_validatedId_fkey" FOREIGN KEY ("validatedId")
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
    ALTER TABLE public."serviceOrderValidated"
      DROP CONSTRAINT IF EXISTS "serviceOrderValidated_validatedId_fkey";

    UPDATE public."serviceOrderValidated" validatedtable SET "validatedId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = validatedtable."validatedId" AND "entity" = 'validated'
    ) WHERE "validatedId" IS NOT NULL;

    ALTER TABLE public."serviceOrderValidated"
      ADD CONSTRAINT "serviceOrderValidated_validatedId_fkey" FOREIGN KEY ("validatedId")
      REFERENCES public."validated" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'validated';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
