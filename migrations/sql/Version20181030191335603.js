module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'fleetClass' AS "entity", "id" AS "originalId"
      FROM "fleetClass";

    ALTER TABLE public."fleet"
      DROP CONSTRAINT IF EXISTS "fleet_classId_fkey";

    UPDATE public."fleet" fleettable SET "classId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = fleettable."classId" AND "entity" = 'fleetClass'
    ) WHERE "classId" IS NOT NULL;

    ALTER TABLE public."fleet"
      ADD CONSTRAINT "fleet_classId_fkey" FOREIGN KEY ("classId")
      REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    ALTER TABLE public."fleetModel"
      DROP CONSTRAINT IF EXISTS "fleetModel_classId_fkey";

    UPDATE public."fleetModel" fleetmodeltable SET "classId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = fleetmodeltable."classId" AND "entity" = 'fleetClass'
    ) WHERE "classId" IS NOT NULL;

    ALTER TABLE public."fleetModel"
      ADD CONSTRAINT "fleetModel_classId_fkey" FOREIGN KEY ("classId")
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
      DROP CONSTRAINT IF EXISTS "fleet_classId_fkey";
    UPDATE public."fleet" a SET "classId" = (
      SELECT "originalId" FROM public."minicrud" b
      WHERE b."id" = a."classId" AND "entity" = 'fleetClass'
    ) WHERE "classId" IS NOT NULL;

    ALTER TABLE public."fleet"
      ADD CONSTRAINT "fleet_classId_fkey" FOREIGN KEY ("classId")
      REFERENCES public."fleetClass" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    ALTER TABLE public."fleetModel"
      DROP CONSTRAINT IF EXISTS "fleetModel_classId_fkey";

    UPDATE public."fleetModel" fleetmodeltable SET "classId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = fleetmodeltable."classId" AND "entity" = 'fleetClass'
    ) WHERE "classId" IS NOT NULL;

    ALTER TABLE public."fleetModel"
      ADD CONSTRAINT "fleetModel_classId_fkey" FOREIGN KEY ("classId")
      REFERENCES public."fleetClass" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'fleetClass';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
