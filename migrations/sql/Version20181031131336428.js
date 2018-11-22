module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'refundType' AS "entity", "id" AS "originalId"
      FROM "refundType";

    ALTER TABLE public."refund"
      DROP CONSTRAINT IF EXISTS "refund_refundTypeId_fkey";

    UPDATE public."refund" refundtable SET "refundTypeId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = refundtable."refundTypeId" AND "entity" = 'refundType'
    ) WHERE "refundTypeId" IS NOT NULL; 

    ALTER TABLE public."refund"
      ADD CONSTRAINT "refund_refundTypeId_fkey" FOREIGN KEY ("refundTypeId")
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
     ALTER TABLE public."refund"
      DROP CONSTRAINT IF EXISTS "refund_refundTypeId_fkey";

    UPDATE public."refund" refundtable SET "paymentTypeId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = refundtable."refundTypeId" AND "entity" = 'refundType'
    ) WHERE "refundTypeId" IS NOT NULL; 

    ALTER TABLE public."refund"
      ADD CONSTRAINT "refund_refundTypeId_fkey" FOREIGN KEY ("refundTypeId")
      REFERENCES public."refundType" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'refundType';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
