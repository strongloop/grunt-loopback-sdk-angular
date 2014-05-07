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
var _ = require('underscore'),
  loopback = require('loopback'),
  path = require('path'),
  app = module.exports = loopback(),
  started = new Date();

//create an 'appReady' callback handler so code that imports this file can know when the full loopback service is configured

var onReadyCallbacks = [];
app.onReady = function(cb) {
  onReadyCallbacks.push(cb);
};

function doOnReady() {
  _.each(onReadyCallbacks, function(cb) {
    cb && cb();
  });
}

//do something asyncronously that gets me some model metadata I can use later
var myAsyncThing = require('my-async-model-building-module');

myAsyncThing.run(function(metadata) {

  /*
   * 1. Configure LoopBack models and datasources
   *
   * Read more at http://apidocs.strongloop.com/loopback#appbootoptions
   */

  app.boot(__dirname);
  
  //use the model metadata to introspectively register new models
  myAsyncThing.buildModels(metadata);

  /*
   * 2. Configure request preprocessing
   *
   *  LoopBack support all express-compatible middleware.
   */

  app.use(loopback.favicon());
  app.use(loopback.logger(app.get('env') === 'development' ? 'dev' : 'default'));

  app.use(loopback.bodyParser());
  app.use(loopback.methodOverride());

  /*
   * EXTENSION POINT
   * Add your custom request-preprocessing middleware here.
   * Example:
   *   app.use(loopback.limit('5.5mb'))
   */

  /*
   * 3. Setup request handlers.
   */

  // LoopBack REST interface
  var apiPath = '/api';
  app.use(loopback.cookieParser('secret'));
  app.use(loopback.token({model: app.models.accessToken}));
  app.use(apiPath, loopback.rest());

  // API explorer (if present)
  var explorerPath = '/explorer';
  try {
    var explorer = require('loopback-explorer');
    app.use(explorerPath, explorer(app, { basePath: apiPath }));
  } catch(e){
    // ignore errors, explorer stays disabled
  }

  /*
   * EXTENSION POINT
   * Add your custom request-handling middleware here.
   * Example:
   *   app.use(function(req, resp, next) {
   *     if (req.url == '/status') {
   *       // send status response
   *     } else {
   *       next();
   *     }
   *   });
   */
    
  // Let express routes handle requests that were not handled
  // by any of the middleware registered above.
  // This way LoopBack REST and API Explorer take precedence over
  // express routes.
  app.use(app.router);

  // The static file server should come after all other routes
  // Every request that goes through the static middleware hits
  // the file system to check if a file exists.
  app.use(loopback.static(path.join(__dirname, '..', 'public')));

  // Requests that get this far won't be handled
  // by any middleware. Convert them into a 404 error
  // that will be handled later down the chain.
  app.use(loopback.urlNotFound());

  /*
   * 4. Setup error handling strategy
   */

  /*
   * EXTENSION POINT
   * Add your custom error reporting middleware here
   * Example:
   *   app.use(function(err, req, resp, next) {
   *     console.log(req.url, ' failed: ', err.stack);
   *     next(err);
   *   });
   */

  // The ultimate error handler.
  app.use(loopback.errorHandler());


  /*
   * 5. Add a basic application status route at the root `/`.
   *
   * (remove this to handle `/` on your own)
   */

  // app.get('/', loopback.status());

  app.enableAuth();

  //app API is ready to go -- time to alert anyone who cares (lookin' at you grunt-loopback-angular)
  doOnReady();

  if(require.main === module) {
    require('http').createServer(app).listen(app.get('port'), app.get('host'), function(){
      var baseUrl = 'http://' + app.get('host') + ':' + app.get('port');
      if (explorerPath) {
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      } else {
        console.log(
          'Run `npm install loopback-explorer` to enable the LoopBack explorer');
      }
      console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    });
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
          appReady: 'onReady',
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
