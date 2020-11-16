#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var minimist_1 = __importDefault(require("minimist"));
var extractConfig_1 = __importDefault(require("./extractConfig"));
var docgen_1 = __importDefault(require("./docgen"));
/**
 * run the `config` recursively on pages
 * @param config
 */
function run(config) {
    var pages = config.pages;
    if (pages) {
        // to avoid re-rendering the same pages
        delete config.pages;
        pages.forEach(function (page) {
            var pageConf = __assign(__assign({}, config), page);
            run(pageConf);
        });
    }
    else {
        docgen_1.default(config);
    }
}
var _a = minimist_1.default(process.argv.slice(2), {
    alias: { c: 'configFile', w: 'watch' }
}), pathArray = _a._, configFile = _a.configFile, watch = _a.watch, cwd = _a.cwd;
var conf = extractConfig_1.default(cwd || process.cwd(), watch, configFile, pathArray);
run(conf);
//# sourceMappingURL=bin.js.map