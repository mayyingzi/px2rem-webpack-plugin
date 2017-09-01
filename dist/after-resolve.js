'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var REGEX = /\/node_modules\/(?:_css-loader)?(?:[@\.\w]+@)?css-loader\//;

var px2remLoaderFile = require.resolve('./px2rem-loader');

var handleLoaders = function handleLoaders(resource, loaders) {
  var idx = (0, _lodash.findIndex)(loaders, function (loader) {
    var path;
    if (loader.loader && typeof loader.loader === 'string') {
      path = loader.loader;
    } else {
      path = loader;
    }
    return REGEX.test(path.replace(/\\/g, '/'));
  });
  var isInNodeModules = resource.includes('/node_modules/');
  if (idx === -1 || isInNodeModules) return;
  loaders.splice(idx + 1, 0, px2remLoaderFile);
};

exports.default = function (data, next) {
  try {
    handleLoaders(data.resource, data.loaders);
    next(null, data);
  } catch (err) {
    next(err, data);
  }
};

module.exports = exports['default'];