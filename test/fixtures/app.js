// Copyright IBM Corp. 2014,2018. All Rights Reserved.
// Node module: grunt-loopback-sdk-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var app = loopback();

app.dataSource('db', { connector: 'memory'});

// Create custom models extending Model
var CustomModel_1 = app.registry.createModel('CustomModel_1');
var CustomModel_2 = app.registry.createModel('CustomModel_2');
var CustomModel_3 = app.registry.createModel('CustomModel_3');

// Attach the models to app instance and memory datasource
app.model(CustomModel_1, { dataSource: 'db' });
app.model(CustomModel_2, { dataSource: 'db' });
app.model(CustomModel_3, { dataSource: 'db' });


// Configure REST API path
app.set('restApiRoot', '/rest-api-root');

module.exports = app;
