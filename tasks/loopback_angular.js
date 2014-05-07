/*
 * grunt-loopback-angular
 * https://github.com/strongloop/grunt-loopback-angular
 *
 * Copyright (c) 2014 StrongLoop, Inc.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var generator = require('loopback-angular');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
    'loopback_angular',
    'Grunt plugin for auto-generating Angular $resource services for LoopBack',
    runTask);

  function runTask() {
    /*jshint validthis:true */

    //need this to accomodate an input file that builds the loopback interface asynchronously
    var done = this.async();
    
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

    var completeTask = function() {
      options.apiUrl = options.apiUrl || app.get('restApiRoot') || '/api';

      grunt.log.writeln('Generating %j for the API endpoint %j',
        options.ngModuleName,
        options.apiUrl);

      var script = generator.services(app, options.ngModuleName, options.apiUrl);

      grunt.file.write(options.output, script);

      grunt.log.ok('Generated Angular services file %j', options.output);

      done();
    };

    var appReady = options.appReady,
      appReadyMethod = app[appReady];

    if (appReady) {
      if (!appReadyMethod) {
        grunt.fail.warn('An appReady method was specified but not found on the exported input object.');
      }

      //register with the app's ready callback handler
      appReadyMethod(completeTask);  
    } else {
      completeTask();
    }
  }
};
