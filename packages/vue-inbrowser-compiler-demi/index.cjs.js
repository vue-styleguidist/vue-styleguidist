const Vue = require('vue')
// eslint-disable-next-line import/no-unresolved
const VueTemplateCompiler = require('vue-template-compiler')

module.exports.h = () => {}
module.exports.createApp = () => {}
module.exports.isVue3 = false
module.exports.Vue2 = Vue
module.exports.compileTemplate = ({ source: template }) => {
  const compiled = VueTemplateCompiler.compile(template)
	return {
		code: compiled.render,
    staticRenderFns: compiled.staticRenderFns
	}
}
module.exports.parseComponent = VueTemplateCompiler.parseComponent
module.exports.compileScript = () => ({ type: 'script' })
