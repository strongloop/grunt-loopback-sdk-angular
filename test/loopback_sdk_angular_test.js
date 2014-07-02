'use strict';

var grunt = require('grunt');
var parse = require('loopback-sdk-angular/parse-helper');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

// Note: the tests are depending on targets configured in Gruntfile.js

exports.loopback_angular = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    var script = grunt.file.read('tmp/default_options');

    // the value "lbservices" is the --module-name default
    test.equal(parse.moduleName(script), 'lbServices');
    // the value "/rest-api-root" is hard-coded in fixtures/app.js
    test.equal(parse.baseUrl(script), '/rest-api-root');
    test.done();
  },

  custom_options: function(test) {
    var script = grunt.file.read('tmp/custom_options');
    test.equal(parse.moduleName(script), 'customServices');
    test.equal(parse.baseUrl(script), 'http://custom/api');
    test.done();
  }
};
