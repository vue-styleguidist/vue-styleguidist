"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
Object.defineProperty(exports, "Config", {
  enumerable: true,
  get: function get() {
    return _StyleGuide.StyleguidistConfig;
  }
});

require("react-styleguidist/lib/scripts/utils/ensureWebpack");

var _logger = _interopRequireDefault(require("react-styleguidist/lib/scripts/logger"));

var _StyleGuide = require("../types/StyleGuide");

var _build = _interopRequireDefault(require("./build"));

var _server2 = _interopRequireDefault(require("./server"));

var _makeWebpackConfig2 = _interopRequireDefault(require("./make-webpack-config"));

var _config = _interopRequireDefault(require("./config"));

var binutils = _interopRequireWildcard(require("./binutils"));

var _isPromise = _interopRequireDefault(require("./utils/isPromise"));

// Make sure user has webpack installed

/**
 * Initialize Vue Styleguide API.
 *
 * @param {object} [config] Styleguidist config.
 * @param {function} [updateConfig] update config post resolution
 * @returns {object} API.
 */
function _default(config, updateConfig) {
  var configInternal = (0, _config["default"])(config, function (cfg) {
    (0, _logger["default"])(cfg.logger, cfg.verbose, {});

    if (typeof updateConfig === 'function') {
      updateConfig(cfg);
    }

    return cfg;
  });

  if ((0, _isPromise["default"])(configInternal)) {
    return configInternal.then(function (conf) {
      return exportBuildUtils(conf);
    })["catch"](function (e) {
      throw e;
    });
  } else {
    return exportBuildUtils(configInternal);
  }
}

function exportBuildUtils(config) {
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