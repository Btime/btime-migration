module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'customerGroup' AS "entity", "id" AS "originalId"
      FROM "customerGroup";

    ALTER TABLE public."customer"
      DROP CONSTRAINT IF EXISTS "customer_groupId_fkey";

    UPDATE public."customer" customertable SET "groupId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = customertable."groupId" AND "entity" = 'customerGroup'
    ) WHERE "groupId" IS NOT NULL;

    ALTER TABLE public."customer"
      ADD CONSTRAINT "customer_groupId_fkey" FOREIGN KEY ("groupId")
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
    ALTER TABLE public."customer"
      DROP CONSTRAINT IF EXISTS "customer_groupId_fkey";

    UPDATE public."customer" customertable SET "groupId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = customertable."groupId" AND "entity" = 'customerGroup'
    ) WHERE "groupId" IS NOT NULL;

    ALTER TABLE public."customer"
      ADD CONSTRAINT "customer_groupId_fkey" FOREIGN KEY ("groupId")
      REFERENCES public."customerGroup" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'customerGroup';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
