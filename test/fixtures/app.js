// Copyright IBM Corp. 2014. All Rights Reserved.
// Node module: grunt-loopback-sdk-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var app = loopback();

// Setup default datasources for autoAttach()
app.dataSource('db', { connector: 'memory', defaultForType: 'db' });
app.dataSource('mail', { connector: 'mail', defaultForType: 'mail' });

// Attach all built-in models
loopback.autoAttach();


// Configure REST API path
app.set('restApiRoot', '/rest-api-root');

module.exports = app;
