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

// Get loopback model reference 
var Model = loopback.Model;

// Create custom models extending Model 
var CustomModel_1 = Model.extend('CustomModel_1');
var CustomModel_2 = Model.extend('CustomModel_2');
var CustomModel_3 = Model.extend('CustomModel_3');

// Attach the models to app instance and memory datasource
app.model(CustomModel_1, { dataSource: 'db' });
app.model(CustomModel_2, { dataSource: 'db' });
app.model(CustomModel_3, { dataSource: 'db' });


// Configure REST API path
app.set('restApiRoot', '/rest-api-root');

module.exports = app;
