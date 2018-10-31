module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'requesterRole' AS "entity", "id" AS "originalId"
      FROM "requesterRole";

    ALTER TABLE public."requester"
      DROP CONSTRAINT IF EXISTS "requester_roleId_fkey";

    UPDATE public."requester" requestertable SET "roleId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = requestertable."roleId" AND "entity" = 'requesterRole'
    ) WHERE "roleId" IS NOT NULL;

    ALTER TABLE public."requester"
      ADD CONSTRAINT "requester_roleId_fkey" FOREIGN KEY ("roleId")
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
    ALTER TABLE public."requester"
      DROP CONSTRAINT IF EXISTS "requester_roleId_fkey";

    UPDATE public."requester" requestertable SET "roleId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = requestertable."roleId" AND "entity" = 'requesterRole'
    ) WHERE "roleId" IS NOT NULL;

    ALTER TABLE public."requester"
      ADD CONSTRAINT "requester_roleId_fkey" FOREIGN KEY ("roleId")
      REFERENCES public."requesterRole" (id) ON UPDATE CASCADE ON DELETE SET NULL

    DELETE FROM public."minicrud"
      WHERE "entity" = 'requesterRole';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
