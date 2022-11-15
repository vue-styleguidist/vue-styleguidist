// eslint-disable-next-line import/no-unresolved
import { parse }  from '@vue/compiler-sfc'

// eslint-disable-next-line import/no-unresolved
export { compileTemplate, compileScript } from '@vue/compiler-sfc'
export { h, createApp } from 'vue'
export const isVue3 = true
export const Vue2 = () => {}
export const parseComponent = (source, opts) => {
  const { descriptor } = parse(source, opts)
  return descriptor
}