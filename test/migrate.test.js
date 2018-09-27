/* eslint-env mocha */

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const { exec } = require('child_process')
const migrate = path.join(__dirname, '..', 'bin/migrate')
const Filename = require('./../src/filename')

describe('Migrate tests', () => {
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

  it('Expect failure without required arguments', (done) => {
    exec(`${migrate}`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when database type is invalid', (done) => {
    exec(`${migrate} -t invalid`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when the "multiple" option is invalid', (done) => {
    exec(`${migrate} -t sql -m not-supported`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when using the "multiple" flag as boolean option', (done) => {
    exec(`${migrate} -t sql -m`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect failure when using a non-existing custom directory', (done) => {
    exec(`${migrate} -t sql -w ./not-found-dir`, (err, stdout, stderr) => {
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

    exec(`${migrate} -t sql -m sql`, (err, stdout, stderr) => {
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

    exec(`${migrate} -t sql`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      process.env.SQL_URI = originalEnvVariable
      done(null)
    })
  })

  it(`Expect multiple workspaces to be affected when utilizing
  the "multiple" flag (-m)`, (done) => {
    exec(`${migrate} -t sql -m sql`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.be.gt(0)
      expect(stderr.length).to.equal(0)

      const workspacesCount = (stdout.match(/(Workspace)/g) || []).length
      expect(workspacesCount).to.be.gt(1)
      done(null)
    })
  })

  it('Expect type parameter to accept only one value (last)', (done) => {
    exec(`${migrate} -t nonsql -t sql`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.not.equal(0)
      expect(stderr.length).to.equal(0)
      done(null)
    })
  })

  it('Expect output "Nothing to migrate" when there are no migrations', (done) => {
    let emptyMigrationsDir = 'test/mocks/migrate/empty-dir/'

    exec(`${migrate} -t sql -w ${emptyMigrationsDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stderr.length).to.equal(0)
      expect(stdout.length).not.to.equal(0)
      expect(stdout.indexOf('Nothing to migrate')).to.not.equal(-1)
      done(null)
    })
  })

  it('Expect to run migrations from a custom directory', (done) => {
    const customDir = 'test/mocks/migrate/custom-dir'

    exec(`${migrate} -t sql -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stderr.length).to.equal(0)
      expect(stdout.length).not.to.equal(0)
      done(null)
    })
  })

  it('Expect type to match when utilizing the "multiple" option', (done) => {
    exec(`${migrate} -t sql -m nonsql`, (err, stdout, stderr) => {
      expect(err).to.not.equal(null)
      expect(stdout.length).to.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect to run migration as SQL type and custom directory', (done) => {
    const customDir = 'test/mocks/migrate/custom-dir'

    exec(`${migrate} -t sql -w ${customDir}`, (err, stdout, stderr) => {
      expect(err).to.equal(null)
      expect(stdout.length).to.not.equal(0)
      expect(stderr.length).to.equal(0)
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

      exec(`${migrate} -t sql -w ${customDir}`, (err, stdout, stderr) => {
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
})
