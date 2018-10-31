module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'approved' AS "entity", "id" AS "originalId"
      FROM "approved";

    ALTER TABLE public."serviceOrderApproved"
      DROP CONSTRAINT IF EXISTS "serviceOrderApproved_approvedId_fkey";

    UPDATE public."serviceOrderApproved" approvedtable SET "approvedId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = approvedtable."approvedId" AND "entity" = 'approved'
    ) WHERE "approvedId" IS NOT NULL;

    ALTER TABLE public."serviceOrderApproved"
      ADD CONSTRAINT "serviceOrderApproved_approvedId_fkey" FOREIGN KEY ("approvedId")
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
    ALTER TABLE public."serviceOrderApproved"
      DROP CONSTRAINT IF EXISTS "serviceOrderApproved_approvedId_fkey";

    UPDATE public."serviceOrderApproved" approvedtable SET "approvedId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = approvedtable."approvedId" AND "entity" = 'approved'
    ) WHERE "approvedId" IS NOT NULL;

    ALTER TABLE public."serviceOrderApproved"
      ADD CONSTRAINT "serviceOrderApproved_approvedId_fkey" FOREIGN KEY ("approvedId")
      REFERENCES public."approved" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'approved';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
