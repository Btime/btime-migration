module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO public."minicrud"
      ("name", "enabled", "deleted", "createdById",
        "deletedById", "createdAt", "updatedAt", "entity", "originalId")
     SELECT "name", "enabled", "deleted", "createdById",
      "deletedById", "createdAt", "updatedAt",
      'fleetBrand' AS "entity", "id" AS "originalId"
      FROM "fleetBrand";

    ALTER TABLE public."fleet"
      DROP CONSTRAINT IF EXISTS "fleet_brandId_fkey";

    UPDATE public."fleet" fleettable SET "brandId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = fleettable."brandId" AND "entity" = 'fleetBrand'
    ) WHERE "brandId" IS NOT NULL;

    ALTER TABLE public."fleet"
      ADD CONSTRAINT "fleet_brandId_fkey" FOREIGN KEY ("brandId")
      REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    ALTER TABLE public."fleetModel"
      DROP CONSTRAINT IF EXISTS "fleetModel_brandId_fkey";

    UPDATE public."fleetModel" fleetmodeltable SET "brandId" = (
      SELECT "id" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."originalId" = fleetmodeltable."brandId" AND "entity" = 'fleetBrand'
    ) WHERE "brandId" IS NOT NULL;

    ALTER TABLE public."fleetModel"
      ADD CONSTRAINT "fleetModel_brandId_fkey" FOREIGN KEY ("brandId")
      REFERENCES public."minicrud" (id) ON UPDATE CASCADE ON DELETE SET NULL;`

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
      DROP CONSTRAINT IF EXISTS "fleetModel_brandId_fkey";
    UPDATE public."fleet" a SET "brandId" = (
      SELECT "originalId" FROM public."minicrud" b
      WHERE b."id" = a."brandId" AND "entity" = 'fleetBrand'
    ) WHERE "brandId" IS NOT NULL;

    ALTER TABLE public."fleet"
      ADD CONSTRAINT "fleet_brandId_fkey" FOREIGN KEY ("brandId")
      REFERENCES public."fleetBrand" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    ALTER TABLE public."fleetModel"
      DROP CONSTRAINT IF EXISTS "fleetModel_brandId_fkey";

    UPDATE public."fleetModel" fleetmodeltable SET "brandId" = (
      SELECT "originalId" FROM public."minicrud" minicrudtable
      WHERE minicrudtable."id" = fleetmodeltable."brandId" AND "entity" = 'fleetBrand'
    ) WHERE "brandId" IS NOT NULL;

    ALTER TABLE public."fleetModel"
      ADD CONSTRAINT "fleetModel_brandId_fkey" FOREIGN KEY ("brandId")
      REFERENCES public."fleetBrand" (id) ON UPDATE CASCADE ON DELETE SET NULL;

    DELETE FROM public."minicrud"
      WHERE "entity" = 'fleetBrand';
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
