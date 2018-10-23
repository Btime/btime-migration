module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."refund"
    DROP CONSTRAINT IF EXISTS "refund_companyId_fkey";

    ALTER TABLE public."refund"
    ADD CONSTRAINT "refund_companyId_fkey" FOREIGN KEY ("companyId")
    REFERENCES public."company" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."refund"
    DROP CONSTRAINT IF EXISTS "refund_companyId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
