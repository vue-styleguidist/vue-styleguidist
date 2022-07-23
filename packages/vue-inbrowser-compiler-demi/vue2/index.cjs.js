const Vue = require('vue')
const VueTemplateCompiler = require('vue-template-compiler')

module.exports.h = () => {}
module.exports.createApp = () => {}
module.exports.resolveComponent = name => name
module.exports.isVue3 = false
module.exports.Vue2 = Vue
module.exports.compileTemplate = ({ source: template }) => ({
	code: VueTemplateCompiler.compile(template).render
})
module.exports.compileScript = () => ({ type: 'script' })
