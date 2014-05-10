# grunt-loopback-angular

> Grunt plugin for auto-generating Angular $resource services for LoopBack

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before,
be sure to check out the [Getting Started](http://gruntjs.com/getting-started)
guide, as it explains how to create
a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and
use Grunt plugins. Once you're familiar with that process, you may install
this plugin with this command:

```shell
npm install grunt-loopback-angular --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-loopback-angular');
```

## Tasks and configuration

See the official
[LoopBack AngularJS SDK documentation](http://docs.strongloop.com/display/DOC/AngularJS+JavaScript+SDK#AngularJSJavaScriptSDK-Gruntplugin)
for the description of tasks provided by this Grunt plugin.

## Async loading of LoopBack App

If your LoopBack app (i.e. the `input` option for this grunt task) needs to perform asynchronous operations before this task runs (like fetch a set of metadata that you want to introspect to build your models), you must export and specify an `appReady` method that registers one or more callback functions and calls them when it is done building/configuring LoopBack.

EXAMPLE: your `app.js` might look something like this...

```
var loopback = require('loopback'),
  app = module.exports = loopback();
  
//do something asyncronously that gets me some model metadata I can use later
var myAsyncThing = require('my-async-model-building-module');

myAsyncThing.run(function(metadata) {

  // Configure LoopBack models and datasources
  app.boot(__dirname);
  
  //use the model metadata to introspectively register new models
  myAsyncThing.buildModels(metadata);

  // other configuration as scaffolded by `slc lb project`
  app.use(loopback.favicon());
  // etc.
  app.enableAuth();

  //app API is ready to go -- time to alert anyone who cares (lookin' at you grunt-loopback-angular)
  app.emit('ready');

  if(require.main === module) {
    //start the http server
  }
});

```

And then your Gruntfile would look like this…

```
module.exports = function(grunt) {
  grunt.initConfig({
    loopback_angular: {
      services: {
        options: {
          input: './app.js',
          appReadyEvent: 'ready',
          output: '../client/app/scripts/lb-services.js'
        }
      }
    },
    docular: {
      groups: [
        {
          groupTitle: 'LoopBack',
          groupId: 'loopback',
          sections: [
            {
              id: 'lbServices',
              title: 'LoopBack Services',
              scripts: [ '../client/app/scripts/lb-services.js' ]
            }
          ]
        }
      ]
    }
  });
  // Load the plugin that provides the "loopback-angular" and "grunt-docular" tasks.
  grunt.loadNpmTasks('grunt-loopback-angular');
  grunt.loadNpmTasks('grunt-docular');
  // Default task(s).
  grunt.registerTask('default', ['loopback_angular', 'docular']);
};
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Mailing List

Discuss features and ask questions on [LoopBack Forum](https://groups.google.com/forum/#!forum/loopbackjs).
