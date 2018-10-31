module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
     INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'checkListCategory' AS "entity", "id" AS "originalId"
      FROM "checkListCategory";

    ALTER TABLE public."checkList"
      DROP CONSTRAINT IF EXISTS "checkList_checkListCategoryId_fkey";

    UPDATE public."checkList" checklisttable SET "checkListCategoryId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = checklisttable."checkListCategoryId" AND "entity" = 'checkListCategory'
    ) WHERE "checkListCategoryId" IS NOT NULL;

    ALTER TABLE public."checkList"
      ADD CONSTRAINT "checkList_checkListCategoryId_fkey" FOREIGN KEY ("checkListCategoryId")
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
    ALTER TABLE public."checkList"
      DROP CONSTRAINT IF EXISTS "checkList_checkListCategoryId_fkey";

    UPDATE public."checkList" checklisttable SET "checkListCategoryId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = checklisttable."checkListCategoryId" AND "entity" = 'checkListCategory'
    ) WHERE "checkListCategoryId" IS NOT NULL;

    ALTER TABLE public."checkList"
      ADD CONSTRAINT "checkList_checkListCategoryId_fkey" FOREIGN KEY ("checkListCategoryId")
      REFERENCES public."checkListCategory" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'checkListCategory';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
