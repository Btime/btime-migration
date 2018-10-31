module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'fleetType' AS "entity", "id" AS "originalId"
      FROM "fleetType";
    ALTER TABLE public."fleet"
      DROP CONSTRAINT IF EXISTS "fleet_typeId_fkey";

    UPDATE public."fleet" fleettable SET "typeId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = fleettable."typeId" AND "entity" = 'fleetType'
    ) WHERE "typeId" IS NOT NULL; 
    ALTER TABLE public."fleet"
      ADD CONSTRAINT "fleet_typeId_fkey" FOREIGN KEY ("typeId")
      REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    ALTER TABLE public."fleetModel"
      DROP CONSTRAINT IF EXISTS "fleetModel_typeId_fkey";

    UPDATE public."fleetModel" fleetmodeltable SET "typeId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = fleetmodeltable."typeId" AND "entity" = 'fleetType'
    ) WHERE "typeId" IS NOT NULL;

    ALTER TABLE public."fleetModel"
      ADD CONSTRAINT "fleetModel_typeId_fkey" FOREIGN KEY ("typeId")
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
    ALTER TABLE public."fleet"
      DROP CONSTRAINT IF EXISTS "fleet_typeId_fkey";

    UPDATE public."fleet" fleettable SET "typeId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = fleettable."typeId" AND "entity" = 'fleetType'
    ) WHERE "typeId" IS NOT NULL;
    ALTER TABLE public."fleet"
      ADD CONSTRAINT "fleet_typeId_fkey" FOREIGN KEY ("typeId")
      REFERENCES public."fleetType" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    ALTER TABLE public."fleetModel"
      DROP CONSTRAINT IF EXISTS "fleetModel_typeId_fkey";

    UPDATE public."fleetModel" fleetmodeltable SET "typeId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = fleetmodeltable."typeId" AND "entity" = 'fleetType'
    ) WHERE "typeId" IS NOT NULL;

    ALTER TABLE public."fleetModel"
      ADD CONSTRAINT "fleetModel_typeId_fkey" FOREIGN KEY ("typeId")
      REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'fleetType';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
