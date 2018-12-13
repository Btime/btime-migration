module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."checkList"
    ALTER COLUMN "photoEnabled" DROP NOT NULL;
     
    ALTER TABLE public."checkList"
    ALTER COLUMN "photoEnabled" SET DEFAULT NULL;
    
    ALTER TABLE public."checkList"
    ALTER COLUMN "confidential" DROP NOT NULL;
    
    ALTER TABLE public."checkList"
    ALTER COLUMN "confidential" SET DEFAULT NULL;
    
    ALTER TABLE public."checkList"
    ALTER COLUMN "annotationEnabled" DROP NOT NULL;
    
    ALTER TABLE public."checkList"
    ALTER COLUMN "annotationEnabled" SET DEFAULT NULL;
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
    ALTER COLUMN "photoEnabled" TYPE BOOLEAN;
     
    ALTER TABLE public."checkList"
    ALTER COLUMN "confidential" TYPE BOOLEAN;
    
    ALTER TABLE public."checkList"
    ALTER COLUMN "annotationEnabled" TYPE BOOLEAN;
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
