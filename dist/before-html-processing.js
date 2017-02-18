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
  return '\n  <script>\n      if (document.readyState === \'complete\') {\n          document.documentElement.style.fontSize = 100 * innerWidth / 750 + \'px\'\n      } else {\n          addEventListener(\'DOMContentLoaded\', function () {\n              console.log(\'in dom loaded\')\n              document.documentElement.style.fontSize = 100 * innerWidth / 750 + \'px\'\n          })\n      }\n  </script>\n';
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