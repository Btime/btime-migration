/* eslint-env mocha */

require('dotenv').config()
const { expect } = require('chai')

describe('Environment tests', () => {
  it('Expect required environment variables to be set', (done) => {
    expect(process.env.SQL_URI.length).to.be.gt(0)
    expect(process.env.NONSQL_URI.length).to.be.gt(0)
    expect(process.env.MULTIPLE_URI.length).to.be.gt(0)
    expect(process.env.MULTIPLE_COLLECTION.length).to.be.gt(0)
    expect(process.env.MULTIPLE_COLLECTION_COLUMN.length).to.be.gt(0)
    done(null)
  })
})
