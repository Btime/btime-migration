module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'requesterDepartment' AS "entity", "id" AS "originalId"
      FROM "requesterDepartment";

    ALTER TABLE public."requester"
      DROP CONSTRAINT IF EXISTS "requester_departmentId_fkey";

    UPDATE public."requester" requestertable SET "departmentId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = requestertable."departmentId" AND "entity" = 'requesterDepartment'
    ) WHERE "departmentId" IS NOT NULL;

    ALTER TABLE public."requester"
      ADD CONSTRAINT "requester_departmentId_fkey" FOREIGN KEY ("departmentId")
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
      DROP CONSTRAINT IF EXISTS "requester_departmentId_fkey";

    UPDATE public."requester" requestertable SET "departmentId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = requestertable."departmentId" AND "entity" = 'requesterDepartment'
    ) WHERE "departmentId" IS NOT NULL;

    ALTER TABLE public."requester"
      ADD CONSTRAINT "requester_departmentId_fkey" FOREIGN KEY ("departmentId")
      REFERENCES public."requesterDepartment" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'requesterDepartment';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
