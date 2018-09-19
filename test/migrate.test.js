/* eslint-env mocha */

const { expect } = require('chai')
const { exec } = require('child_process')
const migrate = require('path').join(__dirname, '..', 'bin/migrate')

describe('Migrate tests', () => {
  it('Expect not to migrate without required arguments', (done) => {
    exec(`${migrate}`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect not to migrate when database type is invalid', (done) => {
    exec(`${migrate} -t invalid`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect output "Nothing to migrate" when there are no migrations', (done) => {
    let emptyMigrationsDir = 'test/mocks/migrate/empty-dir/'

    exec(`${migrate} -t sql -w ${emptyMigrationsDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stderr.length).to.equal(0)
      expect(stdout.length).not.to.equal(0)
      expect(stdout).to.equal('Nothing to migrate\n')
      done(null)
    })
  })

  it('Expect to run migrations from a custom directory', (done) => {
    let customDir = 'test/mocks/migrate/custom-dir'

    exec(`${migrate} -t nonsql -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stderr.length).to.equal(0)
      expect(stdout.length).not.to.equal(0)
      done(null)
    })
  })
})
