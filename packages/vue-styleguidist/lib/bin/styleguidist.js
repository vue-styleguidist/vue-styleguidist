#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _minimist = _interopRequireDefault(require("minimist"));

var _kleur = _interopRequireDefault(require("kleur"));

var _glogg = _interopRequireDefault(require("glogg"));

var _error = _interopRequireDefault(require("react-styleguidist/lib/scripts/utils/error"));

var _config = _interopRequireDefault(require("../scripts/config"));

var _consts = _interopRequireDefault(require("../scripts/consts"));

var binutils = _interopRequireWildcard(require("../scripts/binutils"));

var _isPromise = _interopRequireDefault(require("../scripts/utils/isPromise"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var logger = (0, _glogg["default"])('rsg');
var argv = (0, _minimist["default"])(process.argv.slice(2));
var command = argv._[0]; // Do not show nasty stack traces for Styleguidist errors

process.on('uncaughtException', function (err) {
  if (err.code === 'EADDRINUSE') {
    binutils.printErrorWithLink("Another server is running at port ".concat(config.serverPort, " already. Please stop it or change the default port to continue."), 'You can change the port using the `serverPort` option in your style guide config:', _consts["default"].DOCS_CONFIG);
  } else if (err instanceof _error["default"]) {
    console.error(_kleur["default"].bold.red(err.message));

    if (err.stack) {
      logger.debug(err.stack);
    }
  } else {
    console.error(err.toString());
    console.error(err.stack);
  }

  process.exit(1);
}); // Make sure user has webpack installed

var vueVersion = require('vue/package.json').version;

var correctVueVersion = false;

if (vueVersion) {
  var _vueVersion$split = vueVersion.split('.'),
      _vueVersion$split2 = (0, _slicedToArray2["default"])(_vueVersion$split, 1),
      majorVue = _vueVersion$split2[0];

  correctVueVersion = parseInt(majorVue, 10) === 2;
}

if (!correctVueVersion) {
  throw new Error('This version of vue-styleguidist is only compatible with Vue 2.\n' + 'We are actively working on an updated version\n' + 'Join us on Github if you want to lend a hand.\n' + 'https://github.com/vue-styleguidist/vue-styleguidist/'); // + " Please install vue-styleguidist next with the following command\n"
  // + " npm iinstall --save-dev vue-styleguidist@next")
} // Make sure user has webpack installed


require('react-styleguidist/lib/scripts/utils/ensureWebpack'); // Set environment before loading style guide config because user’s webpack config may use it


var env = command === 'build' ? 'production' : 'development';
process.env.NODE_ENV = process.env.NODE_ENV || env; // Load style guide config

var config;

try {
  if (argv.verbose) {
    process.env.VUESG_VERBOSE = 'true';
  }

  var conf = (0, _config["default"])(argv.config, binutils.updateConfig);

  if ((0, _isPromise["default"])(conf)) {
    conf.then(runIt)["catch"](function (e) {
      throw e;
    });
  } else {
    runIt(conf);
  }
} catch (err) {
  if (err instanceof _error["default"]) {
    var link = _consts["default"].DOCS_CONFIG + (err.extra ? "#".concat(err.extra.toLowerCase()) : '');
    binutils.printErrorWithLink(err.message, "".concat(err.extra, "\n\nLearn how to configure your style guide:"), link);
    process.exit(1);
  } else {
    throw err;
  }
}

function runIt(conf) {
  config = conf;
  binutils.verbose('Styleguidist config:', config);

  switch (command) {
    case 'build':
      binutils.commandBuild(_objectSpread(_objectSpread({}, config), {}, {
        progressBar: argv.ci !== undefined ? !argv.ci : config.progressBar
      }));
      break;

    case 'server':
      binutils.commandServer(config, argv.open);
      break;

    default:
      binutils.commandHelp();
  }
}