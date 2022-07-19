const Vue = require('vue')
const VueCompilerSfc = require('@vue/compiler-sfc')

module.exports.h = Vue.h
module.exports.createApp = Vue.createApp
module.exports.resolveComponent = Vue.resolveComponent
module.exports.isVue3 = true
module.exports.Vue2 = function () {}
module.exports.compileTemplate = template =>
	VueCompilerSfc.compileTemplate({ source: template, filename: '<Example>.vue', id: '' }).code
