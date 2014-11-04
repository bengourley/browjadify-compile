var compile = require('../compile')
  , assert = require('assert')
  , browserify = require('browserify')
  , vm = require('vm')
  , fs = require('fs')
  , transform = require('browjadify')

describe('browjadify', function () {

  describe('compile()', function () {

    it('should take a filename and return a js function', function () {
      var template = compile(__dirname + '/fixtures/a.jade')
      assert.equal(typeof template, 'function')
      assert(/^function (anonymous|template)\(locals/.test(template.toString()))
      assert(/^<!DOCTYPE html>/.test(template()))
    })

    it('should throw an error when template does not exist', function () {
      assert.throws(function () {
        compile(__dirname + '/fixtures/x.jade')
      })
    })

    it('should list the dependent jade files as a property on the returned function', function () {
      var template = compile(__dirname + '/fixtures/c.jade')
      assert.deepEqual([ __dirname + '/fixtures/d.jade' ], template.dependencies)
    })

  })

  describe('package.json', function () {

    it('should resolve to compile.js when run in node', function () {
      assert(require('./fixtures/b-node')(__dirname + '/fixtures/b.jade'))
    })

    it('should resolve to browser.js when run in browserify', function (done) {

      var b = browserify();
      b.add(__dirname + '/fixtures/b-browser.js')
      b.transform(transform({}))
      b.bundle(function (err, src) {
        if (err) done(err)
        vm.runInNewContext(src, { console: {}, jade: require('jade/lib/runtime'), window: {} })
        assert.notEqual(-1, src.indexOf(fs.readFileSync(__dirname + '/../browser.js')))
        done()
      })

    })

  })

})
