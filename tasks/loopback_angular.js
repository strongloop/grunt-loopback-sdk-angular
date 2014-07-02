/*
 * grunt-loopback-sdk-angular
 * https://github.com/strongloop/grunt-loopback-sdk-angular
 *
 * Copyright (c) 2014 StrongLoop, Inc.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var generator = require('loopback-sdk-angular');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
    'loopback_sdk_angular',
    'Grunt plugin for auto-generating Angular $resource services for LoopBack',
    runTask);

  function runTask() {
    /*jshint validthis:true */

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      ngModuleName: 'lbServices',
      apiUrl: undefined
    });

    var appFile = options.input;
    if (!appFile)
      grunt.fail.warn('Missing mandatory option "input".');

    if (!grunt.file.exists(appFile))
      grunt.fail.warn('Input file ' + appFile + ' not found.');

    if (!options.output)
      grunt.fail.warn('Missing mandatory option "output".');

    var app;
    try {
      app = require(path.resolve(appFile));
      grunt.log.ok('Loaded LoopBack app %j', appFile);
    } catch (e) {
      var err = new Error('Cannot load LoopBack app ' + appFile);
      err.origError = e;
      grunt.fail.warn(err);
    }

    options.apiUrl = options.apiUrl || app.get('restApiRoot') || '/api';

    grunt.log.writeln('Generating %j for the API endpoint %j',
      options.ngModuleName,
      options.apiUrl);

    var script = generator.services(app, options.ngModuleName, options.apiUrl);

    grunt.file.write(options.output, script);

    grunt.log.ok('Generated Angular services file %j', options.output);
  }
};
