/*
 * grunt-loopback-sdk-angular
 * https://github.com/strongloop/grunt-loopback-sdk-angular
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
    loopback_sdk_angular: {
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
  grunt.registerTask('test', ['clean', 'loopback_sdk_angular', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
