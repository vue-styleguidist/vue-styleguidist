import { compile } from '@vue/compiler-dom'
export { h, resolveComponent, createApp } from 'vue'
export const isVue3 = true
export const Vue2 = () => {}
export const compileTemplate = (template, options) =>
	compile(template, { ...options, prefixIdentifiers: true }).code
