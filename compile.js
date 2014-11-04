module.exports = compile

var jade = require('jade')
  , fs = require('fs')

function compile(filename) {

  /* jshint evil:true */

  var hasClientFn = 'function' === typeof jade.compileClient
    , options =
      { compileDebug: false
      , filename: filename
      }

  if (!hasClientFn) options.client = true
  var fn = jade[hasClientFn ? 'compileClient' : 'compile'](fs.readFileSync(filename), options)
  if ('string' === typeof fn) fn = new Function('return ' + fn)()
  fn.dependencies = listDependentFiles(filename)
  return fn

}

function listDependentFiles(filename) {
  var parser = new jade.Parser(fs.readFileSync(filename, 'utf8'), filename)
  parser.parse()
  return parser.dependencies || []
}
