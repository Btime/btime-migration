module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."checkList"
    ALTER COLUMN "photoEnabled" SET DEFAULT FALSE;

    ALTER TABLE public."checkList"
    ALTER COLUMN "confidential" SET DEFAULT FALSE;

    ALTER TABLE public."checkList"
    ALTER COLUMN "annotationEnabled" SET DEFAULT FALSE;
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
    ALTER COLUMN "photoEnabled" SET DEFAULT NULL;

    ALTER TABLE public."checkList"
    ALTER COLUMN "confidential" SET DEFAULT NULL;

    ALTER TABLE public."checkList"
    ALTER COLUMN "annotationEnabled" SET DEFAULT NULL;
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
