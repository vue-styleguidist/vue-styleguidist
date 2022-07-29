const Vue = require('vue')
// eslint-disable-next-line import/no-unresolved
const { compileTemplate, compileScript } = require('@vue/compiler-sfc')

module.exports.h = Vue.h
module.exports.createApp = Vue.createApp
module.exports.isVue3 = true
module.exports.Vue2 = function () {}
module.exports.compileTemplate = compileTemplate
module.exports.compileScript = compileScript
