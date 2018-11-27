module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."userLocation"
      ADD COLUMN "mobile" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "appVersion" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceInternalDiskSize" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceInternalDiskUsedSpace" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceInternalDiskFreeSpace" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceName" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceOSName" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceOSVersion" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceBattery" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceBatteryHealth" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceScreenResolution" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceMemory" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceMemoryUsage" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceManufacturer" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceModel" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceModelName" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceNetworkType" VARCHAR(255) DEFAULT NULL,
      ADD COLUMN "deviceNetworkWifiSpeed" VARCHAR(255) DEFAULT NULL;
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
    ALTER TABLE public."userLocation"
      DROP COLUMN IF EXISTS "mobile",
      DROP COLUMN IF EXISTS "appVersion",
      DROP COLUMN IF EXISTS "deviceInternalDiskSize",
      DROP COLUMN IF EXISTS "deviceInternalDiskUsedSpace",
      DROP COLUMN IF EXISTS "deviceInternalDiskFreeSpace",
      DROP COLUMN IF EXISTS "deviceName",
      DROP COLUMN IF EXISTS "deviceOSName",
      DROP COLUMN IF EXISTS "deviceOSVersion",
      DROP COLUMN IF EXISTS "deviceBattery",
      DROP COLUMN IF EXISTS "deviceBatteryHealth",
      DROP COLUMN IF EXISTS "deviceScreenResolution",
      DROP COLUMN IF EXISTS "deviceMemory",
      DROP COLUMN IF EXISTS "deviceMemoryUsage",
      DROP COLUMN IF EXISTS "deviceManufacturer",
      DROP COLUMN IF EXISTS "deviceModel",
      DROP COLUMN IF EXISTS "deviceModelName",
      DROP COLUMN IF EXISTS "deviceNetworkType",
      DROP COLUMN IF EXISTS "deviceNetworkWifiSpeed";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
