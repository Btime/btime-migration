module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
    DROP TABLE public."approved";
    DROP TABLE public."canceled";
    DROP TABLE public."checkListCategory";
    DROP TABLE public."customerGroup";
    DROP TABLE public."customerSegment";
    DROP TABLE public."fleetBrand";
    DROP TABLE public."fleetClass";
    DROP TABLE public."fleetCompany";
    DROP TABLE public."fleetContract";
    DROP TABLE public."fleetType";
    DROP TABLE public."paymentType";
    DROP TABLE public."pending";
    DROP TABLE public."refundType";
    DROP TABLE public."refused";
    DROP TABLE public."requesterDepartment";
    DROP TABLE public."requesterRole";
    DROP TABLE public."rescheduling";
    DROP TABLE public."serviceTransport";
    DROP TABLE public."serviceType";
    DROP TABLE public."unproductive";
    DROP TABLE public."userGroupAssociation";
    DROP TABLE public."userGroup";
    DROP TABLE public."validated";
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = ``

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
