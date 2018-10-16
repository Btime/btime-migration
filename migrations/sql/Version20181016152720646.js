module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    ALTER TABLE public."user" ADD COLUMN "groupId" INTEGER;

    ALTER TABLE ONLY public."user"
      ADD CONSTRAINT "user_groupId_fkey" FOREIGN KEY ("groupId")
      REFERENCES public."userGroup" (id) ON UPDATE CASCADE ON DELETE SET NULL;
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
    ALTER TABLE public."user" DROP COLUMN "groupId";

    ALTER TABLE public."user" DROP CONSTRAINT "user_groupId_fkey";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
