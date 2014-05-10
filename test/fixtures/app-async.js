var loopback = require('loopback');
var app = loopback();

module.exports = app;

//simulate the case where there are async operations that the app does before it's ready to have its lb-services generated
process.nextTick(function() {

  // Setup default datasources for autoAttach()
  app.dataSource('db', { connector: 'memory', defaultForType: 'db' });
  app.dataSource('mail', { connector: 'mail', defaultForType: 'mail' });

  // Attach all built-in models
  loopback.autoAttach();

  // Configure REST API path
  app.set('restApiRoot', '/rest-api-root');

  //let anything that cares (require'ing code) know the app is ready
  app.emit('ready');
});