module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'paymentType' AS "entity", "id" AS "originalId"
      FROM "paymentType";

    ALTER TABLE public."refund"
      DROP CONSTRAINT IF EXISTS "refund_paymentTypeId_fkey";

    UPDATE public."refund" refundtable SET "paymentTypeId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = refundtable."paymentTypeId" AND "entity" = 'paymentType'
    ) WHERE "paymentTypeId" IS NOT NULL; 

    ALTER TABLE public."refund"
      ADD CONSTRAINT "refund_paymentTypeId_fkey" FOREIGN KEY ("paymentTypeId")
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
      DROP CONSTRAINT IF EXISTS "refund_paymentTypeId_fkey";

    UPDATE public."refund" refundtable SET "paymentTypeId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = refundtable."paymentTypeId" AND "entity" = 'paymentType'
    ) WHERE "paymentTypeId" IS NOT NULL; 

    ALTER TABLE public."refund"
      ADD CONSTRAINT "refund_paymentTypeId_fkey" FOREIGN KEY ("paymentTypeId")
      REFERENCES public."paymentType" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'paymentType';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
