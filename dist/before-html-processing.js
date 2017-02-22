'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _option = require('./option');

var _option2 = _interopRequireDefault(_option);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REGEX_SCRIPT = /(<head>[\s\S]*?)(<script\b[\s\S]*?<\/head>)/;
var REGEX_HEAD = /<\/head>/;
var REGEX_STYLE = /<head>/;
var script = function script(originScreenWidth) {
  return '\n  <script>\n  ;(function(){\n     var metaEl = document.querySelector(\'meta[name="viewport"]\');\n      var dpr = window.devicePixelRatio || 1;\n      var ua = window.navigator.userAgent\n      var isAndroid = /android/gi.test(ua);\n      var isIphone = /iphone/gi.test(ua)\n      if(isAndroid){\n        dpr = 1;\n      }else if(isIphone){\n        if (dpr > 2) {\n            dpr = 2\n        }\n      }\n      var scale = (1 / dpr).toFixed(2);\n      var contentWidth = window.screen.width * dpr;\n      metaEl.setAttribute(\'content\', \'initial-scale=\' + scale + \',maximum-scale=\' + scale +\n          \', minimum-scale=\' + scale + \',user-scalable=no\')\n      document.documentElement.setAttribute(\'data-dpr\', dpr);\n      addEventListener(\'DOMContentLoaded\', function () {\n          document.documentElement.style.fontSize = 100 * contentWidth / ' + originScreenWidth + ' + \'px\'\n      })\n  })();\n\n  </script>\n';
};
var style = '\n  <style> body { font-size: .16rem; } </style>\n';

var insertScript = function insertScript(source, script) {
  switch (true) {
    case REGEX_SCRIPT.test(source):
      return source.replace(REGEX_SCRIPT, function (whole, before, after) {
        return before + script + after;
      });
    case REGEX_HEAD.test(source):
      return source.replace(REGEX_HEAD, script + '</head>');
    default:
      return script + source;
  }
};

var insertStyle = function insertStyle(source, style) {
  if (REGEX_STYLE.test(source)) {
    return source.replace(REGEX_STYLE, '<head>' + style);
  } else {
    return style + source;
  }
};

exports.default = function (htmlPluginData, next) {
  var originScreenWidth = _option2.default.originScreenWidth;

  var html = insertScript(htmlPluginData.html, script(originScreenWidth));
  htmlPluginData.html = insertStyle(html, style);
  next();
};

module.exports = exports['default'];