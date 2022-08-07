import Vue from 'vue'
// eslint-disable-next-line import/no-unresolved
import { compile } from 'vue-template-compiler'

export const h = () => {}
export const createApp = () => {}
export const isVue3 = false
export { Vue as Vue2 }
export const compileTemplate = ({ source: template }) => ({
	code: compile(template).render
})
export const compileScript = () => ({ type: 'script' })
