/*
 * grunt-loopback-angular
 * https://github.com/strongloop/grunt-loopback-angular
 *
 * Copyright (c) 2014 StrongLoop, Inc.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  //noinspection JSHint
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    loopback_angular: {
      options: {
        input: 'test/fixtures/app.js'
      },
      default_options: {
        options: {
          output: 'tmp/default_options'
        }
      },
      custom_options: {
        options: {
          output: 'tmp/custom_options',
          ngModuleName: 'customServices',
          apiUrl: 'http://custom/api/'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test:sync', ['clean', 'loopback_angular', 'nodeunit']);

  // need a special config and fixture to test the async case
  grunt.registerTask(
    'test:async', 
    'Configure the fixture and options for the async test and run it.',
    function() {

      grunt.config.set('loopback_angular', {
        services: {
          options: {
            input: 'test/fixtures/app-async.js',
            appReadyEvent: 'ready',
            output: 'tmp/async_app'
          }
        }
      });

      grunt.config.set('nodeunit', {
        tests: ['test/async/*_test.js']
      });

      grunt.task.run('clean', 'loopback_angular', 'nodeunit');
    });

  grunt.registerTask('test', ['test:sync', 'test:async']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
