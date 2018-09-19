/* eslint-env mocha */

const { expect } = require('chai')
const { exec } = require('child_process')
const generate = require('path').join(__dirname, '../bin/generate')

describe('Generate tests', () => {
  it('Expect to not generate file migration', (done) => {
    exec(generate, (error, stdout, stderr) => {
      expect(error).to.not.be.equal(null)
      expect(stdout.length).to.be.equal(0)
      expect(stderr.length).to.not.be.equal(0)
      done(null)
    })
  })

  it('Expect to not generate invalid file migration', (done) => {
    exec(generate + ' -t invalid', (error, stdout, stderr) => {
      const invalidErrorMessage = '\u001b[31mError: Invalid type format\u001b[0m\n'
      expect(error).to.be.equal(null)
      expect(stdout.length).to.not.be.equal(0)
      expect(stdout).to.be.equal(invalidErrorMessage)
      expect(stderr.length).to.be.equal(0)
      done(null)
    })
  })

  it('Expect to generate sql file migration', (done) => {
    exec(generate + ' -t sql', (error, stdout, stderr) => {
      expect(error).to.be.equal(null)
      expect(stdout.length).to.not.be.equal(0)
      expect(stderr.length).to.be.equal(0)

      const expectFileFormat = '.sql'
      const parts = stdout.split('/')
      expect(parts[parts.length - 1].indexOf(expectFileFormat))
        .to.not.be.equal(-1)

      done(null)
    })
  })

  it('Expect to generate nonsql file migration', (done) => {
    exec(generate + ' -t nonsql', (error, stdout, stderr) => {
      expect(error).to.be.equal(null)
      expect(stdout.length).to.not.be.equal(0)
      expect(stderr.length).to.be.equal(0)

      const expectFileFormat = '.json'
      const parts = stdout.split('/')
      expect(parts[parts.length - 1].indexOf(expectFileFormat))
        .to.not.be.equal(-1)

      done(null)
    })
  })
})
