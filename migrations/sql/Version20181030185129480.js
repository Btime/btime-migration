module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      ALTER TABLE public."serviceOrderUnproductive"
        ADD COLUMN IF NOT EXISTS "documentId" INTEGER DEFAULT NULL;

      ALTER TABLE public."serviceOrderUnproductive"
        DROP CONSTRAINT IF EXISTS "serviceOrderUnproductive_documentId_fkey";

      ALTER TABLE public."serviceOrderUnproductive"
        ADD CONSTRAINT "serviceOrderUnproductive_documentId_fkey" FOREIGN KEY ("documentId")
        REFERENCES public."document" (id) ON UPDATE CASCADE ON DELETE SET NULL;

      ALTER TABLE public."serviceOrderCanceled"
        ADD COLUMN IF NOT EXISTS "documentId" INTEGER DEFAULT NULL;

      ALTER TABLE public."serviceOrderUnproductive"
        DROP CONSTRAINT IF EXISTS "serviceOrderCanceled_documentId_fkey";

      ALTER TABLE public."serviceOrderCanceled"
        ADD CONSTRAINT "serviceOrderCanceled_documentId_fkey" FOREIGN KEY ("documentId")
        REFERENCES public."document" (id) ON UPDATE CASCADE ON DELETE SET NULL;

      ALTER TABLE public."serviceOrderEvent"
        ADD COLUMN IF NOT EXISTS "serviceOrderUnproductiveId" INTEGER DEFAULT NULL;

      ALTER TABLE public."serviceOrderUnproductive"
        DROP CONSTRAINT IF EXISTS "serviceOrderEvent_serviceOrderUnproductiveId_fkey";

      ALTER TABLE public."serviceOrderEvent"
        ADD CONSTRAINT "serviceOrderEvent_serviceOrderUnproductiveId_fkey" FOREIGN KEY ("serviceOrderUnproductiveId")
        REFERENCES public."serviceOrderUnproductive" (id) ON UPDATE CASCADE ON DELETE SET NULL;

      ALTER TABLE public."serviceOrderEvent"
        ADD COLUMN IF NOT EXISTS "serviceOrderCanceledId" INTEGER DEFAULT NULL;

      ALTER TABLE public."serviceOrderUnproductive"
        DROP CONSTRAINT IF EXISTS "serviceOrderEvent_serviceOrderCanceledId_fkey";

      ALTER TABLE public."serviceOrderEvent"
        ADD CONSTRAINT "serviceOrderEvent_serviceOrderCanceledId_fkey" FOREIGN KEY ("serviceOrderCanceledId")
        REFERENCES public."serviceOrderCanceled" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
      ALTER TABLE public."serviceOrderUnproductive"
        DROP CONSTRAINT "serviceOrderUnproductive_documentId_fkey";

      ALTER TABLE public."serviceOrderUnproductive"
        DROP COLUMN "documentId";

      ALTER TABLE public."serviceOrderCanceled"
        DROP CONSTRAINT "serviceOrderCanceled_documentId_fkey";

      ALTER TABLE public."serviceOrderCanceled"
        DROP COLUMN "documentId";

      ALTER TABLE public."serviceOrderEvent"
        DROP CONSTRAINT "serviceOrderEvent_serviceOrderUnproductiveId_fkey";

      ALTER TABLE public."serviceOrderEvent"
        DROP COLUMN "serviceOrderUnproductiveId";

      ALTER TABLE public."serviceOrderEvent"
        DROP CONSTRAINT "serviceOrderEvent_serviceOrderCanceledId_fkey";

      ALTER TABLE public."serviceOrderEvent"
        DROP COLUMN "serviceOrderCanceledId";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
