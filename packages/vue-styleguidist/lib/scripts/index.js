"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("react-styleguidist/lib/scripts/utils/ensureWebpack");

var _logger = _interopRequireDefault(require("react-styleguidist/lib/scripts/logger"));

var _build = _interopRequireDefault(require("./build"));

var _server2 = _interopRequireDefault(require("./server"));

var _makeWebpackConfig2 = _interopRequireDefault(require("./make-webpack-config"));

var _config = _interopRequireDefault(require("./config"));

var binutils = _interopRequireWildcard(require("./binutils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Make sure user has webpack installed

/**
 * Initialize Vue Styleguide API.
 *
 * @param {object} [config] Styleguidist config.
 * @param {function} [updateConfig] update config post resolution
 * @returns {object} API.
 */
function _default(config, updateConfig) {
  config = (0, _config["default"])(config, function (config) {
    (0, _logger["default"])(config.logger, config.verbose, {});

    if (typeof updateConfig === 'function') {
      updateConfig(config);
    }

    return config;
  });
  return {
    build: function build(callback) {
      return (0, _build["default"])(config, function (err, stats) {
        return callback(err, config, stats);
      });
    },
    server: function server(callback) {
      return (0, _server2["default"])(config, function (err) {
        return callback(err, config);
      });
    },
    makeWebpackConfig: function makeWebpackConfig(env) {
      return (0, _makeWebpackConfig2["default"])(config, env || 'production');
    },
    binutils: {
      server: function server(open) {
        return binutils.commandServer(config, open);
      },
      build: function build() {
        return binutils.commandBuild(config);
      }
    }
  };
}