module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE TABLE public."serviceOrderDisapproved" (
        id integer NOT NULL,
        "serviceOrderId" integer,
        "disapprovedId" integer,
        description text,
        enabled boolean DEFAULT true NOT NULL,
        deleted boolean DEFAULT false NOT NULL,
        "createdById" integer,
        "deletedById" integer,
        "createdAt" timestamp with time zone NOT NULL,
        "updatedAt" timestamp with time zone NOT NULL
      );

      ALTER TABLE ONLY public."serviceOrderDisapproved"
        ADD CONSTRAINT "serviceOrderDisapproved_pkey" PRIMARY KEY (id);

      ALTER TABLE public."serviceOrderDisapproved"
        ADD CONSTRAINT "serviceOrderDisapproved_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId")
        REFERENCES public."serviceOrder" (id) ON UPDATE CASCADE ON DELETE SET NULL;

      ALTER TABLE public."serviceOrderDisapproved"
        ADD CONSTRAINT "serviceOrderDisapproved_disapprovedId_fkey" FOREIGN KEY ("disapprovedId")
        REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;

      ALTER TABLE public."serviceOrderDisapproved"
        ADD CONSTRAINT "serviceOrderDisapproved_createdById_fkey" FOREIGN KEY ("createdById")
        REFERENCES public."user" (id) ON UPDATE CASCADE ON DELETE SET NULL;

      ALTER TABLE public."serviceOrderDisapproved"
        ADD CONSTRAINT "serviceOrderDisapproved_deletedById_fkey" FOREIGN KEY ("deletedById")
        REFERENCES public."user" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
      DROP TABLE public."serviceOrderDisapproved";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
