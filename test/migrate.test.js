/* eslint-env mocha */

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const { exec } = require('child_process')
const migrate = path.join(__dirname, '..', 'bin/migrate')
const Filename = require('./../src/filename')

describe('Migrate tests', () => {
  it('Expect failure when database type is invalid', (done) => {
    exec(`${migrate} -t invalid`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when using a non-existing custom directory', (done) => {
    exec(`${migrate} -w ./not-found-dir`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)

      const outputParts = stderr.split(':')

      expect(outputParts[1].trim()).to.equal('ENOENT')
      done(null)
    })
  })

  it(`Expect failure when migrating multiple workspaces (-m) but cannot connect
    to get URIs`, (done) => {
    const originalEnvVariable = process.env.MULTIPLE_URI

    process.env.MULTIPLE_URI = 'invalid-connection-URI'

    exec(`${migrate} -m`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      process.env.MULTIPLE_URI = originalEnvVariable
      done(null)
    })
  })

  it('Expect failure when connection URI is not supported', (done) => {
    const originalEnvVariable = process.env.SQL_URI

    process.env.SQL_URI = 'redis://localhost:777'

    exec(`${migrate}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      process.env.SQL_URI = originalEnvVariable
      done(null)
    })
  })

  it(`Expect failure when trying to migrate with type NonSQL (not supported yet)`,
    done => {
      exec(`${migrate} -t nonsql`, (err, stdout, stderr) => {
        expect(err).to.equal(null)
        expect(stdout.length).to.equal(0)
        expect(stderr.length).to.not.equal(0)
        done(null)
      })
    })

  it(`Expect multiple workspaces to be affected when utilizing
  the "multiple" flag (-m)`, (done) => {
    const customDir = 'test/mocks/migrate/multiple-workspaces'

    exec(`${migrate} -m -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.be.gt(0)
      expect(stderr.length).to.equal(0)

      const workspacesCount = (stdout.match(/(Resume)/g) || []).length
      expect(workspacesCount).to.be.gt(1)
      done(null)
    })
  })

  it('Expect output "Nothing to migrate" when there are no migrations', (done) => {
    let emptyMigrationsDir = 'test/mocks/migrate/empty-dir/'

    exec(`${migrate} -w ${emptyMigrationsDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stderr.length).to.equal(0)
      expect(stdout.length).not.to.equal(0)
      expect(stdout.indexOf('Nothing to migrate')).to.not.equal(-1)
      done(null)
    })
  })

  it('Expect to run migrations from a custom directory', (done) => {
    const customDir = 'test/mocks/migrate/custom-dir'

    exec(`${migrate} -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stderr.length).to.equal(0)
      expect(stdout.length).not.to.equal(0)
      done(null)
    })
  })

  it('Expect not to run "already-run" migrations', (done) => {
    const customDir = 'test/mocks/migrate/custom-dir'

    fs.readdir(customDir, (err, files) => {
      expect(err).to.equal(null)

      const versions = ((files) => {
        return files.map((file) => {
          return Filename.getVersion(file)
        })
      })(files)

      exec(`${migrate} -w ${customDir}`, (err, stdout, stderr) => {
        expect(err).to.equal(null)
        expect(stdout.length).to.not.equal(0)
        expect(stderr.length).to.equal(0)

        for (const version in versions) {
          expect(stdout.includes(version)).to.equal(false)
        }

        done(null)
      })
    })
  })

  it('Expect to "safe-migrate" (rollback) when something goes wrong', done => {
    exec(`${migrate} -w test/mocks/migrate/safe-rollback`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.not.equal(0)
      expect(stderr.length).to.not.equal(0)

      const migratedOutputRegExp = new RegExp(/(migrated)/, 'gi')
      const rolledbackOutputRegExp = new RegExp(/(rolled back)/, 'gi')

      const migratedMatch = stdout.match(migratedOutputRegExp)
      const rolledbackMatch = stdout.match(rolledbackOutputRegExp)

      expect(migratedMatch.length).to.equal(rolledbackMatch.length)
      done(null)
    })
  })
})
