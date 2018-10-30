module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT * FROM information_schema.columns
          WHERE table_name='company' and column_name='default'
        ) THEN
          ALTER TABLE public."company" RENAME COLUMN "default" TO "isDefault";
        END IF;
      END;
    $$;
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
    DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT * FROM information_schema.columns
          WHERE table_name='company' and column_name='isDefault'
        ) THEN
          ALTER TABLE public."company" RENAME COLUMN "isDefault" TO "default";
        END IF;
      END;
    $$;
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
