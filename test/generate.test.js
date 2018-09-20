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
      expect(error).to.not.equal(null)
      expect(stdout.length).to.be.equal(0)
      expect(stderr.length).to.not.equal(0)
      done(null)
    })
  })

  it('Expect to generate sql file migration', (done) => {
    exec(generate + ' -t sql', (error, stdout, stderr) => {
      expect(error).to.be.equal(null)
      expect(stdout.length).to.not.be.equal(0)
      expect(stderr.length).to.be.equal(0)

      const expectFileFormat = '.js'
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

      const expectFileFormat = '.js'
      const parts = stdout.split('/')
      expect(parts[parts.length - 1].indexOf(expectFileFormat))
        .to.not.be.equal(-1)

      done(null)
    })
  })
})
