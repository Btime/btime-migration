/* eslint-env mocha */

require('dotenv').config()

const path = require('path')
const { expect } = require('chai')
const { exec } = require('child_process')
const rollback = path.join(__dirname, '..', 'bin/rollback')

describe('Rollback tests', () => {
  it('Expect failure when required options are not specified', done => {
    exec(`${rollback}`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when a non-existing version is specified', done => {
    exec(`${rollback} -v 1234777`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when a non-existing work directory (-w) is specified', done => {
    exec(`${rollback} -w ./non-existing-dir -v 1234777`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when migrations repository does not exist', done => {
    const originalEnvVariable = process.env.SQL_URI
    const customDir = 'test/mocks/migrate/custom-dir'

    process.env.SQL_URI = 'postgres://postgres:postgres@localhost:5432/postgres'

    exec(`${rollback} -v 20180918110551011 -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      process.env.SQL_URI = originalEnvVariable
      done(null)
    })
  })

  it('Expect failure when database type is invalid', done => {
    exec(`${rollback} -t mongo -v 1234`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it(`Expect failure when rolling back multiple workspaces(-m) but
  cannot connect to get URIs`, done => {
    const customDir = 'test/mocks/rollback'
    const originalEnvVariable = process.env.MULTIPLE_URI

    process.env.MULTIPLE_URI = 'invalid-connection-URI'
    exec(`${rollback} -m -w ${customDir} -v 20180927123529146`,
      (err, stdout, stderr) => {
        expect(err).to.equal(null)
        expect(stdout.length).to.equal(0)
        expect(stderr.length).to.not.equal(0)
        process.env.MULTIPLE_URI = originalEnvVariable
        done(null)
      })
  })

  it('Expect failure when connection URI is not supported', (done) => {
    const customDir = 'test/mocks/rollback'
    const originalEnvVariable = process.env.SQL_URI

    process.env.SQL_URI = 'redis://localhost:777'

    exec(`${rollback} -w ${customDir} -v 20180927123529146`,
      (err, stdout, stderr) => {
        expect(err).to.equal(null)
        expect(stdout.length).to.equal(0)
        expect(stderr.length).to.not.equal(0)
        process.env.SQL_URI = originalEnvVariable
        done(null)
      })
  })

  it('Expect ran migration (from custom work dir) to rollback', done => {
    const customDir = 'test/mocks/migrate/custom-dir'

    exec(`${rollback} -v 20180918110551011 -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.not.equal(0)
      expect(stderr.length).to.equal(0)
      done(null)
    })
  })

  it('Expect to skip rollback if version is not tracked at repository', done => {
    const customDir = 'test/mocks/migrate/custom-dir'

    exec(`${rollback} -v 20180918110551011 -w ${customDir}`,
      (err, stdout, stderr) => {
        expect(err).to.equal(null)
        expect(stdout.length).to.not.equal(0)
        expect(stderr.length).to.equal(0)
        const skippedInfo = (stdout.match(/(Skipped|20180918110551011)/gi) || []).length

        expect(skippedInfo).to.equal(2)
        done(null)
      })
  })

  it(`Expect to rollback multiple workspaces when utilizing
    the "multiple" option (-m)`, done => {
    const customDir = 'test/mocks/migrate/multiple-workspaces'

    exec(`${rollback} -v 20181001161919126 -m -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.not.equal(0)
      expect(stderr.length).to.equal(0)

      const affectedWorkspaces = (stdout.match(/(Rolled back)/gi) || []).length

      expect(affectedWorkspaces).to.equal(3)
      done(null)
    })
  })
})
