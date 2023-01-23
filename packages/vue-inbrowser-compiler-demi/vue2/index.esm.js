import Vue from 'vue'
// eslint-disable-next-line import/no-unresolved
import { parseComponent, compile } from 'vue-template-compiler'

export const h = () => {}
export const createApp = () => {}
export const isVue3 = false
export { Vue as Vue2 }
export const compileTemplate = ({ source: template }) => {
	const compiled = compile(template)
	return {
		code: compiled.render,
		staticRenderFns: compiled.staticRenderFns
	}
}
export { parseComponent }
export const compileScript = () => ({ type: 'script' })
