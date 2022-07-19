import { compileTemplate as compile } from '@vue/compiler-sfc'
export { h, resolveComponent, createApp } from 'vue'
export const isVue3 = true
export const Vue2 = () => {}
export const compileTemplate = template =>
	compile({ source: template, filename: '<Example>.vue', id: '' }).code
