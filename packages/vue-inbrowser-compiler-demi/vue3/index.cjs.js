const Vue = require('vue')
const { compile } = require('@vue/compiler-dom')

module.exports.h = Vue.h
module.exports.createApp = Vue.createApp
module.exports.resolveComponent = Vue.resolveComponent
module.exports.isVue3 = true
module.exports.Vue2 = function () {}
module.exports.compileTemplate = (template, options) =>
	compile(template, { ...options, prefixIdentifiers: true }).code
