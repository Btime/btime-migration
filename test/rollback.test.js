/* eslint-env mocha */

const { expect } = require('chai')
const { exec } = require('child_process')
const path = require('path')
const rollback = path.join(__dirname, '..', 'bin/rollback')

describe('Rollback tests', () => {
  it('Expect failure when required options are not specified', (done) => {
    exec(`${rollback}`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it.skip('Expect failure when a non-existing version is specified', (done) => {
    exec(`${rollback} -v 1234777 -t sql`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })
})
