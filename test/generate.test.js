/* eslint-env mocha */

const { expect } = require('chai')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const generate = path.join(__dirname, '..', 'bin', 'generate')
const WORK_DIR = {
  absolute: path.join(__dirname, 'mocks', 'generate'),
  relative: path.join('test', 'mocks', 'generate')
}

describe('Generate tests', () => {
  before(() => {
    fs.stat(WORK_DIR.absolute, (err, stats) => {
      if (err) {
        fs.mkdir(WORK_DIR.absolute, err => {
          if (err) throw err
        })
      }
    })
  })

  after(() => {
    fs.readdir(WORK_DIR.absolute, (err, files) => {
      if (err) throw err

      files.map(file => {
        fs.unlink(path.join(WORK_DIR.absolute, file), err => {
          if (err) throw err
        })
      })
    })
  })

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
    exec(`${generate} -t sql -w ${WORK_DIR.relative}`,
      (error, stdout, stderr) => {
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
    exec(`${generate} -t nonsql -w ${WORK_DIR.relative}`,
      (error, stdout, stderr) => {
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

  it('Expect to generate file with stub (default) content', (done) => {
    exec(`${generate} -t sql -w ${WORK_DIR.relative}`,
      (error, stdout, stderr) => {
        expect(error).to.equal(null)
        expect(stdout.length).to.not.equal(0)
        expect(stderr.length).to.equal(0)

        const filePathPattern = new RegExp(/\/?([a-z0-9/\-.]*\.js)/, 'gi')

        const matches = filePathPattern.exec(stdout)

        const filePath = matches[0].replace(/["]/g, '')

        fs.readFile(filePath, (error, data) => {
          expect(error).to.equal(null)
          expect(data.length).to.not.equal(0)

          fs.readFile(`${__dirname}/../src/generate/stub.js`, (err, content) => {
            expect(err).to.equal(null)
            expect(data.equals(content)).to.equal(true)
            done(null)
          })
        })
      })
  })
})
