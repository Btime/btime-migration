/* eslint-env mocha */

const fs = require('fs')
const path = require('path')
const { expect } = require('chai')

describe('Environment tests', () => {
  it('Expect environment file (.env) to exist', (done) => {
    fs.access(path.join(__dirname, '..', '.env'), fs.constants.F_OK, (err) => {
      expect(err).to.equal(null)
      done(null)
    })
  })

  it('Expect required environment variables to be set', (done) => {
    expect(process.env.SQL_URI.length).to.be.gt(0)
    expect(process.env.NONSQL_URI.length).to.be.gt(0)
    expect(process.env.MULTIPLE_URI.length).to.be.gt(0)
    expect(process.env.MULTIPLE_COLLECTION.length).to.be.gt(0)
    expect(process.env.MULTIPLE_COLLECTION_COLUMN.length).to.be.gt(0)
    done(null)
  })
})
