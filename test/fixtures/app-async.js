var loopback = require('loopback');
var app = loopback();

module.exports = app;

//setup an onReady handler
var onReady;
app.onReady = function(cb) {

  //to get the grunt multitask to work for this test, we need to also
  //handle the case of the non-first iterations. In those cases, this file 
  //will have already been required so the outer process.nextTick below will not
  //happen again, and neither will the on ready below. Therefore, if onReady is already
  //defined, just directly simulate async...
  if (onReady) {
    process.nextTick(onReady);
  }

  //still overwrite each time with the new callback
  onReady = cb;
};

//simulate the case where there are async operations that the app does before it's ready to have its lb-services generated
process.nextTick(function() {

  // Setup default datasources for autoAttach()
  app.dataSource('db', { connector: 'memory', defaultForType: 'db' });
  app.dataSource('mail', { connector: 'mail', defaultForType: 'mail' });

  // Attach all built-in models
  loopback.autoAttach();

  // Configure REST API path
  app.set('restApiRoot', '/rest-api-root');

  //execute onReady handler if it was registered
  onReady && onReady();
});