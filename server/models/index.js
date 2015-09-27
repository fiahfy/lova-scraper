'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
var config = require('../config/mongodb');

mongoose.connect(config.uri);

mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + config.uri);
});

mongoose.connection.on('error',function(err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    module.exports[moduleName] = require('./' + moduleName);
  }
});