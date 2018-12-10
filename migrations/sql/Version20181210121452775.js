module.exports.up = (payload) => {
  return new Promise(async (resolve, reject) => {
    const instance = payload.connection.instance

    const serviceOrders = await selectServiceOrders(instance)

    return Promise.all(serviceOrders.map(serviceOrder => {
      const query = `
      UPDATE public."serviceOrder"
      SET "resumeToken" = (SELECT SUBSTRING(md5(random()::text), 1, 8))
      WHERE "id" = ${serviceOrder.id};
      `
      return instance
        .query(query)
        .then(result => Promise.resolve(result))
        .catch(err => Promise.reject(err))
    }))
      .then(() => resolve(payload))
      .catch(err => reject(err))
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = ``

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(err => reject(err))
  })
}

function selectServiceOrders (instance) {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT "id" FROM public."serviceOrder";
    `

    return instance
      .query(query)
      .then(serviceOrders => {
        return resolve(serviceOrders[0])
      })
      .catch(err => reject(err))
  })
}
