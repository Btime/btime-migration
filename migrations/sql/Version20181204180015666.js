module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      ALTER TABLE public."refund" ALTER COLUMN "description" TYPE text;
      ALTER TABLE public."refundPaid" ALTER COLUMN "description" TYPE text;
      ALTER TABLE public."replyDocument" ALTER COLUMN "description" TYPE text;
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
      ALTER TABLE public."refund" ALTER COLUMN "description" TYPE varchar(255);
      ALTER TABLE public."refundPaid" ALTER COLUMN "description" TYPE varchar(255);
      ALTER TABLE public."replyDocument" ALTER COLUMN "description" TYPE varchar(255);
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
